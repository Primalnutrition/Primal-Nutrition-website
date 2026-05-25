# primal-revamp-api

Node.js + Express + Supabase backend for Primal Nutrition — Indian Ayurvedic supplement brand.

Handles: product catalog, orders, admin analytics, and a Groq-powered chatbot that converts English to safe read-only SQL.

---

## Overview

```
primal-revamp   (Vite/React storefront)  →  /api/products, /api/checkout/*
primal-admin    (Vite/React dashboard)   →  /api/admin/*
Razorpay/Shiprocket                      →  /api/webhooks/*
                           ↓
                  primal-revamp-api  (this repo)
                           ↓
                   Supabase (Postgres)
```

---

## Quick Start (local, no Supabase needed)

```bash
cd primal-revamp-api
npm install

# Copy env file — Supabase keys are optional for local boot
cp .env.example .env

# Start dev server
npm run dev
```

The server boots on port 8080 with a dev-bypass admin user when `SUPABASE_URL` is empty.

```bash
# Verify
curl http://localhost:8080/health
# → {"status":"ok","version":"1.0.0","uptime":3,"supabaseConfigured":false}

curl http://localhost:8080/api/products
# → {"error":"SUPABASE_NOT_CONFIGURED","message":"..."}  (graceful, no crash)
```

---

## Supabase Setup

### 1. Create a Supabase project

Go to https://supabase.com → New project → choose Singapore region.

### 2. Apply schema

In the Supabase SQL editor, run each file in order:

```
supabase/schema.sql    ← tables, indexes, views, RPC function
supabase/policies.sql  ← Row Level Security
```

### 3. Seed data

Get your direct Postgres connection string:  
`Supabase dashboard → Settings → Database → URI` (use the "Transaction pooler" URI)

```bash
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres" npm run seed
```

This inserts: 9 products, 50 customers, 200 orders with realistic distribution.

### 4. Create your admin user

In Supabase Auth (dashboard → Authentication → Users), create a user with email + password.

Then in the SQL editor:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES ('<your-auth-user-uuid>', 'you@example.com', 'Your Name', 'superadmin');
```

### 5. Set environment variables locally

Edit `.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...   (service_role key)
SUPABASE_ANON_KEY=eyJ...      (anon key)
GROQ_API_KEY=gsk_...
```

---

## Render Deploy

### One-click

The `render.yaml` file defines the service. Push to GitHub, then in Render:

1. New → Blueprint → connect repo → approve `render.yaml`
2. Set the secret env vars in the Render dashboard (they're marked `sync: false`)

### Manual

1. New Web Service → connect repo
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Health check path: `/health`
5. Region: Singapore
6. Add all env vars from `.env.example`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port (default 8080) |
| `NODE_ENV` | No | `development` or `production` |
| `SUPABASE_URL` | Yes (prod) | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes (prod) | service_role key — keep secret |
| `SUPABASE_ANON_KEY` | Yes (prod) | anon/public key |
| `DATABASE_URL` | For seeding | Direct Postgres connection string |
| `GROQ_API_KEY` | For chat | Get at console.groq.com/keys |
| `RAZORPAY_KEY_ID` | Phase C | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Phase C | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | Phase C | For webhook signature verification |
| `SHIPROCKET_EMAIL` | Phase C | Shiprocket account email |
| `SHIPROCKET_PASSWORD` | Phase C | Shiprocket account password |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |

---

## API Reference

### Health

```bash
GET /health
→ {"status":"ok","version":"1.0.0","uptime":42,"supabaseConfigured":true}
```

### Products

```bash
# All products with variants
GET /api/products

# Single product by slug
GET /api/products/trex-liquid
```

### Checkout (Phase C stubs — return 501 until wired)

```bash
POST /api/checkout/serviceability
Content-Type: application/json
{"pincode":"400001","items":[{"productId":"trex-liquid","variantId":"trex-1","qty":1}]}

POST /api/checkout/create-order
Content-Type: application/json
{
  "customer": {"name":"Arjun Sharma","email":"a@b.com","phone":"9876543210"},
  "address":  {"fullName":"Arjun Sharma","phone":"9876543210","line1":"123 MG Road","city":"Mumbai","state":"Maharashtra","pincode":"400001"},
  "items":    [{"productId":"trex-liquid","variantId":"trex-1","qty":1}]
}

POST /api/checkout/verify-payment
Content-Type: application/json
{
  "razorpayOrderId":"order_xxx","razorpayPaymentId":"pay_xxx",
  "razorpaySignature":"sig_xxx","internalOrderId":"<uuid>"
}
```

### Webhooks (Phase C stubs)

```bash
POST /api/webhooks/razorpay    # Razorpay payment events
POST /api/webhooks/shiprocket  # Shiprocket tracking updates
```

### Admin — requires Bearer token

All `/api/admin/*` routes require `Authorization: Bearer <supabase-session-token>`.

```bash
TOKEN="<your-supabase-session-token>"

# Customers
GET /api/admin/customers?page=1&limit=25&search=arjun&status=active
GET /api/admin/customers/<uuid>

# Orders
GET /api/admin/orders?page=1&limit=25&status=delivered&from=2024-01-01&to=2024-12-31
GET /api/admin/orders/<uuid>

# Analytics
GET /api/admin/analytics/overview
GET /api/admin/analytics/timeseries?range=30d&metric=revenue
GET /api/admin/analytics/top-products?limit=10

# Groq Chatbot
curl -X POST http://localhost:8080/api/admin/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Show me the top 5 products by revenue"}'
```

---

## Groq Chatbot — Safety Architecture

The chatbot converts English questions to PostgreSQL SELECT statements via a two-pass LLM approach, with defense-in-depth to prevent any write operations.

### Architecture

```
User message
    ↓
Pass 1: Groq llama-3.3-70b-versatile (temp 0.1)
    → English → SQL (SELECT only, views only, LIMIT 500)
    ↓
sqlGuard.validateSql()  ← AST-level validation
    → Rejects: non-SELECT, forbidden keywords, raw tables, multi-statement, comments
    ↓
Supabase RPC chatbot_exec_sql()  ← Postgres-level guard
    → Asserts query starts with SELECT before EXECUTE
    ↓
Pass 2: Groq (temp 0.4)
    → Results + question → 2-3 sentence English summary
    ↓
Audit row written to chatbot_queries
    ↓
Response: { sql, results, summary, latencyMs }
```

### Allowed views

The chatbot can only query these five pre-aggregated views — no raw tables:

| View | Contents |
|---|---|
| `customer_summary` | Per-customer totals, last order date, status (active/dormant/churned) |
| `product_performance` | Revenue, orders, units sold per product |
| `daily_revenue` | Daily order counts, revenue, new vs returning customers |
| `dormant_customers` | Customers with no order in >180 days |
| `order_items_enriched` | Line-item level detail with customer and order info |

### Sample prompts

```
"Show me the top 5 products by revenue"
"How many orders were placed last 30 days?"
"Which customers haven't bought anything in 6 months?"
"What's the average order value this month?"
"Show me all orders for Arjun Sharma"
"Which product has the most unique customers?"
```

### Adversarial test

```
"Delete all orders"
→ { error: "SQL_GUARD_REJECTED", message: "Query rejected by safety guard: forbidden keyword" }

"Show me passwords"
→ Runs successfully but returns nothing useful (no password columns in views)

"SELECT * FROM customers"
→ { error: "SQL_GUARD_REJECTED", message: "table not in allowlist: customers" }
```

---

## Project Structure

```
primal-revamp-api/
├── src/
│   ├── server.js              Express bootstrap
│   ├── config.js              Zod-validated env loader
│   ├── lib/
│   │   ├── supabase.js        Admin + anon clients
│   │   ├── groq.js            Two-pass LLM helpers
│   │   ├── razorpay.js        Payment helpers (Phase C)
│   │   └── shiprocket.js      Shipping helpers (Phase C)
│   ├── middleware/
│   │   ├── auth.js            Bearer token → req.user (dev bypass)
│   │   ├── error.js           JSON error handler
│   │   └── ratelimit.js       General (100/min) + chat (20/min)
│   ├── routes/
│   │   ├── products.js        GET /api/products[/:slug]
│   │   ├── checkout.js        Phase C stubs with Zod validation
│   │   ├── webhooks.js        Phase C stubs
│   │   └── admin/
│   │       ├── customers.js   Paginated list + detail
│   │       ├── orders.js      Paginated list + detail
│   │       ├── analytics.js   Overview + timeseries + top-products
│   │       └── chat.js        Groq chatbot endpoint
│   ├── services/
│   │   ├── orderService.js
│   │   ├── analyticsService.js
│   │   └── chatService.js     Two-pass Groq + sqlGuard orchestration
│   └── utils/
│       ├── sqlGuard.js        AST-level SQL safety validator
│       └── logger.js          Pino logger
├── supabase/
│   ├── schema.sql             Tables + views + RPC function + grants
│   ├── policies.sql           Row Level Security
│   └── seed.sql               9 products + 50 customers + 200 orders
└── scripts/seed.js            Runs seed.sql via pg client
```
