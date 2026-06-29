/**
 * metaCapi.js — Meta Conversions API (server-side) Purchase events.
 *
 * Client-side pixel fires are blocked for ~25% of mobile traffic (ad blockers,
 * iOS/Safari ITP, network filters). Sending the Purchase from the server after
 * order confirmation recovers those conversions, improves match quality, and
 * gives Meta a more reliable signal for optimisation.
 *
 * Deduplication: the browser pixel and this server event share the SAME
 * `event_id` (`purchase_<internalOrderId>`), so Meta collapses the two into one
 * conversion instead of double-counting.
 *
 * PII (email, phone, name, location) is SHA-256 hashed here before it leaves the
 * server, per Meta's matching spec. IP / user-agent / fbp / fbc are sent raw (as
 * Meta requires) to strengthen matching.
 */
import crypto from 'node:crypto'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const GRAPH = 'https://graph.facebook.com'

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

// Normalise (trim + lowercase) then hash. Returns undefined for empty values.
function hashed(value) {
  if (value == null) return undefined
  const v = String(value).trim().toLowerCase()
  return v ? sha256(v) : undefined
}

function hashedPhone(phone) {
  if (!phone) return undefined
  let d = String(phone).replace(/\D/g, '')
  if (d.length === 10) d = '91' + d // default to India country code
  return d ? sha256(d) : undefined
}

function hashedZip(zip) {
  if (!zip) return undefined
  const v = String(zip).trim().toLowerCase().replace(/\s+/g, '')
  return v ? sha256(v) : undefined
}

/** Deterministic id shared with the browser pixel so Meta dedupes the two. */
export function purchaseEventId(internalOrderId) {
  return `purchase_${internalOrderId}`
}

/**
 * Send a server-side Purchase event to the Meta Conversions API.
 * Fire-and-forget by design: never throws — logs and returns a status object.
 *
 * @param {{
 *   internalOrderId: string,
 *   orderNumber: string,
 *   value: number,
 *   currency?: string,
 *   customer?: { id?: string, name?: string, email?: string, phone?: string },
 *   address?: { city?: string, state?: string, pincode?: string, country?: string },
 *   items?: Array<{ variant?: { id?: string }, variant_id?: string, id?: string, qty: number, unit_price: number|string }>,
 *   eventSourceUrl?: string,
 *   clientIpAddress?: string,
 *   clientUserAgent?: string,
 *   fbp?: string,
 *   fbc?: string,
 * }} input
 */
export async function sendPurchaseEvent({
  internalOrderId,
  orderNumber,
  value,
  currency = 'INR',
  customer = {},
  address = {},
  items = [],
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
}) {
  if (!config.meta.configured) {
    logger.warn({ orderNumber }, 'Meta CAPI not configured — Purchase event skipped')
    return { skipped: true }
  }

  const [firstName, ...rest] = String(customer.name ?? '').trim().split(/\s+/)
  const countryRaw = address.country && address.country !== 'India' ? address.country : 'in'

  const user_data = {
    em: hashed(customer.email),
    ph: hashedPhone(customer.phone),
    fn: hashed(firstName),
    ln: hashed(rest.join(' ')),
    ct: hashed(address.city),
    st: hashed(address.state),
    zp: hashedZip(address.pincode),
    country: hashed(countryRaw),
    external_id: hashed(customer.id ? String(customer.id) : customer.email),
    client_ip_address: clientIpAddress || undefined,
    client_user_agent: clientUserAgent || undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  }
  for (const k of Object.keys(user_data)) if (user_data[k] === undefined) delete user_data[k]

  const contents = (items ?? []).map((it) => ({
    id: it.variant?.id ?? it.variant_id ?? it.id ?? 'PRIMAL-SKU',
    quantity: it.qty,
    item_price: Number(it.unit_price),
  }))

  const custom_data = {
    currency,
    value: Number(value),
    content_type: 'product',
    content_ids: contents.map((c) => c.id),
    contents,
    num_items: contents.reduce((s, c) => s + (c.quantity ?? 0), 0),
    order_id: orderNumber,
  }

  const event = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: purchaseEventId(internalOrderId),
    action_source: 'website',
    event_source_url: eventSourceUrl || 'https://primalnutrition.in',
    user_data,
    custom_data,
  }

  const body = { data: [event] }
  if (config.meta.testEventCode) body.test_event_code = config.meta.testEventCode

  const url = `${GRAPH}/${config.meta.apiVersion}/${config.meta.pixelId}/events?access_token=${encodeURIComponent(config.meta.accessToken)}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const json = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      logger.error({ status: resp.status, json, orderNumber }, 'Meta CAPI Purchase returned error')
      return { ok: false, status: resp.status, body: json }
    }
    logger.info(
      { orderNumber, eventId: event.event_id, received: json.events_received, fbtrace: json.fbtrace_id },
      'Meta CAPI Purchase sent'
    )
    return { ok: true, body: json }
  } catch (err) {
    logger.error({ err: err.message, orderNumber }, 'Meta CAPI Purchase send failed')
    return { ok: false, error: err.message }
  } finally {
    clearTimeout(timer)
  }
}
