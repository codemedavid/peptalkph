-- Add gallery_images column to products table
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'gallery_images') THEN
      ALTER TABLE products ADD COLUMN gallery_images TEXT[] DEFAULT NULL;
    END IF;
  END IF;
END $$;
