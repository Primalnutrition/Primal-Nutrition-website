-- =============================================================================
-- Primal Nutrition — Seed data
-- 9 products (verbatim from products.js) + 50 customers + 200 orders
-- Run AFTER schema.sql and policies.sql
-- =============================================================================

-- =============================================================================
-- PRODUCTS (9 verbatim from src/data/products.js)
-- =============================================================================

INSERT INTO products (id, slug, name, subtitle, tagline, image, gallery, category, category_label, tier, accent, bottle_type, badge, description, mckinsey, pdp)
VALUES

-- 1. T-Rex Liquid
(
  'trex-liquid', 'trex-liquid',
  'T-Rex', 'Strength & Testosterone Booster',
  'India''s First 7-in-1 Natural Liquid · Hazelnut',
  '/products/trex-liquid.png',
  ARRAY['/products/trex-liquid-01.png','/products/trex-liquid-02.png','/products/trex-liquid-03.png','/products/trex-liquid-04.png','/products/trex-liquid-05.png','/products/trex-liquid-06.png'],
  'liquid', 'Liquid', 'HERO',
  'from-amber to-rust', 'tall', 'Bestseller',
  'Our flagship liquid sublingual T-booster. 3× faster absorption than capsules.',
  '{"who":"Executive lifter, 32–52","pain":"Testosterone drop, recovery debt, drive loss","proof":"8 standardised adaptogens, Third-Party Lab COA, +23% free T (clinical avg)","protocol":"10ml sublingual AM · 90-day cycle","partner":"Vita Peak + Tongkat Ali"}',
  '{"heroClaim":"India''s first 7-in-1 Natural Liquid — Himalayan Shilajit with six clinically-studied Ayurvedic herbs in hazelnut-flavored liquid form. 100% Ayurvedic. No chemicals. No stimulants. The way our ancestors made it.","metrics":[{"label":"7-in-1 Natural Formula","value":"7 Herbs"},{"label":"Bottle size","value":"500 ml"},{"label":"Servings (at 10ml)","value":"50"},{"label":"Label dose","value":"15ml ×2"}],"problem":{"title":"Chemical supplements broke a generation of Indian men.","body":"Synthetic boosters spike testosterone then crash it. Pre-workouts run on caffeine. \"Proprietary blends\" hide dust-sized doses. T-Rex busts the myths."},"whoFor":["Men aged 32–58","Lifters, athletes, executives","Reduced energy, drive, recovery","Want a natural path before pharmaceuticals"],"stackWith":["vita-peak","trex-tongkat","hydra-muscle"]}'
),

-- 2. Vita Peak
(
  'vita-peak', 'vita-peak',
  'Vita Peak', 'Multivitamin + Energy',
  'Full-spectrum + taurine + clean caffeine',
  '/products/vita-peak.png',
  NULL,
  'daily', 'Daily', 'DAILY FLOOR',
  'from-forest to-amber', 'jar', NULL,
  'Full-spectrum daily multivitamin with clean caffeine for AM energy.',
  '{"who":"Every Primal customer","pain":"Inconsistent micronutrient floor","proof":"21 nutrients at RDA+ doses, taurine + 80mg caffeine","protocol":"2 tabs AM with breakfast","partner":"Every other Primal SKU"}',
  '{"heroClaim":"The daily floor every Indian man should be on. 21 micronutrients, taurine, and clean caffeine — engineered for the diet you actually eat.","metrics":[{"label":"Nutrients","value":"21"},{"label":"Caffeine per dose","value":"80mg"},{"label":"Dosing","value":"2 tabs AM"},{"label":"Days per bottle","value":"30 / 60"}],"whoFor":["Every man over 25","Anyone training 3+ days/week","Vegetarians (especially B12 attention)","Indian dietary patterns"],"stackWith":["trex-liquid","hydra-muscle","trex-tongkat"]}'
),

