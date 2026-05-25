import { getAdminClient } from '../lib/supabase.js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

/**
 * Supabase Bearer-token auth middleware.
 *
 * DEV BYPASS: If SUPABASE_URL is not set, sets req.user to a synthetic dev admin
 * so the server boots and routes respond without needing Supabase configured.
 */
export async function requireAuth(req, res, next) {
  // DEV BYPASS — no Supabase configured
  if (!config.supabase.configured) {
    req.user = { id: 'dev-admin', email: 'dev@local', role: 'superadmin' }
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.slice(7)

  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' })
    }

    // Look up admin_users row to confirm this is an admin + get their role
    const { data: adminRow, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, email, full_name, role')
      .eq('id', data.user.id)
      .single()

    if (adminErr || !adminRow) {
      logger.warn({ userId: data.user.id }, 'Auth attempt from non-admin user')
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Admin access required' })
    }

    req.user = adminRow
    next()
  } catch (err) {
    logger.error({ err }, 'Auth middleware error')
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Authentication error' })
  }
}
