import { generateSql, summarizeResults } from '../lib/groq.js'
import { validateSql } from '../utils/sqlGuard.js'
import { getAdminClient } from '../lib/supabase.js'
import { logger } from '../utils/logger.js'

/**
 * Extract the first SQL block from an LLM response.
 * Handles ```sql ... ``` fences and bare SQL text.
 *
 * @param {string} text
 * @returns {string}
 */
function extractSql(text) {
  // Try fenced block first
  const fenced = text.match(/```(?:sql)?\s*([\s\S]+?)```/i)
  if (fenced) return fenced[1].trim()

  // Fall back to everything up to a double newline (handles bare SQL)
  const bare = text.trim()
  return bare
}

/**
 * Write an audit row to chatbot_queries.
 * Swallows errors to avoid masking the main error.
 */
async function writeAudit(supabase, { adminUserId, prompt, generatedSql, resultCount, success, errorMessage, latencyMs }) {
  try {
    await supabase.from('chatbot_queries').insert({
      admin_user_id: adminUserId,
      prompt,
      generated_sql: generatedSql ?? null,
      result_count: resultCount ?? null,
      success,
      error_message: errorMessage ?? null,
      latency_ms: latencyMs,
    })
  } catch (err) {
    logger.warn({ err }, 'Failed to write chatbot audit row')
  }
}

/**
 * Execute a validated SQL string via the `chatbot_exec_sql` Supabase RPC.
 *
 * @param {object} supabase
 * @param {string} sql
 * @returns {Promise<Array>}
 */
async function execChatSql(supabase, sql) {
  const { data, error } = await supabase.rpc('chatbot_exec_sql', { query: sql })
  if (error) throw error
  // RPC returns jsonb — it may be an array or null
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

/**
 * Main chat orchestrator.
 *
 * @param {{ prompt: string, history?: Array<{role:string,content:string}>, adminUserId: string }} opts
 * @returns {Promise<{ sql: string, results: Array, summary: string, latencyMs: number }>}
 */
export async function runChat({ prompt, history = [], adminUserId }) {
  const supabase = getAdminClient()
  if (!supabase) {
    throw Object.assign(new Error('Supabase not configured'), { statusCode: 503, code: 'SUPABASE_NOT_CONFIGURED' })
  }

  const start = Date.now()
  let generatedSql = null

  try {
    // ── Pass 1: English → SQL ────────────────────────────────────────────
    const rawLlmOutput = await generateSql({ prompt, history })
    generatedSql = extractSql(rawLlmOutput)

    logger.debug({ generatedSql }, 'LLM generated SQL')

    // ── SQL guard ────────────────────────────────────────────────────────
    const guard = validateSql(generatedSql)

    if (!guard.ok) {
      const latencyMs = Date.now() - start
      await writeAudit(supabase, {
        adminUserId,
        prompt,
        generatedSql,
        resultCount: null,
        success: false,
        errorMessage: `sqlGuard rejected: ${guard.reason}`,
        latencyMs,
      })
      const err = new Error(`Query rejected by safety guard: ${guard.reason}`)
      err.statusCode = 400
      err.code = 'SQL_GUARD_REJECTED'
      throw err
    }

    const safeSql = guard.sql

    // ── Execute via RPC ──────────────────────────────────────────────────
    const results = await execChatSql(supabase, safeSql)

    // ── Pass 2: Results → English summary ────────────────────────────────
    const summary = await summarizeResults({ prompt, sql: safeSql, results })

    const latencyMs = Date.now() - start

    await writeAudit(supabase, {
      adminUserId,
      prompt,
      generatedSql: safeSql,
      resultCount: results.length,
      success: true,
      errorMessage: null,
      latencyMs,
    })

    logger.info(
      { adminUserId, resultCount: results.length, latencyMs },
      'Chat query completed'
    )

    return { sql: safeSql, results, summary, latencyMs }
  } catch (err) {
    // If we haven't written an audit row yet (guard didn't fail), write one now
    if (err.code !== 'SQL_GUARD_REJECTED') {
      const latencyMs = Date.now() - start
      await writeAudit(supabase, {
        adminUserId,
        prompt,
        generatedSql,
        resultCount: null,
        success: false,
        errorMessage: err.message,
        latencyMs,
      })
    }
    throw err
  }
}