-- 3. Korean Panax Ginseng
(
  'trex-ginseng', 'trex-ginseng',
  'Korean Panax Ginseng', 'Energy · Cognition · Vitality',
  'Standardized ginsenoside extract',
  '/products/trex-ginseng.png',
  NULL,
  'adaptogen', 'Adaptogen', 'SPECIALIST',
  'from-rust to-amber', 'capsule', NULL,
  'Korean Panax — the most-studied ginseng for male energy, focus, and libido.',
  '{"who":"Cognitive performance + libido seekers","pain":"Brain fog, sexual energy","proof":"Ginsenoside Rg1/Rb1 standardized, Choi YD studies","protocol":"1 cap AM","partner":"Cordyceps"}',
  '{"heroClaim":"The most-studied ginseng in the world. Standardized to ginsenosides Rg1 + Rb1 — the bioactives that actually drive cognition, libido, and HPA-axis balance.","metrics":[{"label":"Ginsenoside %","value":"5% std."},{"label":"Capsules","value":"60"},{"label":"Days","value":"30"},{"label":"Best for","value":"Brain + libido"}],"stackWith":["trex-cordyceps","trex-liquid","vita-peak"]}'
),

-- 4. Cordyceps
(
  'trex-cordyceps', 'trex-cordyceps',
  'Cordyceps', 'VO₂ Max · Stamina',
  'Cordyceps militaris extract',
  '/products/trex-cordyceps.png',
  NULL,
  'adaptogen', 'Adaptogen', 'SPECIALIST',
  'from-amber-dark to-forest', 'capsule', NULL,
  'For endurance athletes and high-altitude warriors. Mushroom-derived ATP fuel.',
  '{"who":"Endurance athletes, climbers, runners","pain":"VO2 ceiling, late-session fatigue","proof":"Chen S 2010 — VO2max +7% in 6 weeks","protocol":"1 cap pre-workout","partner":"Hydra Muscle"}',
  '{"heroClaim":"The mushroom that climbs Everest. Cordyceps militaris extract — standardized for cordycepin and adenosine, the molecules behind ATP production.","metrics":[{"label":"Cordycepin std.","value":"0.3%"},{"label":"VO₂ max lift (literature)","value":"+7%"},{"label":"Best for","value":"Endurance"},{"label":"Time to effect","value":"14 days"}],"stackWith":["hydra-muscle","trex-ginseng","vita-peak"]}'
),

-- 5. Tongkat Ali
(
  'trex-tongkat', 'trex-tongkat',
  'Tongkat Ali', 'Testosterone · Strength',
  '2% eurycomanone standardized',
  '/products/trex-tongkat.png',
  NULL,
  'adaptogen', 'Adaptogen', 'SPECIALIST',
  'from-amber to-rust', 'capsule', NULL,
  'Free testosterone, explosive strength, drive. Lab-standardized eurycomanone.',
  '{"who":"T-focused lifters on a plateau","pain":"Stalled lifts, lost drive","proof":"2% eurycomanone std., Tambi 2012 hypogonadal trial","protocol":"1 cap AM","partner":"T-Rex Liquid"}',
  '{"heroClaim":"The most direct T-supporting adaptogen in nature. Standardized to 2% eurycomanone — the molecule clinical trials use.","metrics":[{"label":"Eurycomanone","value":"2% std."},{"label":"Capsule dose","value":"200mg"},{"label":"Best for","value":"Plateaued lifters"},{"label":"Time to effect","value":"21 days"}],"stackWith":["trex-liquid","trex-maca","vita-peak"]}'
),

-- 6. Royal Jelly
(
  'trex-royal-jelly', 'trex-royal-jelly',
  'Royal Jelly', 'Myogenesis · Vigour',
  'Bee-derived androgenic support',
  '/products/trex-royal-jelly.png',
  NULL,
  'adaptogen', 'Adaptogen', 'SPECIALIST',
  'from-amber-light to-amber-dark', 'capsule', NULL,
  'Royal jelly for muscle protein synthesis and androgenic support. Not vegan.',
  '{"who":"Muscle-building athletes who can eat animal-source","pain":"Slow recovery, lagging hypertrophy","proof":"Morita 2012 androgen receptor markers","protocol":"1 cap AM","partner":"T-Rex Liquid"}',
  '{"heroClaim":"The substance that turns a worker bee into a queen — same compounds that drive androgenic differentiation in mammals.","metrics":[{"label":"10-HDA std.","value":"5%"},{"label":"Capsules","value":"60"},{"label":"Best for","value":"Hypertrophy"},{"label":"Vegan","value":"No"}],"stackWith":["trex-liquid","trex-tongkat","hydra-muscle"]}'
),

