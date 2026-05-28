import { getAdminClient } from '../lib/supabase.js'
import { logger } from '../utils/logger.js'
import { sendDay14CheckinEmail, sendReorderReminderEmail } from '../lib/email.js'

const BATCH_SIZE = 50

function requireSupabase() {
  const client = getAdminClient()
  if (!client) {
    const err = new Error('Supabase not configured')
    err.statusCode = 503
    err.code = 'SUPABASE_NOT_CONFIGURED'
    throw err
  }
  return client
}

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

/**
 * Record an attempt in order_emails so we don't retry within the bucket window.
 */
async function recordEmailAttempt(supabase, { orderId, customerId, emailType, toEmail, resendMessageId, error }) {
  const row = {
    order_id: orderId,
    customer_id: customerId,
    email_type: emailType,
    to_email: toEmail ?? '',
    resend_message_id: resendMessageId ?? null,
    error: error ?? null,
  }
  const { error: insErr } = await supabase.from('order_emails').insert(row)
  if (insErr) {
    // Most likely a race against the unique (order_id, email_type) constraint —
    // treat as benign so we don't double-send.
    logger.warn(
      { err: insErr, orderId, emailType },
      'order_emails insert failed (possibly duplicate)'
    )
  }
}

/**
 * Find delivered orders where (delivered_at <= now - <daysSinceDelivery>) within the
 * recent window, and no order_emails row of <emailType> exists yet, then send <sendFn>
 * for each. Returns { scanned, sent, errors }.
 */
async function processBucket({ emailType, daysSinceDelivery, windowDays, sendFn, withFavoriteProduct = false }) {
  const supabase = requireSupabase()
  const upperBound = daysAgoIso(daysSinceDelivery)        // delivered_at <= now - N days
  const lowerBound = daysAgoIso(daysSinceDelivery + windowDays) // delivered_at > now - (N + window) days

  // Find candidate orders that have NO row in order_emails for this email_type yet.
  // Supabase JS doesn't support NOT EXISTS sub-queries cleanly, so we fetch a batch
  // of candidate orders ordered oldest-first and filter client-side via a left join.
  const { data: candidates, error: cErr } = await supabase
    .from('orders')
    .select('id, customer_id, delivered_at, order_emails!left(email_type)')
    .eq('status', 'delivered')
    .lte('delivered_at', upperBound)
    .gt('delivered_at', lowerBound)
    .order('delivered_at', { ascending: true })
    .limit(BATCH_SIZE * 4)

  if (cErr) {
    logger.error({ err: cErr, emailType }, 'Failed to query candidate orders for followup')
    return { scanned: 0, sent: 0, errors: 1 }
  }

  // Filter out orders that already have a row for this email_type
  const pending = (candidates ?? [])
    .filter((o) => {
      const rows = Array.isArray(o.order_emails) ? o.order_emails : []
      return !rows.some((r) => r.email_type === emailType)
    })
    .slice(0, BATCH_SIZE)

  let sent = 0
  let errors = 0
  const scanned = pending.length

  for (const order of pending) {
    try {
      // Fetch customer
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .select('id, name, email')
        .eq('id', order.customer_id)
        .single()

      if (custErr || !customer) {
        logger.warn({ err: custErr, orderId: order.id }, 'Followup: customer lookup failed')
        errors += 1
        continue
      }

      if (!customer.email || String(customer.email).trim() === '') {
        await recordEmailAttempt(supabase, {
          orderId: order.id,
          customerId: customer.id,
          emailType,
          toEmail: '',
          error: 'no_email',
        })
        continue
      }

      let favoriteProduct = null
      if (withFavoriteProduct) {
        const { data: summary, error: sErr } = await supabase
          .from('customer_summary')
          .select('favorite_product_name')
          .eq('customer_id', customer.id)
          .maybeSingle()
        if (sErr) {
          logger.warn(
            { err: sErr, customerId: customer.id },
            'Followup: failed to fetch favorite product, continuing without it'
          )
        } else {
          favoriteProduct = summary?.favorite_product_name ?? null
        }
      }

      const sendArgs = withFavoriteProduct
        ? { to: customer.email, customerName: customer.name, favoriteProduct }
        : { to: customer.email, customerName: customer.name }

      const result = await sendFn(sendArgs)

      if (result?.sent) {
        await recordEmailAttempt(supabase, {
          orderId: order.id,
          customerId: customer.id,
          emailType,
          toEmail: customer.email,
          resendMessageId: result.id ?? null,
        })
        sent += 1
      } else {
        await recordEmailAttempt(supabase, {
          orderId: order.id,
          customerId: customer.id,
          emailType,
          toEmail: customer.email,
          error: result?.error ?? 'send_failed',
        })
        errors += 1
      }
    } catch (err) {
      logger.error({ err, orderId: order.id, emailType }, 'Unexpected error processing followup')
      errors += 1
    }
  }

  logger.info({ emailType, scanned, sent, errored: errors }, 'Followup bucket processed')
  return { scanned, sent, errors }
}

export async function runDailyFollowups() {
  const day14 = await processBucket({
    emailType: 'day14_checkin',
    daysSinceDelivery: 14,
    windowDays: 7, // catch orders delivered between 14 and 21 days ago
    sendFn: sendDay14CheckinEmail,
    withFavoriteProduct: false,
  })

  const reorder = await processBucket({
    emailType: 'reorder_30d',
    daysSinceDelivery: 30,
    windowDays: 30, // catch orders delivered between 30 and 60 days ago
    sendFn: sendReorderReminderEmail,
    withFavoriteProduct: true,
  })

  return { day14, reorder }
}
