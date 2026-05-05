# Installation Guide - AI Assistant Telegram RMW

## 🚀 Quick Install

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Supabase account (free tier OK)
- Telegram API credentials
- Google Gemini API key

---

## Step 1: Clone & Setup

```bash
# Clone or download project
cd ai-assistant-rmw

# Install frontend dependencies
cd web
npm install

# Install collector dependencies
cd ../collector
pip install -r requirements.txt
```

---

## Step 2: Database Setup (Supabase)

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait ~2 minutes for setup

### 2.2 Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy entire content from `schema-existing.sql`
3. Click "Run"
4. Verify tables in **Table Editor**:
   - ✓ `messages`
   - ✓ `groups_config`

### 2.3 Get Credentials

Go to **Settings → API**:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Get API Keys

### 3.1 Telegram API

1. Go to [my.telegram.org](https://my.telegram.org)
2. Login with phone number
3. Go to "API Development Tools"
4. Create new application
5. Copy `api_id` and `api_hash`

### 3.2 Google Gemini API

1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select/create Google Cloud project
4. Copy API key

---

## Step 4: Configure Environment

### 4.1 Frontend Environment

```bash
cd web
cp .env.local.example .env.local
nano .env.local
```

Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Collector Environment

```bash
cd ../collector
cp .env.example .env
nano .env
```

Add your credentials:

```env
API_ID=12345678
API_HASH=abcdef1234567890abcdef1234567890
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
```

---

## Step 5: Generate Telegram Session

**First time only:**

```bash
cd collector
python collector-supabase.py
```

You'll be prompted:
1. Enter phone number (with country code, e.g., +62812345678)
2. Enter verification code from Telegram
3. Session file `session.session` will be created
4. Press Ctrl+C to stop

---

## Step 6: Test Everything

### 6.1 Test Collector

```bash
cd collector
python collector-supabase.py
```

Expected output:
```
✅ Connected to Supabase
🚀 Collector PRO (Supabase) aktif...
```

Send a test message in any Telegram group, you should see:
```
📩 DEBUG GROUP: 'Your Group Name'
💾 SAVED | UNMAPPED | Your Group Name | Sender Name
```

Check Supabase Table Editor → `messages` → You should see the message!

### 6.2 Test Frontend

```bash
cd web
npm run dev
```

Open `http://localhost:3000`

Expected:
- ✓ Dashboard loads
- ✓ Shows message count
- ✓ Recent messages appear
- ✓ Messages page shows data
- ✓ Settings page shows groups

---

## Step 7: Configure Groups

1. Go to **Settings** page
2. Find your test group (should be UNMAPPED)
3. Change category using dropdown
4. Click toggle to activate
5. Send another message
6. Verify it appears with correct category

---

## ✅ Verification Checklist

### Database
- [ ] Supabase project created
- [ ] Schema executed successfully
- [ ] Tables visible in Table Editor
- [ ] RLS policies enabled

### Collector
- [ ] Dependencies installed
- [ ] `.env` configured
- [ ] Session file generated
- [ ] Test message saved to database
- [ ] Groups auto-created as UNMAPPED

### Frontend
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] `npm run dev` starts without errors
- [ ] Dashboard shows data
- [ ] Messages page works
- [ ] Settings page works
- [ ] Can change group categories

### Integration
- [ ] Collector → Supabase → Frontend flow works
- [ ] Real-time data appears in UI
- [ ] Category changes reflect immediately
- [ ] AI Query works (if Gemini key added)

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"

**Collector:**
```bash
# Check credentials
cat collector/.env
# Test connection
python -c "from supabase import create_client; client = create_client('URL', 'KEY'); print('OK')"
```

**Frontend:**
```bash
# Check credentials
cat web/.env.local
# Check browser console for errors
```

### "No messages showing in UI"

1. Check collector is running
2. Verify data in Supabase Table Editor
3. Check browser console for errors
4. Verify `.env.local` credentials
5. Hard refresh browser (Ctrl+Shift+R)

### "Groups not appearing"

1. Check `groups_config` table in Supabase
2. Verify collector created UNMAPPED groups
3. Check collector logs for errors
4. Refresh Settings page

### "Session file error"

```bash
# Delete old session and regenerate
cd collector
rm session.session
python collector-supabase.py
# Enter phone and code again
```

---

## 📊 Expected Results

After successful installation:

### Dashboard
- Total Messages: Shows count
- Messages Today: Shows today's count
- Active Groups: Shows active group count
- Recent Messages: Shows last 5 messages

### Messages Page
- Table with all messages
- Search works
- Filter by category works
- Pagination works

### Settings Page
- All groups listed
- Can change categories
- Can toggle active/inactive
- UNMAPPED groups visible

---

## 🚀 Next Steps

### Development
1. Add more Telegram groups
2. Test auto-categorization
3. Configure group categories
4. Test AI queries

### Production
1. Deploy frontend to Vercel (see DEPLOYMENT.md)
2. Setup collector as daemon on VPS
3. Monitor Supabase usage
4. Setup alerts

---

## 📝 Notes

- **Session file:** Keep `session.session` secure, it's your Telegram login
- **Service role key:** Only use on backend (collector), never on frontend
- **Anon key:** Safe to use on frontend
- **Media files:** Stored locally in `collector/media/` folder

---

## 💡 Tips

1. **Test locally first** before deploying to production
2. **Backup session file** before making changes
3. **Monitor Supabase logs** for errors
4. **Check collector logs** regularly
5. **Use UNMAPPED category** to identify new groups

---

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `QUICKSTART.md` for quick fixes
3. Check `MIGRATION_GUIDE.md` if migrating from PostgreSQL
4. Review `DEPLOYMENT.md` for production setup

---

**Estimated Installation Time:** 30-45 minutes

**Difficulty:** Intermediate (requires basic terminal knowledge)
