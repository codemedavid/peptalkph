-- Clear existing sample products
DELETE FROM product_variations;
DELETE FROM products;

-- Insert your actual products
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Tirzepatide 20mg', 'Tirzepatide is a glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist for research purposes. 20mg per vial.', 'research', 2100.00, 99.0, true, true, 50, 'Store at -20°C'),

('Bac Water 10ml', 'Bacteriostatic Water for reconstitution of peptides. Sterile water containing 0.9% benzyl alcohol as a bacteriostatic preservative. 10ml per bottle.', 'research', 250.00, 99.9, true, true, 100, 'Store at room temperature'),

('GHK-Cu 100mg', 'Copper peptide complex with regenerative properties. Known for its potential in tissue repair and anti-aging research applications. 100mg per vial.', 'cosmetic', 999.00, 99.0, true, true, 75, 'Store at -20°C'),

('AA3 3ml', 'Amino Asylum compound for advanced research applications. High purity research-grade peptide. 3ml per vial.', 'research', 150.00, 99.0, true, false, 80, 'Store at -20°C'),

('Semax 10mg', 'Nootropic peptide derived from ACTH that enhances cognitive function, memory, and provides neuroprotective effects in research studies. 10mg per vial.', 'cognitive', 1300.00, 98.8, true, true, 60, 'Store at -20°C'),

('NAD+ 500mg', 'Nicotinamide Adenine Dinucleotide - Essential coenzyme involved in cellular energy production and metabolic processes. Research-grade quality. 500mg per vial.', 'performance', 1600.00, 99.5, true, true, 40, 'Store at -20°C'),

('AOD-9604 5mg', 'Modified fragment of human growth hormone (HGH) C-terminus. Researched for its potential metabolic effects without affecting blood sugar. 5mg per vial.', 'performance', 1600.00, 99.0, true, false, 55, 'Store at -20°C');

-- Update site settings for Philippine Peso
UPDATE site_settings SET value = 'Premium Peptides PH' WHERE id = 'site_name';
UPDATE site_settings SET value = 'info@premiumpeptides.ph' WHERE id = 'contact_email';
UPDATE site_settings SET value = '+63 XXX XXX XXXX' WHERE id = 'contact_phone';

-- Optional: Add product variations for different sizes
-- Uncomment and customize if you want to offer multiple sizes for any product
/*
Example:
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '10mg', 10.0, 1200.00, 30 FROM products WHERE name = 'Tirzepatide 20mg'
UNION ALL
SELECT id, '20mg', 20.0, 2100.00, 50 FROM products WHERE name = 'Tirzepatide 20mg'
UNION ALL
SELECT id, '30mg', 30.0, 3000.00, 25 FROM products WHERE name = 'Tirzepatide 20mg';
*/

