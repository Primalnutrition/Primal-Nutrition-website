-- =============================================================================
-- Primal Nutrition — Row Level Security policies
-- Run AFTER schema.sql
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_queries ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- products — public read, admin write
-- =============================================================================
CREATE POLICY "public read products"
  ON products FOR SELECT
  USING (TRUE);

CREATE POLICY "admin write products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- variants — public read, admin write
-- =============================================================================
CREATE POLICY "public read variants"
  ON variants FOR SELECT
  USING (TRUE);

CREATE POLICY "admin write variants"
  ON variants FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- customers — admin-only
-- =============================================================================
CREATE POLICY "admin read customers"
  ON customers FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admin write customers"
  ON customers FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- addresses — admin-only
-- =============================================================================
CREATE POLICY "admin read addresses"
  ON addresses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admin write addresses"
  ON addresses FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- orders — admin-only
-- =============================================================================
CREATE POLICY "admin read orders"
  ON orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admin write orders"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- order_items — admin-only
-- =============================================================================
CREATE POLICY "admin read order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "admin write order_items"
  ON order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- =============================================================================
-- admin_users — can only see own row (prevents privilege escalation)
-- =============================================================================
CREATE POLICY "admin users see own row"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

-- =============================================================================
-- chatbot_queries — admin can see own queries; superadmin sees all
-- =============================================================================
CREATE POLICY "admin read own chatbot queries"
  ON chatbot_queries FOR SELECT
  USING (
    admin_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

CREATE POLICY "admin insert chatbot queries"
  ON chatbot_queries FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );
