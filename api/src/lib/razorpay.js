/**
 * razorpay.js — Razorpay client + signature verification helper.
 * Phase C stub — client is constructed but endpoints are not yet wired.
 */
import crypto from 'crypto'
import { config } from '../config.js'

/**
 * Create a Razorpay order via the REST API (no SDK needed — plain fetch).
 * Returns the Razorpay order object with `id`, `amount`, `currency`, etc.
 *
 * @param {{ amount: number, currency?: string, receipt: string }} opts
 */
export async function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing)')
  }

  const auth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString(
    'base64'
  )

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: Math.round(amount), currency, receipt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Razorpay order creation failed: ${err.error?.description ?? res.statusText}`)
  }

  return res.json()
}

/**
 * Verify Razorpay payment signature.
 * Call after the browser returns from Razorpay checkout.
 *
 * @param {{ orderId: string, paymentId: string, signature: string }} params
 * @returns {boolean}
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body)
    .digest('hex')
  return expected === signature
}

/**
 * Verify Razorpay webhook signature.
 * Requires raw (un-parsed) request body.
 *
 * @param {{ rawBody: Buffer|string, signature: string }} params
 * @returns {boolean}
 */
export function verifyWebhookSignature({ rawBody, signature }) {
  const expected = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex')
  return expected === signature
}
