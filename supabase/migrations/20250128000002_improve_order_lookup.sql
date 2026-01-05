-- Drop the function first to allow return type changes
DROP FUNCTION IF EXISTS get_order_details(text);

-- Improve get_order_details to support truncated ID search (case-insensitive)
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
     -- Exact match on UUID (text cast)
     o.id::text = order_id_input
     -- Exact match on custom order number
     OR o.order_number ILIKE order_id_input
     -- Match if input is exactly 8 chars (truncated ID view) and matches start of UUID (case insensitive)
     OR (length(order_id_input) = 8 AND o.id::text ILIKE order_id_input || '%')
     -- Match if input is full UUID but case insensitive
     OR (length(order_id_input) = 36 AND o.id::text ILIKE order_id_input);
END;
$$;
