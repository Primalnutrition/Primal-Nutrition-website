import { createClient } from '@supabase/supabase-js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

let _adminClient = null
let _anonClient = null

/**
 * Service-role Supabase client — full database access.
 * Used by server-side operations (admin routes, chatbot, seed etc.)
 */
export function getAdminClient() {
  if (!config.supabase.configured) {
    return null
  }
  if (!_adminClient) {
    _adminClient = createClient(config.supabase.url, config.supabase.serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    logger.debug('Supabase admin client initialised')
  }
  return _adminClient
}

/**
 * Anon Supabase client — used for verifying user JWTs via auth.getUser().
 */
export function getAnonClient() {
  if (!config.supabase.configured) {
    return null
  }
  if (!_anonClient) {
    _anonClient = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    logger.debug('Supabase anon client initialised')
  }
  return _anonClient
}
