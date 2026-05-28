import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import { requireAuth as supabaseRequireAuth } from './auth.js'

/**
 * Admin auth middleware — accepts EITHER:
 *  1. An OTP-issued admin JWT (HS256, signed with ADMIN_JWT_SECRET), OR
 *  2. A Supabase access token mapped to an admin_users row (legacy path).
 *
 * On success sets:
 *   req.admin = { email }            (always)
 *   req.user  = { id?, email, role } (compat shim for routes that read req.user)
 */
export async function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.slice(7)

  // 1) Try the admin OTP JWT first
  if (config.adminJwtSecret) {
    try {
      const payload = jwt.verify(token, config.adminJwtSecret, { algorithms: ['HS256'] })
      if (payload?.email && payload?.role === 'admin') {
        req.admin = { email: payload.email }
        // Compat shim — existing admin routes read req.user
        req.user = { id: `otp:${payload.email}`, email: payload.email, role: 'admin' }
        return next()
      }
    } catch (err) {
      // Not a valid admin JWT — fall through to Supabase verification
      logger.debug({ err: err.message }, 'adminAuth: token not a valid admin JWT, trying Supabase')
    }
  }

  // 2) Fall back to the existing Supabase-based auth (preserves legacy behaviour
  //    and the dev bypass when Supabase isn't configured).
  return supabaseRequireAuth(req, res, (err) => {
    if (err) return next(err)
    if (req.user?.email) {
      req.admin = { email: req.user.email }
    }
    next()
  })
}
