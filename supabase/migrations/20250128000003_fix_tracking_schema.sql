-- Consolidated fix for Order Tracking Schema
-- 1. Add order_number column and sequence if missing
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_number') THEN
      ALTER TABLE orders ADD COLUMN order_number TEXT;
    END IF;
  END IF;
END $$;

-- Create sequence for order numbers if not exists
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10452;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'PepTalk-' || nextval('order_number_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign order number on insert
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();

-- Backfill existing orders if needed (only if null)
UPDATE orders SET order_number = 'PepTalk-' || nextval('order_number_seq') WHERE order_number IS NULL;


-- 2. Add tracking columns if missing
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'tracking_number') THEN
      ALTER TABLE orders ADD COLUMN tracking_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_note') THEN
      ALTER TABLE orders ADD COLUMN shipping_note TEXT;
    END IF;
  END IF;
END $$;


-- 3. Update RPC Function (Drop first to avoid return type errors)
DROP FUNCTION IF EXISTS get_order_details(text);

CREATE OR REPLACE FUNCTION get_order_details(order_id_input TEXT)
RETURNS TABLE (
  id UUID,
  order_number TEXT,
  order_status TEXT,
  payment_status TEXT,
  tracking_number TEXT,
  shipping_note TEXT,
  total_price NUMERIC,
  shipping_fee NUMERIC,
  order_items JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.order_number,
    o.order_status,
    o.payment_status,
    o.tracking_number,
    o.shipping_note,
    o.total_price,
    o.shipping_fee,
    o.order_items,
    o.created_at
  FROM orders o
  WHERE 
     -- Exact match on UUID
     o.id::text = order_id_input
     -- Exact match on custom order number
     OR o.order_number ILIKE order_id_input
     -- Match if input is exactly 8 chars (truncated ID) and matches start of UUID (case insensitive)
     OR (length(order_id_input) = 8 AND o.id::text ILIKE order_id_input || '%')
     -- Match if input is full UUID but case insensitive
     OR (length(order_id_input) = 36 AND o.id::text ILIKE order_id_input);
END;
$$;
