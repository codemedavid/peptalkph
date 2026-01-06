-- Fix Product Columns Migration
-- Ensures all columns required by the product editor exist in the products table

DO $$
BEGIN
  -- Basic fields
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') THEN
    ALTER TABLE products ADD COLUMN image_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'gallery_images') THEN
    ALTER TABLE products ADD COLUMN gallery_images TEXT[] DEFAULT NULL;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'safety_sheet_url') THEN
    ALTER TABLE products ADD COLUMN safety_sheet_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'inclusions') THEN
    ALTER TABLE products ADD COLUMN inclusions TEXT[] DEFAULT NULL;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sequence') THEN
    ALTER TABLE products ADD COLUMN sequence TEXT;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cas_number') THEN
    ALTER TABLE products ADD COLUMN cas_number TEXT;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'molecular_weight') THEN
    ALTER TABLE products ADD COLUMN molecular_weight TEXT;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'storage_conditions') THEN
    ALTER TABLE products ADD COLUMN storage_conditions TEXT DEFAULT 'Store at -20°C';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'purity_percentage') THEN
    ALTER TABLE products ADD COLUMN purity_percentage NUMERIC DEFAULT 99.0;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_active') THEN
    ALTER TABLE products ADD COLUMN discount_active BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_price') THEN
    ALTER TABLE products ADD COLUMN discount_price NUMERIC;
  END IF;
  
  -- Ensure RLS doesn't block updates (basic verify)
  -- This is just a check, actual policies should be managed in RLS-specific migrations
  -- But we can ensure the public role has access if RLS is disabled or for testing
  -- GRANT ALL ON products TO authenticated;
  -- GRANT ALL ON products TO service_role;
  
END $$;
