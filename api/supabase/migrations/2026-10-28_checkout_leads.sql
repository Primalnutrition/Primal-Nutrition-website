-- =============================================================================
-- checkout_leads — people who filled the shipping form (name + phone), whether
-- or not they went on to pay. One row per phone number; later orders can be
-- matched on phone to stop reminders. Written by POST /api/checkout/lead.
-- =============================================================================

CREATE TABLE IF NOT EXISTS checkout_leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        TEXT NOT NULL UNIQUE,
  email        TEXT,
  full_name    TEXT,
  pincode      TEXT,
  items        JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reminded_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_checkout_leads_updated ON checkout_leads (updated_at DESC);

-- Server-only table: RLS on with no policies, so only the service-role key reads/writes.
ALTER TABLE checkout_leads ENABLE ROW LEVEL SECURITY;
