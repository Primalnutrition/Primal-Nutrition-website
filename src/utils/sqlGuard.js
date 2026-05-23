/**
 * sqlGuard.js — AST-level SQL safety validator for Primal chatbot.
 *
 * Only allows read-only SELECT statements against the five pre-approved views.
 * All other statements are rejected with a reason string.
 *
 * Self-test cases (expected results):
 *   validateSql('SELECT * FROM customer_summary LIMIT 10')       → {ok:true}
 *   validateSql('DELETE FROM customers')                          → {ok:false, reason:'forbidden keyword'}
 *   validateSql('SELECT * FROM customers')                        → {ok:false, reason:'table not in allowlist'}
 *   validateSql('SELECT 1; DROP TABLE x')                         → {ok:false, reason:'multi-statement'}
 *   validateSql('SELECT * FROM customer_summary')                 → {ok:true, sql:'... LIMIT 500'}
 */

import nodeSqlParser from 'node-sql-parser'

const { Parser } = nodeSqlParser
const parser = new Parser()

/** Views the chatbot is allowed to query */
const ALLOWED_VIEWS = new Set([
  'customer_summary',
  'product_performance',
  'daily_revenue',
  'dormant_customers',
  'order_items_enriched',
])

/** DML / DDL keywords that must never appear anywhere in the query */
const FORBIDDEN_PATTERN =
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXECUTE|COPY|CALL|MERGE|REPLACE|UPSERT)\b/i

/** Maximum rows the chatbot can request */
const MAX_LIMIT = 500

/**
 * Recursively collect all table/view names referenced in an AST node.
 * Handles JOINs, sub-queries in FROM, nested SELECTs, etc.
 *
 * @param {object|Array|null} node
 * @param {Set<string>} collected — accumulator
 */
function collectTableNames(node, collected = new Set()) {
  if (!node) return collected

  if (Array.isArray(node)) {
    node.forEach((n) => collectTableNames(n, collected))
    return collected
  }

  if (typeof node !== 'object') return collected

  // A FROM clause entry with a plain table reference
  if (node.table && typeof node.table === 'string') {
    collected.add(node.table.toLowerCase())
  }

  // Sub-query in FROM e.g. (SELECT ... FROM ...) AS t
  if (node.expr && node.expr.ast) {
    collectTableNames(node.expr.ast, collected)
  }

  // Walk all child properties
  for (const key of Object.keys(node)) {
    if (key === 'table' && typeof node[key] === 'string') continue // already handled
    const child = node[key]
    if (child && typeof child === 'object') {
      collectTableNames(child, collected)
    }
  }

  return collected
}

/**
 * Inject or clamp the LIMIT clause in a SELECT AST.
 *
 * node-sql-parser always sets ast.limit, but ast.limit.value is an empty array
 * when no LIMIT is present in the query.
 *
 * @param {string} sql
 * @param {object} ast
 * @returns {string} rewritten SQL
 */
function enforceLimitInSql(sql, ast) {
  const limitNodes = ast.limit?.value
  const hasLimit = Array.isArray(limitNodes) && limitNodes.length > 0

  if (hasLimit) {
    // Last entry is the row-count (first would be OFFSET if two values)
    const countNode = limitNodes[limitNodes.length - 1]
    const currentLimit = parseInt(countNode?.value ?? 0, 10)

    if (currentLimit > MAX_LIMIT) {
      // Clamp: replace the number in the original SQL
      return sql.replace(/LIMIT\s+\d+/i, `LIMIT ${MAX_LIMIT}`)
    }
    return sql
  }

  // No LIMIT at all — append one
  return sql.trimEnd().replace(/;$/, '') + ` LIMIT ${MAX_LIMIT}`
}

/**
 * Validate and optionally rewrite a SQL string for chatbot execution.
 *
 * @param {string} rawSql
 * @returns {{ ok: boolean, sql?: string, reason?: string }}
 */
export function validateSql(rawSql) {
  if (!rawSql || typeof rawSql !== 'string') {
    return { ok: false, reason: 'empty query' }
  }

  const trimmed = rawSql.trim()

  // Rule 1 — reject empty
  if (!trimmed) {
    return { ok: false, reason: 'empty query' }
  }

  // Rule 1b — reject multi-statement (semicolons mid-string)
  // Allow trailing semicolon but reject anything after it
  const withoutTrailingSemi = trimmed.replace(/;$/, '')
  if (withoutTrailingSemi.includes(';')) {
    return { ok: false, reason: 'multi-statement' }
  }

  // Rule 1c — reject comment tokens (could hide payloads)
  if (trimmed.includes('--') || trimmed.includes('/*')) {
    return { ok: false, reason: 'comments not allowed' }
  }

  // Rule 2 — reject forbidden keywords anywhere
  if (FORBIDDEN_PATTERN.test(trimmed)) {
    return { ok: false, reason: 'forbidden keyword' }
  }

  // Rule 3 — parse with node-sql-parser (Postgres flavour)
  let ast
  try {
    ast = parser.astify(trimmed, { database: 'PostgresQL' })
  } catch {
    return { ok: false, reason: 'parse error' }
  }

  // node-sql-parser may return array for multi-statement; already blocked above but double-check
  const rootAst = Array.isArray(ast) ? ast[0] : ast

  if (!rootAst || rootAst.type !== 'select') {
    return { ok: false, reason: 'only SELECT statements allowed' }
  }

  // Rule 4 — allowlist table/view check
  const referencedTables = collectTableNames(rootAst.from)

  for (const tbl of referencedTables) {
    if (!ALLOWED_VIEWS.has(tbl)) {
      return { ok: false, reason: `table not in allowlist: ${tbl}` }
    }
  }

  // Rule 5 — enforce LIMIT
  const finalSql = enforceLimitInSql(withoutTrailingSemi, rootAst)

  return { ok: true, sql: finalSql }
}
