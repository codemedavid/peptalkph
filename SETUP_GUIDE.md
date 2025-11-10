# Setup Guide - Premium Peptides Platform

## Quick Start (5 Minutes)

### Step 1: Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### Step 2: Database Migration

1. Open Supabase SQL Editor
2. Copy the contents of `supabase/migrations/20250110000000_convert_to_peptide_business.sql`
3. Paste and run the migration
4. Verify tables are created:
   - `products`
   - `product_variations`
   - `categories`
   - `payment_methods`
   - `site_settings`

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Admin Panel Setup

### Access Admin Dashboard

1. Navigate to: `http://localhost:5173/admin`
2. Default password: `Peptide@Admin!2025`

### Change Admin Password

Edit `src/components/AdminDashboard.tsx` at line 235:

```typescript
if (password === 'YOUR_NEW_PASSWORD_HERE') {
```

### First Time Setup

After logging in to admin:

1. **Configure Site Settings:**
   - Go to "Site Settings"
   - Update site name, email, phone
   - Set shipping thresholds
   - Update legal disclaimer

2. **Setup Payment Methods:**
   - Go to "Payment Methods"
   - Add/edit payment options
   - Upload QR codes if needed
   - Set active status

3. **Review Categories:**
   - Go to "Manage Categories"
   - Adjust sort order if needed
   - Add/remove categories

4. **Add/Edit Products:**
   - Go to "Manage Products"
   - Review sample products
   - Add your actual products
   - Upload product images

---

## Configuration Guide

### Customize Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#YOUR_COLOR', // Main blue
        700: '#YOUR_DARKER_COLOR',
      },
    },
  },
}
```

### Customize Shipping

Edit `src/components/Cart.tsx` (lines 71-72):

```typescript
const shippingCost = totalPrice >= 150 ? 0 : 12.99; // Change threshold and cost
```

### Customize Legal Disclaimers

Edit `src/components/Hero.tsx` (line 54) for main disclaimer.
Edit `src/components/Checkout.tsx` (line 262) for checkout disclaimer.

---

## Adding Products

### Via Admin Dashboard (Recommended)

1. Login to `/admin`
2. Click "Add New Product"
3. Fill in:
   - Basic Info: Name, Description, Category, Price
   - Scientific Details: Purity, MW, CAS, Sequence
   - Inventory: Stock quantity, availability
   - Optional: Discount pricing, images

### Via SQL (Bulk Import)

```sql
INSERT INTO products (name, description, category, base_price, purity_percentage, molecular_weight, cas_number, sequence, featured, available, stock_quantity)
VALUES 
('Peptide Name', 'Description here', 'research', 45.00, 99.5, '1234.56 g/mol', '12345-67-8', 'SEQUENCE', true, true, 100);
```

---

## Adding Product Variations (Sizes)

Variations allow different quantity options (e.g., 2mg, 5mg, 10mg):

### Via Admin Dashboard

After creating a product, variations can be added programmatically or via database.

### Via SQL

```sql
-- Get product ID first
SELECT id FROM products WHERE name = 'BPC-157';

-- Add variations
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
VALUES 
('product-id-here', '2mg', 2.0, 35.00, 50),
('product-id-here', '5mg', 5.0, 45.00, 100),
('product-id-here', '10mg', 10.0, 80.00, 75);
```

---

## Image Management

### Option 1: Supabase Storage

1. Go to Supabase Dashboard → Storage
2. Create bucket named `product-images`
3. Set bucket to public
4. Upload images
5. Use URL in product `image_url` field

### Option 2: External CDN

Use any image hosting service (Cloudinary, Imgix, etc.) and paste URLs directly.

---

## Deployment

### Deploy to Vercel

```bash
# 1. Build the project
npm run build

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel

# 4. Add environment variables in Vercel dashboard
# Settings → Environment Variables → Add:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### Deploy to Netlify

```bash
# 1. Build the project
npm run build

# 2. Install Netlify CLI
npm i -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist

# 4. Add environment variables in Netlify dashboard
```

---

## Testing Checklist

Before going live:

- [ ] Test product browsing
- [ ] Test search functionality
- [ ] Test adding to cart
- [ ] Test cart quantity updates
- [ ] Test removing from cart
- [ ] Test checkout process
- [ ] Verify research agreement requirement
- [ ] Test all payment methods
- [ ] Verify email addresses work
- [ ] Test admin login
- [ ] Test product CRUD operations
- [ ] Test category management
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify all disclaimers display
- [ ] Test with slow internet connection

---

## Troubleshooting

### "Error connecting to Supabase"

**Solutions:**
1. Check `.env` file exists and has correct values
2. Restart dev server after adding `.env`
3. Verify Supabase project is active
4. Check API key hasn't expired

### "Products not loading"

**Solutions:**
1. Run database migration
2. Check Supabase database has products table
3. Verify products have `available = true`
4. Check browser console for errors

### "Admin login not working"

**Solutions:**
1. Clear browser localStorage: `localStorage.clear()`
2. Verify password in AdminDashboard.tsx
3. Try incognito/private browsing mode

### "Images not displaying"

**Solutions:**
1. Check image URLs are valid and accessible
2. Verify Supabase storage bucket is public
3. Check CORS settings if using external CDN
4. Verify `image_url` field in database

### "Build fails"

**Solutions:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm run clean  # if script exists
rm -rf dist .vite

# Rebuild
npm run build
```

---

## Security Setup

### Enable Row Level Security (RLS)

In Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for customers)
CREATE POLICY "Allow public read" ON products
  FOR SELECT USING (available = true);

CREATE POLICY "Allow public read" ON categories
  FOR SELECT USING (active = true);

-- More policies as needed...
```

### Secure Admin Panel

For production, implement proper authentication:

1. Use Supabase Auth
2. Add admin role to users
3. Check role in admin dashboard
4. Remove simple password check

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check stock levels
- Review new orders
- Update featured products

**Monthly:**
- Update product information
- Review payment methods
- Check for broken images
- Update legal disclaimers if needed
- Review site analytics

**Quarterly:**
- Update dependencies: `npm update`
- Security audit
- Database backup
- Review Terms of Service

---

## Support & Resources

### Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Vite: https://vitejs.dev
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for errors

# Database
# Use Supabase Dashboard for migrations

# Deployment
npm run build && vercel --prod  # Deploy to Vercel
npm run build && netlify deploy --prod  # Deploy to Netlify
```

---

## Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Review this setup guide
4. Check CHANGES.md for implementation details
5. Review inline code comments

---

**Setup complete!** 🎉

Your peptide e-commerce platform is ready to use.

Remember to:
- Add your actual products
- Configure payment methods
- Update legal disclaimers for your jurisdiction
- Test thoroughly before going live
- Enable proper security measures

Good luck with your peptide business! 🧪

