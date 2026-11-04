-- =============================================================================
-- creators — T-REX Athletes barter program tracker.
-- One row per Instagram creator, whether they applied on the site or were
-- found by the daily hunt. Dedupe by lower-cased handle (no '@').
-- =============================================================================

CREATE TABLE IF NOT EXISTS creators (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle            TEXT NOT NULL UNIQUE,               -- instagram username, lower-case, no '@'
  name              TEXT,
  email             TEXT,
  phone             TEXT,
  sport             TEXT,                               -- gym, running, cycling, marathon, ...
  followers         INTEGER,
  engagement_rate   NUMERIC(5,2),                       -- percent
  city              TEXT,
  state             TEXT,
  address_line1     TEXT,
  address_line2     TEXT,
  pincode           TEXT,
  source            TEXT NOT NULL DEFAULT 'application'
                      CHECK (source IN ('application','hashtag','mention','comment','customer','manual')),
  status            TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new','contacted','replied','applied','approved','shipped','posted','rejected','not_interested')),
  found_via         TEXT,                               -- hashtag or post that surfaced them
  pitch             TEXT,                               -- personalised outreach line
  why_us            TEXT,                               -- from the application form
  notes             TEXT,
  contact_count     INTEGER NOT NULL DEFAULT 0,
  last_contacted_at TIMESTAMPTZ,
  next_followup_at  TIMESTAMPTZ,
  applied_at        TIMESTAMPTZ,
  shipped_at        TIMESTAMPTZ,
  posted_at         TIMESTAMPTZ,
  content_url       TEXT,                               -- link to the reel they posted
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creators_status     ON creators (status);
CREATE INDEX IF NOT EXISTS idx_creators_followup   ON creators (next_followup_at) WHERE next_followup_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_creators_created_at ON creators (created_at DESC);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;  -- service key only; no public policies
