/**
 * shiprocket.js — Shiprocket API client with auth-token caching.
 * Phase C stub — helpers are defined but checkout routes are not yet wired.
 */
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let _token = null
let _tokenExpiry = 0

/**
 * Get (or refresh) the Shiprocket auth token.
 * Token is valid for ~24h; we refresh 5 min before expiry.
 */
async function getToken() {
  const now = Date.now()
  if (_token && now < _tokenExpiry - 5 * 60 * 1000) {
    return _token
  }

  if (!config.shiprocket.email || !config.shiprocket.password) {
    throw new Error(
      'Shiprocket is not configured (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD missing)'
    )
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.shiprocket.email,
      password: config.shiprocket.password,
    }),
  })

  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${res.statusText}`)
  }

  const data = await res.json()
  _token = data.token
  _tokenExpiry = now + 24 * 60 * 60 * 1000 // 24h
  logger.debug('Shiprocket token refreshed')
  return _token
}

async function shiprocketFetch(path, options = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      `Shiprocket API error [${path}]: ${err.message ?? err.error ?? res.statusText}`
    )
  }

  return res.json()
}

/**
 * Check serviceability for a pincode.
 * @param {{ pickupPincode: string, deliveryPincode: string, weight: number, cod?: boolean }} params
 */
export async function checkServiceability({ pickupPincode, deliveryPincode, weight, cod = false }) {
  const codFlag = cod ? 1 : 0
  return shiprocketFetch(
    `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${codFlag}`
  )
}

/**
 * Create a Shiprocket shipment order.
 * @param {object} orderPayload — matches Shiprocket order creation schema
 */
export async function createShipment(orderPayload) {
  return shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  })
}

/**
 * Assign a courier + generate AWB for a shipment.
 * Without this, the order sits as "NEW" in Shiprocket and never actually ships.
 *
 * @param {{ shipmentId: string|number, courierId?: string|number }} params
 *   shipmentId — returned by createShipment
 *   courierId — optional; omit to let Shiprocket pick the recommended courier
 */
export async function assignAwb({ shipmentId, courierId }) {
  const body = { shipment_id: Number(shipmentId) }
  if (courierId) body.courier_id = Number(courierId)
  return shiprocketFetch('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Schedule pickup for a shipment (post-AWB).
 * @param {{ shipmentId: string|number }} params
 */
export async function requestPickup({ shipmentId }) {
  return shiprocketFetch('/courier/generate/pickup', {
    method: 'POST',
    body: JSON.stringify({ shipment_id: [Number(shipmentId)] }),
  })
}

/**
 * Track a shipment by AWB code.
 * @param {string} awb
 */
export async function trackShipment(awb) {
  return shiprocketFetch(`/courier/track/awb/${awb}`)
}
