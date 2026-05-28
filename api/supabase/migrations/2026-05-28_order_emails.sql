-- =============================================================================
-- order_emails — tracks every transactional / lifecycle email we send.
-- Acts as the dedupe ledger so a flaky retry can never double-send.
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_emails (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
  email_type      TEXT NOT NULL CHECK (email_type IN ('welcome','order_confirmation','day14_checkin','reorder_30d')),
  to_email        TEXT NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resend_message_id TEXT,
  error           TEXT
);

-- One welcome per customer
CREATE UNIQUE INDEX IF NOT EXISTS uniq_welcome_per_customer
  ON order_emails (customer_id) WHERE email_type = 'welcome';

-- One of each order-scoped email per order
CREATE UNIQUE INDEX IF NOT EXISTS uniq_email_per_order_type
  ON order_emails (order_id, email_type) WHERE email_type IN ('order_confirmation','day14_checkin','reorder_30d');

CREATE INDEX IF NOT EXISTS idx_order_emails_order ON order_emails (order_id);
CREATE INDEX IF NOT EXISTS idx_order_emails_customer ON order_emails (customer_id);
CREATE INDEX IF NOT EXISTS idx_order_emails_type_sent ON order_emails (email_type, sent_at DESC);
