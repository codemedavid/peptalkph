-- Add tracking columns to orders table
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

-- Create secure RPC function to get order details by ID (without exposing sensitive info like email/phone to public)
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
  -- Try to match by UUID (original ID) first
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
  WHERE o.id::text = order_id_input
     OR o.order_number = order_id_input; -- Also allow searching by custom order number (PepTalk-XXXXX)
END;
$$;
