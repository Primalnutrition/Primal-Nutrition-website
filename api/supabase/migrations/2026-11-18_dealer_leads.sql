-- =============================================================================
-- dealer_leads — B2B dealer / distributor applications from /#/dealer.
-- The form still opens WhatsApp; this row is saved first so no lead is lost
-- if the person never presses send.
-- =============================================================================

CREATE TABLE IF NOT EXISTS dealer_leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  store         TEXT NOT NULL,
  location      TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  volume        TEXT,
  business_type TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','contacted','qualified','onboarded','rejected')),
  utm_source    TEXT,
  utm_campaign  TEXT,
  utm_content   TEXT,
  fbclid        TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dealer_leads_created_at ON dealer_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dealer_leads_phone      ON dealer_leads (phone);

ALTER TABLE dealer_leads ENABLE ROW LEVEL SECURITY;  -- service key only; no public policies
