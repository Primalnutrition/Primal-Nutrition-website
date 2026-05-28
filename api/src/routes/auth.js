import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import { createError } from '../middleware/error.js'

/**
 * Admin email-OTP login.
 *
 *  POST /auth/request-otp  { email }          → emails a 6-digit code to allowlisted users
 *  POST /auth/verify-otp   { email, code }    → returns { token, email } on success
 *
 * OTPs are kept in-memory (Map). Fine for a 2-user system; restarting the server
 * invalidates all pending codes.
 */

const ALLOWED_EMAILS = new Set([
  'pranavkk3199@gmail.com',
  'saleshead@primalnutrition.in',
])

const OTP_TTL_MS = 10 * 60 * 1000     // 10 minutes
const MAX_ATTEMPTS = 5
const JWT_EXPIRY_SECONDS = 12 * 60 * 60 // 12 hours

// email (lowercased) → { code, expiresAt, attempts }
const otpStore = new Map()

const requestSchema = z.object({
  email: z.string().email(),
})

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
})

function normalizeEmail(email) {
  return String(email).trim().toLowerCase()
}

function isAllowed(email) {
  return ALLOWED_EMAILS.has(normalizeEmail(email))
}

function generateCode() {
  // 6-digit numeric, zero-padded
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
}

function buildOtpEmailHtml(code) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f5efe6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="440" cellpadding="0" cellspacing="0" style="background:#15161a;border:1px solid rgba(245,239,230,0.08);border-radius:16px;padding:32px;">
            <tr>
              <td style="text-align:center;padding-bottom:24px;">
                <div style="font-size:20px;letter-spacing:0.18em;font-weight:600;color:#f5efe6;">PRIMAL</div>
                <div style="font-size:12px;color:rgba(245,239,230,0.45);margin-top:4px;">Admin Portal</div>
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:rgba(245,239,230,0.85);">
                Use this one-time code to sign in to the Primal admin dashboard. It expires in 10 minutes.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 0;">
                <div style="display:inline-block;font-size:32px;letter-spacing:0.4em;font-weight:600;color:#f5efe6;background:#0b0b0c;border:1px solid rgba(245,239,230,0.12);border-radius:12px;padding:18px 28px;">
                  ${code}
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;line-height:1.6;color:rgba(245,239,230,0.45);">
                If you didn't request this, you can safely ignore this email.
              </td>
            </tr>
          </table>
          <div style="font-size:11px;color:rgba(245,239,230,0.3);margin-top:16px;">
            Primal Nutrition · Internal Use Only
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

async function sendOtpEmail(email, code) {
  if (!config.resend.configured) {
    // Surface the code in logs in dev so flow can still be tested without Resend
    logger.warn({ email, code }, 'Resend not configured — OTP only logged, not emailed')
    return
  }
  const resend = new Resend(config.resend.apiKey)
  const { error } = await resend.emails.send({
    from: config.resend.fromEmail,
    to: email,
    subject: 'Your Primal admin login code',
    html: buildOtpEmailHtml(code),
    text: `Your Primal admin login code is ${code}. It expires in 10 minutes.`,
  })
  if (error) {
    logger.error({ err: error, email }, 'Resend failed to send OTP email')
    throw createError('Failed to send OTP email', 502, 'EMAIL_SEND_FAILED')
  }
}

const router = Router()

router.post('/request-otp', async (req, res, next) => {
  try {
    const parsed = requestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Valid email is required' })
    }

    const email = normalizeEmail(parsed.data.email)

    if (!isAllowed(email)) {
      logger.warn({ email }, 'OTP requested for non-allowlisted email')
      return res.status(403).json({ error: 'not_authorized', message: 'This email is not authorized.' })
    }

    const code = generateCode()
    otpStore.set(email, {
      code,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    })

    await sendOtpEmail(email, code)

    logger.info({ email }, 'OTP issued')
    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

router.post('/verify-otp', async (req, res, next) => {
  try {
    const parsed = verifySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'INVALID_INPUT', message: 'Email and 6-digit code are required' })
    }

    const email = normalizeEmail(parsed.data.email)
    const code = parsed.data.code

    if (!isAllowed(email)) {
      return res.status(403).json({ error: 'not_authorized', message: 'This email is not authorized.' })
    }

    const entry = otpStore.get(email)
    if (!entry) {
      return res.status(400).json({ error: 'NO_OTP', message: 'No active code. Request a new one.' })
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(email)
      return res.status(400).json({ error: 'EXPIRED', message: 'Code expired. Request a new one.' })
    }

    if (entry.code !== code) {
      entry.attempts += 1
      if (entry.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(email)
        return res.status(400).json({ error: 'TOO_MANY_ATTEMPTS', message: 'Too many wrong attempts. Request a new code.' })
      }
      otpStore.set(email, entry)
      const remaining = MAX_ATTEMPTS - entry.attempts
      return res.status(400).json({
        error: 'INVALID_CODE',
        message: `Wrong code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      })
    }

    // Success — single-use
    otpStore.delete(email)

    if (!config.adminJwtSecret) {
      logger.error('ADMIN_JWT_SECRET is not configured')
      return res.status(500).json({ error: 'NOT_CONFIGURED', message: 'Server auth is not configured.' })
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      config.adminJwtSecret,
      { algorithm: 'HS256', expiresIn: JWT_EXPIRY_SECONDS }
    )

    logger.info({ email }, 'OTP verified — admin session issued')
    return res.json({ token, email })
  } catch (err) {
    next(err)
  }
})

export default router