-- 7. Black Maca
(
  'trex-maca', 'trex-maca',
  'Black Maca', 'Strength · Recovery · Stamina',
  'Peruvian black maca root',
  '/products/trex-maca.png',
  NULL,
  'adaptogen', 'Adaptogen', 'SPECIALIST',
  'from-ink-700 to-amber-dark', 'capsule', NULL,
  'Strongest maca variant for male energy, endurance, and recovery.',
  '{"who":"Stamina + libido + mood","pain":"Energy dips, mood volatility","proof":"Gonzales GF — black maca specifically for male sexual desire","protocol":"1 cap AM","partner":"Tongkat Ali"}',
  '{"heroClaim":"Of the three maca colors, only black maca shows male-specific effects in clinical trials. Sourced from Junín, Peru at 4,100m altitude.","metrics":[{"label":"Sourced from","value":"Junín, Peru"},{"label":"Altitude","value":"4,100m"},{"label":"Best for","value":"Stamina + mood"},{"label":"Vegan","value":"Yes"}],"stackWith":["trex-tongkat","trex-cordyceps","vita-peak"]}'
),

-- 8. Liver Detox
(
  'trex-liver', 'trex-liver',
  'Liver Detox', 'Cleanse · Repair',
  'Milk thistle + glutathione precursors',
  '/products/trex-liver.png',
  NULL,
  'adaptogen', 'Recovery', 'RECOVERY',
  'from-forest to-amber-dark', 'capsule', NULL,
  'For the man who lifts hard and drinks occasionally. Repair what you punish.',
  '{"who":"Hard-living lifter","pain":"Alcohol + processed food load on liver","proof":"Silymarin 80% standardized; Abenavoli systematic review","protocol":"Cycle 2 weeks/quarter","partner":"T-Rex (mandatory if on cycle)"}',
  '{"heroClaim":"For the man who lifts hard, works hard, and occasionally lives hard. Milk thistle silymarin at 80% — the same dose used in clinical hepatoprotection trials.","metrics":[{"label":"Silymarin std.","value":"80%"},{"label":"Capsules","value":"60"},{"label":"Cycle length","value":"14 days"},{"label":"Best for","value":"Quarterly reset"}],"stackWith":["trex-liquid","vita-peak"]}'
),

