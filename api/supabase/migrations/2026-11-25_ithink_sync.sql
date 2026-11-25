-- iThink Logistics: track whether each order has been copied into the iThink panel
-- (Sync Order API). Courier booking happens manually in iThink.
alter table public.orders
  add column if not exists ithink_synced_at  timestamptz,
  add column if not exists ithink_sync_error text;
