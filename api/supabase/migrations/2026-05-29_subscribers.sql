-- =============================================================================
-- subscribers — newsletter / brand list (separate from customers).
-- A subscriber may or may not become a customer; we dedupe by email.
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  source            TEXT NOT NULL DEFAULT 'footer',
  subscribed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  welcome_sent_at   TIMESTAMPTZ,
  welcome_resend_id TEXT,
  unsubscribed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email           ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed_at   ON subscribers (subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_pending_welcome ON subscribers (subscribed_at)
  WHERE welcome_sent_at IS NULL AND unsubscribed_at IS NULL;
