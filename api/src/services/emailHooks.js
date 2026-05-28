import { getAdminClient } from '../lib/supabase.js'
import { logger } from '../utils/logger.js'
import { sendWelcomeEmail, sendOrderConfirmationEmail } from '../lib/email.js'

async function alreadySent(supabase, { emailType, customerId, orderId }) {
  let q = supabase.from('order_emails').select('id').eq('email_type', emailType).limit(1)
  if (emailType === 'welcome') q = q.eq('customer_id', customerId)
  else q = q.eq('order_id', orderId)
  const { data, error } = await q.maybeSingle()
  if (error) {
    logger.warn({ err: error, emailType, customerId, orderId }, 'order_emails dedupe lookup failed; will attempt send')
    return false
  }
  return Boolean(data?.id)
}

async function recordAttempt(supabase, row) {
  const { error } = await supabase.from('order_emails').insert(row)
  if (error) {
    // Most likely unique-index race — benign
    logger.warn({ err: error, emailType: row.email_type, orderId: row.order_id }, 'order_emails insert failed (likely duplicate)')
  }
}

/**
 * Fire the welcome email if it hasn't been sent for this customer yet.
 * Never throws; safe to await or fire-and-forget.
 */
export async function fireWelcomeEmail({ customerId, name, email }) {
  try {
    if (!email || !customerId) return { sent: false, skipped: true }
    const supabase = getAdminClient()
    if (!supabase) return { sent: false, skipped: true }

    if (await alreadySent(supabase, { emailType: 'welcome', customerId })) {
      return { sent: false, skipped: true }
    }

    const result = await sendWelcomeEmail({ to: email, customerName: name })
    await recordAttempt(supabase, {
      order_id: null,
      customer_id: customerId,
      email_type: 'welcome',
      to_email: email,
      resend_message_id: result.sent ? result.id ?? null : null,
      error: result.sent ? null : result.error ?? 'send_failed',
    })
    return { sent: !!result.sent }
  } catch (err) {
    logger.warn({ err, customerId }, 'fireWelcomeEmail unexpected error')
    return { sent: false }
  }
}

/**
 * Fire the order confirmation email for an order. Idempotent via the
 * unique (order_id, email_type) index. Never throws.
 */
export async function fireOrderConfirmationEmail({
  orderId,
  customerId,
  name,
  email,
  orderNumber,
  totalInr,
  items,
  placedAt,
}) {
  try {
    if (!email || !orderId) return { sent: false, skipped: true }
    const supabase = getAdminClient()
    if (!supabase) return { sent: false, skipped: true }

    if (await alreadySent(supabase, { emailType: 'order_confirmation', orderId })) {
      return { sent: false, skipped: true }
    }

    const result = await sendOrderConfirmationEmail({
      to: email,
      customerName: name,
      orderNumber,
      totalInr,
      items,
      placedAt,
    })
    await recordAttempt(supabase, {
      order_id: orderId,
      customer_id: customerId ?? null,
      email_type: 'order_confirmation',
      to_email: email,
      resend_message_id: result.sent ? result.id ?? null : null,
      error: result.sent ? null : result.error ?? 'send_failed',
    })
    return { sent: !!result.sent }
  } catch (err) {
    logger.warn({ err, orderId }, 'fireOrderConfirmationEmail unexpected error')
    return { sent: false }
  }
}
