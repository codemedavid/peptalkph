-- Migration: Update checkout numbers
-- Updates the GCash account number and the site contact phone to 09241036416

-- Update GCash payment method account number
UPDATE payment_methods
SET account_number = '09241036416',
    updated_at = NOW()
WHERE id = 'gcash';

-- Update contact_phone site setting
UPDATE site_settings
SET value = '09241036416',
    updated_at = NOW()
WHERE id = 'contact_phone';
