-- Create a sequence starting from 10452
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10452;

-- Add order_number column to orders table
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_number') THEN
      ALTER TABLE orders ADD COLUMN order_number TEXT;
    END IF;
  END IF;
END $$;

-- Create a function to generate the order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'PepTalk-' || nextval('order_number_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically assign the order number on insert
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();

-- Backfill existing orders
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM orders WHERE order_number IS NULL ORDER BY created_at ASC LOOP
    UPDATE orders SET order_number = 'PepTalk-' || nextval('order_number_seq') WHERE id = r.id;
  END LOOP;
END $$;
