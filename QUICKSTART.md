# Quick Start Guide

Anda sudah punya collector Python yang running. Berikut cara cepat setup frontend untuk melihat data.

---

## 🎯 Scenario: Collector Sudah Running

Anda sudah punya:
- ✅ Collector Python running dengan PostgreSQL lokal
- ✅ Data messages sudah masuk ke database
- ✅ Groups sudah ter-configure

Yang perlu dilakukan:
1. Migrate database ke Supabase (atau tetap pakai PostgreSQL lokal)
2. Setup frontend Next.js
3. Connect frontend ke database

---

## Option A: Quick Test (PostgreSQL Lokal)

### 1. Run Schema Update

```bash
psql -U postgres -d ai_bang_aril -f schema-existing.sql
```

### 2. Setup Frontend

```bash
cd web
npm install
cp .env.local.example .env.local
```

Edit `web/.env.local`:
```env
# Untuk PostgreSQL lokal, perlu setup Supabase local atau PostgREST
# Recommended: Migrate ke Supabase Cloud (lihat Option B)
```

**⚠️ Note:** PostgreSQL lokal butuh setup tambahan (PostgREST). Lebih mudah pakai Supabase.

---

## Option B: Production Ready (Supabase)

### 1. Setup Supabase (5 menit)

1. **Create Project:** [supabase.com](https://supabase.com) → New Project
2. **Run Schema:** SQL Editor → Copy paste `schema-existing.sql` → Run
3. **Get Credentials:** Settings → API
   - Copy `Project URL`
   - Copy `anon public` key
   - Copy `service_role` key

### 2. Migrate Data (Optional)

Jika ingin migrate data existing:

```bash
# Export dari PostgreSQL lokal
pg_dump -U postgres -d ai_bang_aril \
  -t messages -t groups_config \
  --data-only --column-inserts > data.sql

# Import ke Supabase
# Buka Supabase SQL Editor
# Copy paste isi data.sql
# Run
```

### 3. Update Collector

**Option 3A: Keep Current Collector (PostgreSQL)**

Tetap pakai collector existing, tapi point ke Supabase:

```bash
# Install Supabase adapter untuk PostgreSQL
# (Requires additional setup - not recommended)
```

**Option 3B: Use New Collector (Recommended)**

```bash
cd collector
pip install supabase-py
cp collector-supabase.py collector.py
```

Edit `collector/.env`:
```env
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
```

Test:
```bash
python collector.py
# Send test message di Telegram
# Check Supabase Table Editor
```

### 4. Setup Frontend

```bash
cd web
npm install
cp .env.local.example .env.local
```

Edit `web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Run:
```bash
npm run dev
```

Open: `http://localhost:3000`

---

## ✅ Verification Checklist

### Database
- [ ] Schema created (check Supabase Table Editor)
- [ ] `messages` table exists with correct columns
- [ ] `groups_config` table exists
- [ ] Sample data visible (if migrated)

### Collector
- [ ] Connects to Supabase successfully
- [ ] Test message appears in database
- [ ] Groups auto-created as UNMAPPED
- [ ] No errors in logs

### Frontend
- [ ] `npm run dev` starts without errors
- [ ] Dashboard loads
- [ ] Messages page shows data
- [ ] Settings page shows groups
- [ ] Can change group categories

---

## 🎨 Features to Test

### 1. Dashboard
- View total messages
- View messages today
- View active groups
- View recent messages

### 2. Messages Page
- Search messages
- Filter by category
- Pagination works
- See sender username links
- See media indicators

### 3. Settings Page
- View all groups
- Change category (dropdown)
- Toggle active/inactive
- See UNMAPPED groups

### 4. AI Query (Requires Gemini API Key)
- Ask questions about messages
- Get AI responses
- Context from today's messages

---

## 🚀 Next Steps

### Development
1. Test all features locally
2. Add more groups via Telegram
3. Verify auto-categorization works
4. Test AI queries

### Production
1. Deploy frontend to Vercel (see DEPLOYMENT.md)
2. Keep collector running on VPS
3. Monitor Supabase usage
4. Setup alerts

---

## 🐛 Common Issues

### "Cannot connect to Supabase"
- Check credentials in `.env.local`
- Verify Supabase project is active
- Check RLS policies (should allow all for development)

### "No messages showing"
- Check collector is running
- Verify data in Supabase Table Editor
- Check browser console for errors
- Verify frontend `.env.local` credentials

### "Groups not appearing in Settings"
- Check `groups_config` table in Supabase
- Verify collector created UNMAPPED groups
- Refresh page

### "AI Query not working"
- Check `GEMINI_API_KEY` in `.env.local`
- Verify API key is valid
- Check browser console for errors
- Verify you have messages today

---

## 📚 Documentation

- **MIGRATION_GUIDE.md** - Detailed migration from PostgreSQL to Supabase
- **DEPLOYMENT.md** - Production deployment guide
- **README.md** - Project overview
- **PROJECT_STRUCTURE.md** - Architecture details

---

## 💡 Tips

1. **Start Simple:** Test dengan Supabase dulu sebelum production
2. **Keep Backup:** Backup PostgreSQL lokal sebelum migrate
3. **Test Incrementally:** Test setiap component satu per satu
4. **Monitor Logs:** Check collector logs dan Supabase logs

---

**Estimated Time:**
- Supabase setup: 5 minutes
- Data migration: 10 minutes (optional)
- Collector update: 15 minutes
- Frontend setup: 10 minutes
- Testing: 20 minutes

**Total: ~1 hour** untuk full setup
