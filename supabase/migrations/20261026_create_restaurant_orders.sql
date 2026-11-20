-- Order storage for the Golpo Solpo server-side API.
CREATE TABLE IF NOT EXISTS public.restaurant_orders (
  id text PRIMARY KEY,
  table_no integer NOT NULL CHECK (table_no BETWEEN 1 AND 12),
  items jsonb NOT NULL CHECK (jsonb_typeof(items) = 'array'),
  status text NOT NULL DEFAULT 'New'
    CHECK (status IN ('New', 'Preparing', 'Ready', 'Served')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.restaurant_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.restaurant_orders FROM anon, authenticated;
GRANT ALL ON TABLE public.restaurant_orders TO service_role;
CREATE INDEX IF NOT EXISTS restaurant_orders_created_at_idx
  ON public.restaurant_orders (created_at DESC);
