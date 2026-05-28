import { Resend } from 'resend'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import { buildWelcomeHtml, buildWelcomeText } from '../templates/emails/welcome.js'
import { buildOrderConfirmationHtml, buildOrderConfirmationText } from '../templates/emails/orderConfirmation.js'
import { buildDay14CheckinHtml, buildDay14CheckinText } from '../templates/emails/day14Checkin.js'
import { buildReorder30dHtml, buildReorder30dText } from '../templates/emails/reorder30d.js'

let _client = null
function getClient() {
  if (!_client) _client = new Resend(config.resend.apiKey)
  return _client
}

async function send({ to, subject, html, text }) {
  if (!config.resend.configured) {
    logger.warn({ to, subject }, 'Resend not configured — email skipped')
    return { sent: false, error: 'not_configured' }
  }
  try {
    const { data, error } = await getClient().emails.send({
      from: config.resend.fromEmail,
      to,
      subject,
      html,
      text,
    })
    if (error) {
      logger.error({ err: error, to, subject }, 'Resend send returned error')
      return { sent: false, error: error.message || 'send_failed' }
    }
    return { sent: true, id: data?.id ?? null }
  } catch (err) {
    logger.error({ err, to, subject }, 'Resend send threw')
    return { sent: false, error: err.message || 'send_threw' }
  }
}

export async function sendWelcomeEmail({ to, customerName }) {
  return send({
    to,
    subject: 'Welcome To The Brotherhood Of Performance',
    html: buildWelcomeHtml({ customerName }),
    text: buildWelcomeText({ customerName }),
  })
}

export async function sendOrderConfirmationEmail({ to, customerName, orderNumber, totalInr, items, placedAt }) {
  return send({
    to,
    subject: 'Your Order is Confirmed – The Power to Perform Starts Now',
    html: buildOrderConfirmationHtml({ customerName, orderNumber, totalInr, items, placedAt }),
    text: buildOrderConfirmationText({ customerName, orderNumber, totalInr, items, placedAt }),
  })
}

export async function sendDay14CheckinEmail({ to, customerName }) {
  return send({
    to,
    subject: 'Notice Anything Different Yet?',
    html: buildDay14CheckinHtml({ customerName }),
    text: buildDay14CheckinText({ customerName }),
  })
}

export async function sendReorderReminderEmail({ to, customerName, favoriteProduct }) {
  return send({
    to,
    subject: "Your Stack Is Running Low. Your Edge Shouldn't Be.",
    html: buildReorder30dHtml({ customerName, favoriteProduct }),
    text: buildReorder30dText({ customerName, favoriteProduct }),
  })
}

export const sendEmail = send
