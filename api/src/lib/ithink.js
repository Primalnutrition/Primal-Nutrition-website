/**
 * ithink.js — iThink Logistics client.
 *
 * Uses the Sync Order API (api_v3/order/sync.json), which copies an order into
 * the iThink panel WITHOUT booking a courier or assigning an AWB. Courier
 * booking stays manual in the panel.
 *
 * Docs: https://docs.ithinklogistics.com/doc-sync-order/3
 */
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

export function isIthinkConfigured() {
  return !!(config.ithink.accessToken && config.ithink.secretKey)
}

/** iThink wants "dd-mm-yyyy HH:MM:SS" in IST. */
export function ithinkDate(d = new Date()) {
  const ist = new Date(new Date(d).getTime() + 5.5 * 60 * 60 * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(ist.getUTCDate())}-${p(ist.getUTCMonth() + 1)}-${ist.getUTCFullYear()} ` +
    `${p(ist.getUTCHours())}:${p(ist.getUTCMinutes())}:${p(ist.getUTCSeconds())}`
}

/**
 * Sync one or more shipments (max 25) into iThink.
 * Throws on transport errors or when iThink reports a failure.
 *
 * @param {object[]} shipments — objects in iThink's shipment shape
 * @returns {Promise<object>} raw iThink response
 */
export async function syncOrders(shipments) {
  if (!isIthinkConfigured()) {
    throw new Error('iThink is not configured (ITHINK_ACCESS_TOKEN / ITHINK_SECRET_KEY missing)')
  }
  const res = await fetch(`${config.ithink.baseUrl}/api_v3/order/sync.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cache-control': 'no-cache' },
    body: JSON.stringify({
      data: {
        shipments,
        access_token: config.ithink.accessToken,
        secret_key: config.ithink.secretKey,
      },
    }),
  })

  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = { raw: text.slice(0, 500) }
  }

  // iThink replies { status: 'success'|'error', status_code, html_message, data: {...} }.
  // Per-shipment results (when present) carry their own status.
  const topOk = res.ok && String(body?.status ?? '').toLowerCase() === 'success'
  const perShipment = body?.data && typeof body.data === 'object' ? Object.values(body.data) : []
  const failed = perShipment.filter(
    (r) => r && typeof r === 'object' && r.status && String(r.status).toLowerCase() !== 'success'
  )

  if (!topOk || failed.length) {
    const msg =
      failed.map((r) => r.remark || r.message).filter(Boolean).join('; ') ||
      body?.html_message || body?.message || body?.raw || `HTTP ${res.status}`
    logger.warn({ status: res.status, body }, 'iThink sync rejected')
    throw new Error(`iThink sync failed: ${String(msg).slice(0, 300)}`)
  }

  return body
}
