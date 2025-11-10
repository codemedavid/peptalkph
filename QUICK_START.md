# 🚀 Quick Start Guide - My Peptide Journey

## ✅ Your Website is Now Running!

I've started your development server. Your website should now be accessible at:

**👉 http://localhost:5173**

Just click the link or refresh your browser!

---

## 📋 Setup Checklist

### ✅ Step 1: Development Server (DONE!)
Your server is now running in the background.

### ⏳ Step 2: Environment Variables (Required for Database)

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these:**
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### ⏳ Step 3: Add Your Products (Database)

Run the SQL migration in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Open file: `supabase/migrations/20250111000000_add_actual_products.sql`
3. Copy all the code
4. Paste in Supabase SQL Editor
5. Click **Run**

This adds your 7 peptide products:
- Tirzepatide 20mg - ₱2,100
- Bac Water - ₱250
- GHK-Cu - ₱999
- AA3 - ₱150
- Semax - ₱1,300
- NAD+ - ₱1,600
- AOD-9604 - ₱1,600

### ⏳ Step 4: Add WhatsApp Number

Update your WhatsApp number in 2 files:

**File 1:** `src/components/Header.tsx` (line 16)
**File 2:** `src/components/Footer.tsx` (line 8)

Change:
```typescript
const whatsappNumber = '1234567890'; 
```

To your number (e.g., for Philippines):
```typescript
const whatsappNumber = '639171234567';
```

---

## 🎯 What You'll See

### Before Adding Products:
- ✅ Beautiful website loads
- ❌ "No products found" message (normal - database is empty)

### After Running SQL Migration:
- ✅ All 7 peptides displayed
- ✅ Prices in ₱ PHP
- ✅ Categories work
- ✅ Add to cart functional

---

## 💻 Useful Commands

### Start Development Server:
```bash
npm run dev
```

### Stop Server:
Press `Ctrl + C` in the terminal

### Build for Production:
```bash
npm run build
```

### Check for Errors:
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### "No products found"
- ✅ Run the SQL migration in Supabase
- ✅ Make sure environment variables are set

### "Missing Supabase environment variables"
- ✅ Create `.env` file with your Supabase credentials
- ✅ Restart the dev server

### Port already in use:
```bash
# Kill the process using port 5173
killall node
npm run dev
```

### Changes not showing:
- ✅ Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- ✅ Clear browser cache

---

## 📱 Testing Your Site

1. **Homepage** - http://localhost:5173
   - See your logo and "My Peptide Journey" branding
   - View product categories
   - Browse peptides

2. **Cart** - Click cart button
   - Add products
   - Update quantities
   - See PHP prices

3. **Checkout** - Proceed from cart
   - Fill customer details
   - See shipping costs
   - Complete order

4. **Admin** - http://localhost:5173/admin
   - Password: `Peptide@Admin!2025`
   - Manage products
   - Update prices
   - Upload images

5. **WhatsApp Button** - Click green button
   - Opens WhatsApp chat (after you add your number)

---

## ✨ Your Beautiful Design Features

✅ Cute gradient backgrounds  
✅ Animated elements (sparkles, hearts)  
✅ Your logo with sparkle badge  
✅ Colorful category buttons  
✅ Philippine Peso (₱) currency  
✅ Mobile responsive  
✅ WhatsApp integration  

---

## 🎊 You're All Set!

Your website is running at: **http://localhost:5173**

**Next Steps:**
1. ✅ Browse your site (already running!)
2. ⏳ Add `.env` with Supabase credentials
3. ⏳ Run SQL migration to add products
4. ⏳ Add your WhatsApp number
5. ⏳ Upload product images (optional)
6. 🚀 Launch!

---

**Need Help?**
- Check `ADD_YOUR_PRODUCTS.md` for product setup
- Check `WHATSAPP_SETUP.md` for WhatsApp configuration
- Check `README.md` for full documentation

Enjoy your beautiful peptide store! 💊✨

