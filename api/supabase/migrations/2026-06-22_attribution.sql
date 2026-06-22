-- =============================================================================
-- Attribution — capture how an order / customer was acquired.
--
-- Per ORDER we store a full first-touch + last-touch snapshot (JSONB) plus a
-- few flat columns for easy filtering/sorting in the admin. Per CUSTOMER we
-- store the FIRST touch only (their acquisition source), set once and never
-- overwritten.
--
-- All data is first-party and non-sensitive (UTM tags, referrer host, landing
-- path, Google/Meta click ids, device class). No third-party cookies, no PII.
-- =============================================================================

-- ── orders ───────────────────────────────────────────────────────────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS attribution          JSONB,   -- { firstTouch, lastTouch, device, daysToPurchase }
  ADD COLUMN IF NOT EXISTS utm_source           TEXT,    -- last-touch headline (for filtering)
  ADD COLUMN IF NOT EXISTS utm_medium           TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign         TEXT,
  ADD COLUMN IF NOT EXISTS attribution_channel  TEXT,    -- organic_search | paid_search | organic_social | paid_social | referral | email | direct
  ADD COLUMN IF NOT EXISTS landing_page         TEXT;    -- last-touch landing path

CREATE INDEX IF NOT EXISTS idx_orders_utm_source          ON orders(utm_source);
CREATE INDEX IF NOT EXISTS idx_orders_attribution_channel ON orders(attribution_channel);

-- ── customers ────────────────────────────────────────────────────────────────
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS first_touch          JSONB,   -- first-ever touch for this customer
  ADD COLUMN IF NOT EXISTS acquisition_channel  TEXT;    -- classified channel of the first touch

CREATE INDEX IF NOT EXISTS idx_customers_acquisition_channel ON customers(acquisition_channel);
