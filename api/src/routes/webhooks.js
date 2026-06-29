/**
 * webhooks.js — Razorpay + Shiprocket webhook handlers (Phase C live).
 *
 * Razorpay: HMAC-verifies the raw body against RAZORPAY_WEBHOOK_SECRET.
 *           server.js stores the raw buffer on req.rawBody.
 *
 * Shiprocket: no inbound signature scheme on the standard plan; we rely on
 *             unguessable AWB / order ids embedded in the payload.
 */
import { Router } from 'express'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import { verifyWebhookSignature } from '../lib/razorpay.js'
import {
  findOrderByRazorpayId,
  findOrderByShipmentRef,
  markOrderPaid,
  applyShipmentDetails,
  getOrderForShipment,
} from '../services/orderService.js'
import { fireOrderConfirmationEmail } from '../services/emailHooks.js'
import { sendPurchaseEvent } from '../lib/metaCapi.js'
import { createShipmentForOrder } from './checkout.js'

const router = Router()

/**
 * POST /api/webhooks/razorpay
 */
router.post('/razorpay', async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  if (!signature || !req.rawBody) {
    return res.status(400).json({ error: 'MISSING_SIGNATURE' })
  }
  if (!config.razorpay.webhookSecret) {
    logger.warn('Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is empty')
    return res.status(503).json({ error: 'WEBHOOK_NOT_CONFIGURED' })
  }
  if (!verifyWebhookSignature({ rawBody: req.rawBody, signature })) {
    logger.warn('Razorpay webhook signature mismatch')
    return res.status(400).json({ error: 'INVALID_SIGNATURE' })
  }

  const event = req.body?.event
  const payment = req.body?.payload?.payment?.entity
  logger.info({ event, paymentId: payment?.id, orderId: payment?.order_id }, 'Razorpay webhook')

  try {
    switch (event) {
      case 'payment.captured':
      case 'order.paid': {
        if (!payment?.order_id) break
        const order = await findOrderByRazorpayId(payment.order_id)
        if (!order) {
          logger.warn({ razorpayOrderId: payment.order_id }, 'Webhook for unknown order')
          break
        }
        const { alreadyPaid } = await markOrderPaid({ internalOrderId: order.id, razorpayPaymentId: payment.id })
        // Create the Shiprocket shipment. This is the safety net for when the
        // browser never calls verify-payment (tab closed, network drop, or a
        // webhook that beat it). Idempotent — won't duplicate if already created.
        void createShipmentForOrder(order.id).catch((err) =>
          logger.error({ err: err.message, orderId: order.id }, 'Shiprocket shipment creation failed from webhook (will retry via cron)')
        )
        // Fire-and-forget confirmation email; idempotent via unique index
        void (async () => {
          try {
            const full = await getOrderForShipment(order.id)
            if (full?.customer?.email) {
              await fireOrderConfirmationEmail({
                orderId: full.id,
                customerId: full.customer.id,
                name: full.customer.name,
                email: full.customer.email,
                orderNumber: full.order_number,
                totalInr: Number(full.total),
                items: (full.order_items ?? []).map((it) => ({
                  product_name: it.product_name_snapshot,
                  variant_label: it.variant_label_snapshot,
                  qty: it.qty,
                  unit_price: it.unit_price,
                  line_total: it.line_total,
                })),
                placedAt: new Date().toISOString(),
              })
            }
            // Server-side Purchase fallback — only when this webhook is the FIRST
            // to mark the order paid (browser never called verify-payment). No
            // browser context here, but hashed email/phone/address still match.
            // Deduped against the browser pixel via event_id.
            if (!alreadyPaid && full?.customer) {
              await sendPurchaseEvent({
                internalOrderId: full.id,
                orderNumber: full.order_number,
                value: Number(full.total),
                customer: full.customer,
                address: full.shipping_address,
                items: full.order_items,
              })
            }
          } catch (err) {
            logger.warn({ err, orderId: order.id }, 'razorpay-webhook post-confirmation hooks failed')
          }
        })()
        break
      }
      case 'payment.failed': {
        if (!payment?.order_id) break
        const order = await findOrderByRazorpayId(payment.order_id)
        if (!order) break
        // Don't auto-cancel — customer may retry. Just log.
        logger.warn({ orderId: order.id, reason: payment?.error_description }, 'Payment failed')
        break
      }
      case 'refund.processed':
      case 'refund.created': {
        const refundOrderId = req.body?.payload?.refund?.entity?.payment_id
        logger.info({ refundOrderId }, 'Refund event received (manual handling)')
        break
      }
      default:
        logger.debug({ event }, 'Unhandled Razorpay event')
    }
  } catch (err) {
    logger.error({ err: err.message, event }, 'Razorpay webhook handler failed')
    // Still return 200 so Razorpay doesn't retry indefinitely on our bug
  }

  return res.status(200).json({ received: true })
})

/**
 * POST /api/webhooks/shiprocket
 *
 * Shiprocket sends status updates with shape (roughly):
 *   { awb: '...', current_status: 'Shipped' | 'Out for Delivery' | 'Delivered' | ...,
 *     order_id: '<their internal id>', shipment_status: '...', etc. }
 */
router.post('/shiprocket', async (req, res) => {
  const body = req.body ?? {}
  const awb = body.awb ?? body.awb_code
  const shiprocketOrderId = body.order_id ? String(body.order_id) : null
  const status = (body.current_status ?? body.shipment_status ?? '').toLowerCase()

  logger.info({ awb, shiprocketOrderId, status }, 'Shiprocket webhook')

  if (!awb && !shiprocketOrderId) {
    return res.status(200).json({ received: true, message: 'no identifier — ignored' })
  }

  try {
    const order = await findOrderByShipmentRef({ awbCode: awb, shiprocketOrderId })
    if (!order) {
      logger.warn({ awb, shiprocketOrderId }, 'Shiprocket webhook for unknown order')
      return res.status(200).json({ received: true, matched: false })
    }

    const details = { awbCode: awb ?? undefined, shiprocketOrderId: shiprocketOrderId ?? undefined }
    if (body.courier_name) details.courierName = body.courier_name

    if (/(out.?for.?delivery|shipped|in.?transit|picked.?up)/i.test(status)) {
      if (!order.shipped_at) details.shippedAt = new Date().toISOString()
      details.status = 'shipped'
    } else if (/delivered/i.test(status)) {
      details.deliveredAt = new Date().toISOString()
      details.status = 'delivered'
    } else if (/(rto|return|cancel)/i.test(status)) {
      details.status = 'cancelled'
    }

    await applyShipmentDetails(order.id, details)
  } catch (err) {
    logger.error({ err: err.message }, 'Shiprocket webhook handler failed')
  }

  return res.status(200).json({ received: true })
})

export default router
