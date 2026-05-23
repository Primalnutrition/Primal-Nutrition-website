/**
 * seed.js — Run supabase/seed.sql against the Supabase direct Postgres connection.
 *
 * Usage: DATABASE_URL=<connection-string> npm run seed
 *
 * Get DATABASE_URL from: Supabase dashboard → Settings → Database → URI
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required.')
  console.error('Get it from: Supabase dashboard → Settings → Database → URI')
  console.error('Then run: DATABASE_URL=postgresql://... npm run seed')
  process.exit(1)
}

const seedPath = join(__dirname, '..', 'supabase', 'seed.sql')
const sql = readFileSync(seedPath, 'utf-8')

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
})

async function run() {
  console.log('Connecting to Supabase Postgres...')

  try {
    await client.connect()
    console.log('Connected.')

    console.log('Running seed.sql in a transaction...')
    await client.query('BEGIN')

    try {
      await client.query(sql)
      await client.query('COMMIT')
      console.log('Seed completed successfully.')
      console.log('')
      console.log('What was seeded:')
      console.log('  - 9 products + variants')
      console.log('  - 50 customers with addresses')
      console.log('  - 200 orders with order items')
      console.log('  - ~7 dormant customers (last order >200 days ago)')
      console.log('')
      console.log('Next steps:')
      console.log('  1. Create an admin user in Supabase Auth (email/password)')
      console.log('  2. Insert a matching row in admin_users table:')
      console.log("     INSERT INTO admin_users (id, email, full_name, role)")
      console.log("     VALUES ('<auth-user-uuid>', '<email>', '<name>', 'superadmin');")
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    await client.end()
    console.log('Connection closed.')
  }
}

run().catch((err) => {
  console.error('Seed failed:', err.message)
  if (err.detail) console.error('Detail:', err.detail)
  if (err.hint) console.error('Hint:', err.hint)
  process.exit(1)
})