-- 9. Hydra Muscle
(
  'hydra-muscle', 'hydra-muscle',
  'Hydra Muscle', 'Creatine + Electrolytes',
  'India''s first creatine + hydration formula',
  '/products/hydra-muscle.png',
  ARRAY['/products/hydra-muscle-01.png','/products/hydra-muscle-02.png','/products/hydra-muscle-03.png','/products/hydra-muscle-04.png'],
  'hydration', 'Hydration', 'PERFORMANCE',
  'from-amber-light to-amber', 'tub', 'New',
  '5g creatine monohydrate + electrolyte blend. Strawberry.',
  '{"who":"Active training days","pain":"Cramping, hydration, mid-set strength","proof":"Creatine — most validated supplement in sports science","protocol":"1 scoop intra-workout","partner":"Cordyceps + Vita Peak"}',
  '{"heroClaim":"5g creatine monohydrate, full electrolyte panel, no artificial sweeteners. Built for Indian summer training — the only category where you sweat 1.5L per hour.","metrics":[{"label":"Creatine","value":"5g per serving"},{"label":"Electrolytes","value":"Na, K, Mg, Cl"},{"label":"Servings","value":"30"},{"label":"Flavor","value":"Strawberry"}],"stackWith":["trex-cordyceps","vita-peak","trex-liquid"]}'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- VARIANTS
-- =============================================================================

INSERT INTO variants (id, product_id, label, sub, price, compare_at, save_label)
VALUES
  -- T-Rex Liquid
  ('trex-1',   'trex-liquid',      'Pack of 1 · 500ml', '50 servings',  1999, 2200,  NULL),
  ('trex-2',   'trex-liquid',      'Pack of 2 · 1L',    '100 servings', 3999, 4400,  'Save ₹401'),
  ('trex-3',   'trex-liquid',      'Pack of 3 · 1.5L',  '150 servings', 5999, 6600,  'Best value'),
  -- Vita Peak
  ('vp-60',    'vita-peak',        '60 tablets',  '30 days', 1500, NULL, NULL),
  ('vp-120',   'vita-peak',        '120 tablets', '60 days', 3000, NULL, 'Stock up'),
  -- Korean Panax Ginseng
  ('gin-60',   'trex-ginseng',     '60 capsules', '30 days', 1800, NULL, NULL),
  -- Cordyceps
  ('cord-60',  'trex-cordyceps',   '60 capsules', '30 days', 1800, NULL, NULL),
  -- Tongkat Ali
  ('tong-60',  'trex-tongkat',     '60 capsules', '30 days', 1800, NULL, NULL),
  -- Royal Jelly
  ('rj-60',    'trex-royal-jelly', '60 capsules', '30 days', 1800, NULL, NULL),
  -- Black Maca
  ('maca-60',  'trex-maca',        '60 capsules', '30 days', 1800, NULL, NULL),
  -- Liver Detox
  ('liver-60', 'trex-liver',       '60 capsules', '30 days', 1800, NULL, NULL),
  -- Hydra Muscle
  ('hydra-1',  'hydra-muscle',     '150g',        '30 servings · strawberry', 1200, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CUSTOMERS (50) + ADDRESSES + ORDERS (200) + ORDER_ITEMS
-- Generated via PL/pgSQL DO block for realistic seeding
-- =============================================================================

DO $$
DECLARE
  -- Name pools (30+ unique first names, varied surnames)
  first_names TEXT[] := ARRAY[
    'Arjun','Priya','Rahul','Ananya','Vikram','Kavya','Rohan','Sneha',
    'Karan','Deepika','Aditya','Pooja','Suresh','Meera','Neeraj','Riya',
    'Aman','Shreya','Tarun','Nisha','Gaurav','Swati','Ajay','Divya',
    'Manish','Komal','Sanjay','Preeti','Rajesh','Aarti','Varun','Sonali',
    'Nikhil','Bhavna','Amit','Tanvi','Harish','Pallavi','Praveen','Geeta',
    'Dev','Ankita','Sachin','Leela','Kartik','Madhuri','Ashish','Isha',
    'Vivek','Bindu'
  ];
  last_names TEXT[] := ARRAY[
    'Sharma','Patel','Verma','Iyer','Singh','Nair','Gupta','Joshi',
    'Kumar','Reddy','Mehta','Pillai','Bose','Tiwari','Shah','Rao',
    'Mishra','Agarwal','Sinha','Desai','Kapoor','Malhotra','Chaudhary',
    'Banerjee','Dubey','Saxena','Pandey','Choudhary','Khanna','Bhatia'
  ];
  cities TEXT[] := ARRAY[
    'Mumbai','Delhi','Bengaluru','Chennai','Hyderabad','Pune','Kolkata',
    'Ahmedabad','Jaipur','Chandigarh','Lucknow','Kochi','Surat','Indore',
    'Nagpur','Bhopal','Patna','Vadodara','Coimbatore','Visakhapatnam'
  ];
  states TEXT[] := ARRAY[
    'Maharashtra','Delhi','Karnataka','Tamil Nadu','Telangana','Maharashtra',
    'West Bengal','Gujarat','Rajasthan','Punjab','Uttar Pradesh','Kerala',
    'Gujarat','Madhya Pradesh','Maharashtra','Madhya Pradesh','Bihar',
    'Gujarat','Tamil Nadu','Andhra Pradesh'
  ];
  pincodes TEXT[] := ARRAY[
    '400001','110001','560001','600001','500001','411001','700001',
    '380001','302001','160001','226001','682001','395001','452001',
    '440001','462001','800001','390001','641001','530001'
  ];

  -- Product/variant id pairs for order items
  product_ids   TEXT[] := ARRAY['trex-liquid','trex-liquid','trex-liquid','vita-peak','vita-peak','trex-ginseng','trex-cordyceps','trex-tongkat','trex-royal-jelly','trex-maca','trex-liver','hydra-muscle'];
  variant_ids   TEXT[] := ARRAY['trex-1','trex-2','trex-3','vp-60','vp-120','gin-60','cord-60','tong-60','rj-60','maca-60','liver-60','hydra-1'];
  product_names TEXT[] := ARRAY['T-Rex','T-Rex','T-Rex','Vita Peak','Vita Peak','Korean Panax Ginseng','Cordyceps','Tongkat Ali','Royal Jelly','Black Maca','Liver Detox','Hydra Muscle'];
  variant_lbls  TEXT[] := ARRAY['Pack of 1 · 500ml','Pack of 2 · 1L','Pack of 3 · 1.5L','60 tablets','120 tablets','60 capsules','60 capsules','60 capsules','60 capsules','60 capsules','60 capsules','150g'];
  variant_prices INTEGER[] := ARRAY[1999,3999,5999,1500,3000,1800,1800,1800,1800,1800,1800,1200];

  -- Statuses for distribution: 60% delivered, 20% shipped, 10% pending, 5% cancelled, 5% paid
  status_pool TEXT[] := ARRAY[
    'delivered','delivered','delivered','delivered','delivered','delivered',
    'delivered','delivered','delivered','delivered','delivered','delivered',
    'shipped','shipped','shipped','shipped',
    'pending','pending',
    'cancelled',
    'paid'
  ];

  -- Variables
  i INTEGER;
  j INTEGER;
  k INTEGER;
  cust_id UUID;
  addr_id UUID;
  ord_id UUID;
  ord_num TEXT;
  cust_ids UUID[] := ARRAY[]::UUID[];
  addr_ids UUID[] := ARRAY[]::UUID[];

  fname TEXT;
  lname TEXT;
  cust_email TEXT;
  cust_phone TEXT;
  city_idx INTEGER;

  num_orders INTEGER;
  ord_status TEXT;
  ord_placed_at TIMESTAMPTZ;
  ord_subtotal NUMERIC;
  ord_total NUMERIC;
  num_items INTEGER;
  pv_idx INTEGER;
  item_qty INTEGER;
  item_total NUMERIC;
  item_subtotal NUMERIC;

  paid_at TIMESTAMPTZ;
  shipped_at TIMESTAMPTZ;
  delivered_at TIMESTAMPTZ;
  cancelled_at TIMESTAMPTZ;

  order_counter INTEGER := 1;
  dormant_count INTEGER := 0;
BEGIN

  -- ── Step 1: Create 50 customers ───────────────────────────────────────────
  FOR i IN 1..50 LOOP
    fname     := first_names[i];
    lname     := last_names[((i - 1) % array_length(last_names,1)) + 1];
    cust_email := lower(fname || '.' || lname || i || '@example.in');
    cust_phone := '9' || lpad((700000000 + i * 1337)::TEXT, 9, '0');

    INSERT INTO customers (email, name, phone, marketing_opt_in, created_at)
    VALUES (
      cust_email,
      fname || ' ' || lname,
      cust_phone,
      (random() > 0.4),
      NOW() - (random() * 400 || ' days')::INTERVAL
    )
    RETURNING id INTO cust_id;

    cust_ids := array_append(cust_ids, cust_id);

    -- Create one address per customer
    city_idx := ((i - 1) % array_length(cities,1)) + 1;

    INSERT INTO addresses (customer_id, line1, city, state, pincode, country, is_default)
    VALUES (
      cust_id,
      (i * 7)::TEXT || ', ' || lname || ' Nagar, Sector ' || (i % 20 + 1)::TEXT,
      cities[city_idx],
      states[city_idx],
      pincodes[city_idx],
      'India',
      TRUE
    )
    RETURNING id INTO addr_id;

    addr_ids := array_append(addr_ids, addr_id);
  END LOOP;

  -- ── Step 2: Create 200 orders distributed across 50 customers ────────────
  -- Distribution: most customers 2-6 orders, a few 15+, ~12 dormant (>200d ago)
  -- We pre-assign order counts per customer so total = 200

  FOR i IN 1..50 LOOP
    cust_id := cust_ids[i];
    addr_id := addr_ids[i];

    -- Customers 1-5: power buyers (12-16 orders)
    IF i <= 5 THEN
      num_orders := 12 + (i % 5);
    -- Customers 6-12: dormant (last order >200 days ago, 1-3 orders)
    ELSIF i <= 12 THEN
      num_orders := 1 + (i % 3);
      dormant_count := dormant_count + 1;
    -- Customers 13-35: regular (2-5 orders)
    ELSIF i <= 35 THEN
      num_orders := 2 + (i % 4);
    -- Customers 36-45: occasional (1-2 orders)
    ELSIF i <= 45 THEN
      num_orders := 1 + (i % 2);
    -- Customers 46-50: new customers (1 recent order each)
    ELSE
      num_orders := 1;
    END IF;

    FOR j IN 1..num_orders LOOP
      EXIT WHEN order_counter > 200;

      ord_id  := gen_random_uuid();
      ord_num := 'PRMNL-' || lpad(order_counter::TEXT, 5, '0');

      -- Determine placed_at
      IF i <= 12 AND i > 5 THEN
        -- Dormant: placed between 200-365 days ago
        ord_placed_at := NOW() - ((200 + random() * 165) || ' days')::INTERVAL;
      ELSIF i > 45 THEN
        -- New customers: placed in last 30 days
        ord_placed_at := NOW() - ((random() * 28) || ' days')::INTERVAL;
      ELSE
        -- Regular: distributed over last 365 days (uneven — more recent orders heavier)
        ord_placed_at := NOW() - ((random()^0.7 * 365) || ' days')::INTERVAL;
      END IF;

      -- Pick status from pool
      ord_status := status_pool[((order_counter - 1) % array_length(status_pool,1)) + 1];

      -- For new customers, force pending or paid
      IF i > 45 THEN
        IF random() > 0.5 THEN ord_status := 'pending'; ELSE ord_status := 'paid'; END IF;
      END IF;

      -- Compute timestamps from status
      paid_at      := NULL;
      shipped_at   := NULL;
      delivered_at := NULL;
      cancelled_at := NULL;

      IF ord_status IN ('paid','shipped','delivered') THEN
        paid_at := ord_placed_at + INTERVAL '2 hours';
      END IF;
      IF ord_status IN ('shipped','delivered') THEN
        shipped_at := ord_placed_at + INTERVAL '1 day';
      END IF;
      IF ord_status = 'delivered' THEN
        delivered_at := ord_placed_at + INTERVAL '5 days';
      END IF;
      IF ord_status = 'cancelled' THEN
        cancelled_at := ord_placed_at + INTERVAL '3 hours';
      END IF;

      -- Build order items (1-3 per order)
      num_items := 1 + (order_counter % 3);
      item_subtotal := 0;

      -- Insert order header with temp total (will be correct after items)
      INSERT INTO orders (
        id, order_number, customer_id, shipping_address_id,
        subtotal, discount, shipping_fee, tax, total,
        status, payment_method,
        placed_at, paid_at, shipped_at, delivered_at, cancelled_at
      ) VALUES (
        ord_id, ord_num, cust_id, addr_id,
        0, 0, 0, 0, 0,
        ord_status,
        CASE WHEN ord_status = 'pending' THEN 'pending' ELSE 'razorpay' END,
        ord_placed_at, paid_at, shipped_at, delivered_at, cancelled_at
      );

      FOR k IN 1..num_items LOOP
        pv_idx     := ((order_counter * 7 + k * 3) % array_length(product_ids,1)) + 1;
        item_qty   := 1 + (k % 2);
        item_total := variant_prices[pv_idx] * item_qty;
        item_subtotal := item_subtotal + item_total;

        INSERT INTO order_items (
          order_id, product_id, variant_id,
          product_name_snapshot, variant_label_snapshot,
          qty, unit_price, line_total
        ) VALUES (
          ord_id,
          product_ids[pv_idx],
          variant_ids[pv_idx],
          product_names[pv_idx],
          variant_lbls[pv_idx],
          item_qty,
          variant_prices[pv_idx],
          item_total
        );
      END LOOP;

      -- Update order totals based on actual items
      ord_subtotal := item_subtotal;
      ord_total    := ord_subtotal + CASE WHEN ord_subtotal >= 999 THEN 0 ELSE 99 END;

      UPDATE orders
      SET subtotal    = ord_subtotal,
          shipping_fee = CASE WHEN ord_subtotal >= 999 THEN 0 ELSE 99 END,
          total       = ord_total
      WHERE id = ord_id;

      order_counter := order_counter + 1;
    END LOOP;

  END LOOP;

  RAISE NOTICE 'Seeded: 50 customers, % orders, ~% dormant customers', order_counter - 1, dormant_count;
END $$;
