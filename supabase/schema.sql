-- =============================================================================
-- Primal Nutrition — Supabase schema
-- Run this first, then policies.sql, then seed.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id               TEXT PRIMARY KEY,               -- e.g. 'trex-liquid'
  slug             TEXT UNIQUE NOT NULL,           -- same as id for simplicity
  name             TEXT NOT NULL,
  subtitle         TEXT,
  tagline          TEXT,
  image            TEXT,
  gallery          TEXT[],
  category         TEXT,
  category_label   TEXT,
  tier             TEXT,
  accent           TEXT,
  bottle_type      TEXT,
  badge            TEXT,
  description      TEXT,
  mckinsey         JSONB,
  pdp              JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ---------------------------------------------------------------------------
-- variants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS variants (
  id            TEXT PRIMARY KEY,                  -- e.g. 'trex-1'
  product_id    TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,
  sub           TEXT,
  price         INTEGER NOT NULL,                  -- rupees, no decimals
  compare_at    INTEGER,
  save_label    TEXT,
  stock_qty     INTEGER NOT NULL DEFAULT 999,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON variants(product_id);

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  phone            TEXT,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ---------------------------------------------------------------------------
-- addresses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'India',
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT UNIQUE NOT NULL,         -- e.g. PRMNL-00042
  customer_id         UUID NOT NULL REFERENCES customers(id),
  shipping_address_id UUID REFERENCES addresses(id),
  subtotal            NUMERIC(10,2) NOT NULL,
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax                 NUMERIC(10,2) NOT NULL DEFAULT 0,
  total               NUMERIC(10,2) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','paid','shipped','delivered','cancelled','refunded')),
  payment_method      TEXT,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  shiprocket_order_id TEXT,
  awb_code            TEXT,
  courier_name        TEXT,
  placed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at             TIMESTAMPTZ,
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at   ON orders(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_placed ON orders(status, placed_at DESC);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id               TEXT REFERENCES products(id),
  variant_id               TEXT REFERENCES variants(id),
  product_name_snapshot    TEXT NOT NULL,   -- frozen at time of order
  variant_label_snapshot   TEXT NOT NULL,
  qty                      INTEGER NOT NULL DEFAULT 1,
  unit_price               NUMERIC(10,2) NOT NULL,
  line_total               NUMERIC(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ---------------------------------------------------------------------------
-- admin_users (extends Supabase auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id        UUID PRIMARY KEY,               -- must match auth.users.id
  email     TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role      TEXT NOT NULL DEFAULT 'admin'
              CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- chatbot_queries (audit log)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chatbot_queries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id  UUID REFERENCES admin_users(id),
  prompt         TEXT NOT NULL,
  generated_sql  TEXT,
  result_count   INTEGER,
  success        BOOLEAN NOT NULL DEFAULT FALSE,
  error_message  TEXT,
  latency_ms     INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_queries_admin_user_id ON chatbot_queries(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_queries_created_at    ON chatbot_queries(created_at DESC);

-- =============================================================================
-- READ-ONLY VIEWS (chatbot allowlist)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- customer_summary
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  c.id                                                  AS customer_id,
  c.name,
  c.email,
  c.phone,
  COUNT(o.id)                                           AS total_orders,
  COALESCE(SUM(o.total), 0)                             AS total_spent,
  MIN(o.placed_at)::DATE                                AS first_order_date,
  MAX(o.placed_at)::DATE                                AS last_order_date,
  COALESCE(
    EXTRACT(DAY FROM (NOW() - MAX(o.placed_at)))::INT,
    9999
  )                                                     AS days_since_last_order,
  (
    SELECT p.name
    FROM order_items oi2
    JOIN products p ON p.id = oi2.product_id
    WHERE oi2.order_id IN (SELECT id FROM orders WHERE customer_id = c.id)
    GROUP BY p.name
    ORDER BY SUM(oi2.qty) DESC
    LIMIT 1
  )                                                     AS favorite_product_name,
  CASE
    WHEN COALESCE(EXTRACT(DAY FROM (NOW() - MAX(o.placed_at)))::INT, 9999) < 60  THEN 'active'
    WHEN COALESCE(EXTRACT(DAY FROM (NOW() - MAX(o.placed_at)))::INT, 9999) <= 180 THEN 'dormant'
    ELSE 'churned'
  END                                                   AS status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status != 'cancelled'
GROUP BY c.id, c.name, c.email, c.phone;

-- ---------------------------------------------------------------------------
-- product_performance
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW product_performance AS
SELECT
  p.id                                    AS product_id,
  p.name,
  COUNT(DISTINCT oi.order_id)             AS total_orders,
  COALESCE(SUM(oi.line_total), 0)         AS total_revenue,
  COALESCE(SUM(oi.qty), 0)               AS total_qty_sold,
  COUNT(DISTINCT o.customer_id)           AS unique_customers,
  RANK() OVER (ORDER BY COALESCE(SUM(oi.line_total), 0) DESC) AS revenue_rank
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled'
GROUP BY p.id, p.name;

-- ---------------------------------------------------------------------------
-- daily_revenue
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW daily_revenue AS
SELECT
  DATE(o.placed_at)                         AS date,
  COUNT(o.id)                               AS orders_count,
  COALESCE(SUM(o.total), 0)                AS revenue,
  COUNT(DISTINCT CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM orders o2
      WHERE o2.customer_id = o.customer_id
        AND DATE(o2.placed_at) < DATE(o.placed_at)
    ) THEN o.customer_id
  END)                                      AS new_customers,
  COUNT(DISTINCT CASE
    WHEN EXISTS (
      SELECT 1 FROM orders o2
      WHERE o2.customer_id = o.customer_id
        AND DATE(o2.placed_at) < DATE(o.placed_at)
    ) THEN o.customer_id
  END)                                      AS returning_customers
FROM orders o
WHERE o.status != 'cancelled'
GROUP BY DATE(o.placed_at)
ORDER BY date DESC;

-- ---------------------------------------------------------------------------
-- dormant_customers (days_since_last_order > 180)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW dormant_customers AS
SELECT *
FROM customer_summary
WHERE days_since_last_order > 180;

-- ---------------------------------------------------------------------------
-- order_items_enriched
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW order_items_enriched AS
SELECT
  oi.order_id,
  o.order_number,
  c.name   AS customer_name,
  c.email  AS customer_email,
  oi.product_name_snapshot AS product_name,
  oi.variant_label_snapshot AS variant_label,
  oi.qty,
  oi.unit_price,
  oi.line_total,
  o.placed_at,
  o.status
FROM order_items oi
JOIN orders o   ON o.id = oi.order_id
JOIN customers c ON c.id = o.customer_id;

-- =============================================================================
-- RPC: chatbot_exec_sql
-- Executes a validated SELECT-only query and returns result as JSONB array.
-- Only authenticated users can call this.
-- =============================================================================
CREATE OR REPLACE FUNCTION chatbot_exec_sql(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Hard guard: only SELECTs allowed at Postgres level
  IF UPPER(TRIM(query)) NOT LIKE 'SELECT%' THEN
    RAISE EXCEPTION 'Only SELECT statements are permitted';
  END IF;

  EXECUTE format(
    'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (%s) t',
    query
  ) INTO result;

  RETURN COALESCE(result, '[]'::JSONB);
END;
$$;

-- Lock down execution privileges on the RPC
ALTER FUNCTION chatbot_exec_sql(TEXT) OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION chatbot_exec_sql(TEXT) FROM anon, public;
GRANT  EXECUTE ON FUNCTION chatbot_exec_sql(TEXT) TO authenticated;

-- =============================================================================
-- GRANTS — let authenticated role read the five views
-- =============================================================================
GRANT SELECT ON customer_summary        TO authenticated;
GRANT SELECT ON product_performance     TO authenticated;
GRANT SELECT ON daily_revenue           TO authenticated;
GRANT SELECT ON dormant_customers       TO authenticated;
GRANT SELECT ON order_items_enriched    TO authenticated;
