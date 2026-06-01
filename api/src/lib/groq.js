import Groq from 'groq-sdk'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

let _client = null

function getClient() {
  if (!_client) {
    if (!config.groqApiKey) {
      throw new Error('GROQ_API_KEY is not configured')
    }
    _client = new Groq({ apiKey: config.groqApiKey })
    logger.debug('Groq client initialised')
  }
  return _client
}

/**
 * View schema descriptions injected into the SQL-generation system prompt.
 * Keeping this accurate prevents hallucinated column names.
 */
const VIEW_SCHEMA = `
You have access to ONLY these five PostgreSQL views. Reference no other tables.

1. customer_summary
   Columns: customer_id (uuid), name (text), email (text), phone (text),
            total_orders (bigint), total_spent (numeric), first_order_date (date),
            last_order_date (date), days_since_last_order (int),
            favorite_product_name (text), status (text: 'active'|'dormant'|'churned')
   Note: status = 'active' if days_since_last_order < 60,
                 'dormant' if 60–180, 'churned' if > 180

2. product_performance
   Columns: product_id (text), name (text), total_orders (bigint),
            total_revenue (numeric), total_qty_sold (bigint),
            unique_customers (bigint), revenue_rank (bigint)

3. daily_revenue
   Columns: date (date), orders_count (bigint), revenue (numeric),
            new_customers (bigint), returning_customers (bigint)

4. dormant_customers
   Same columns as customer_summary — pre-filtered to days_since_last_order > 180

5. order_items_enriched
   Columns: order_id (uuid), order_number (text), customer_name (text),
            customer_email (text), product_name (text), variant_label (text),
            qty (int), unit_price (numeric), line_total (numeric),
            placed_at (timestamptz), status (text)
`

/**
 * Pass 1: Convert a natural-language question into a SQL SELECT statement.
 *
 * @param {{ prompt: string, history: Array<{role:string,content:string}>, schema: string }} opts
 * @returns {Promise<string>} raw LLM text (may contain ```sql blocks)
 */
export async function generateSql({ prompt, history = [], schema = VIEW_SCHEMA }) {
  const client = getClient()

  const systemPrompt = `You are a PostgreSQL query generator for a Primal Nutrition admin dashboard.
Your ONLY job is to generate a single PostgreSQL SELECT statement.

Rules (NEVER break these):
- Generate ONLY a single SELECT statement
- Reference ONLY the views listed below — never raw tables
- Always include LIMIT 500 or less
- Never use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, GRANT, REVOKE, COPY, CALL, MERGE
- Never add comments (-- or /* */) in the SQL
- Output ONLY the SQL, optionally wrapped in a \`\`\`sql code block

${schema}`

  const messages = [
    ...history.slice(-6), // keep last 3 turns for context
    { role: 'user', content: prompt },
  ]

  const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.1,
    max_tokens: 512,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
  })

  return response.choices[0]?.message?.content ?? ''
}

/**
 * Pass 2: Summarise SQL query results into a human-readable 2–3 sentence answer.
 *
 * @param {{ prompt: string, sql: string, results: Array }} opts
 * @returns {Promise<string>} English summary
 */
export async function summarizeResults({ prompt, sql, results }) {
  const client = getClient()

  const systemPrompt = `You are a data analyst assistant for Primal Nutrition (an Indian Ayurvedic supplement brand).
The user asked a question about their business data.
A SQL query was run and returned results.
Write a clear, concise 2–3 sentence summary of what the data shows.
Include specific numbers where relevant.
Speak in plain English — no SQL jargon, no column names.`

  const userContent = `Original question: ${prompt}

SQL executed:
${sql}

Results (${results.length} rows):
${JSON.stringify(results.slice(0, 20), null, 2)}${results.length > 20 ? `\n... and ${results.length - 20} more rows` : ''}`

  const response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.4,
    max_tokens: 256,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
  })

  return response.choices[0]?.message?.content ?? ''
}
