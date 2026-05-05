# Migration Guide - Existing Collector to Supabase

Anda sudah punya collector Python yang running dengan PostgreSQL lokal. Berikut cara migrasi ke Supabase untuk deployment production.

---

## 🎯 Tujuan

- **Keep:** Collector Python yang sudah running
- **Migrate:** Database dari PostgreSQL lokal ke Supabase Cloud
- **Deploy:** Frontend ke Vercel, Collector tetap di VPS

---

## Option 1: Migrate ke Supabase (Recommended)

### Step 1: Setup Supabase

1. **Create Project** di [supabase.com](https://supabase.com)
2. **Run Schema** - Copy `schema-existing.sql` ke SQL Editor
3. **Get Credentials:**
   - Project URL → `SUPABASE_URL`
   - anon key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_KEY`

### Step 2: Migrate Data (Optional)

Jika ingin migrate data existing:

```bash
# Export dari PostgreSQL lokal
pg_dump -U postgres -d ai_bang_aril -t messages -t groups_config --data-only > data.sql

# Import ke Supabase (via SQL Editor)
# Copy paste isi data.sql ke Supabase SQL Editor
```

### Step 3: Update Collector

Edit collector Python Anda, ganti `psycopg2` dengan `supabase-py`:

```python
# OLD (PostgreSQL lokal)
import psycopg2
conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, ...)
cursor = conn.cursor()

# NEW (Supabase)
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Query OLD
cursor.execute("SELECT category FROM groups_config WHERE ...")
row = cursor.fetchone()

# Query NEW
response = supabase.table("groups_config").select("category").eq("group_name", name).execute()
category = response.data[0]["category"] if response.data else None

# Insert OLD
cursor.execute("INSERT INTO messages (...) VALUES (...)", (values))

# Insert NEW
supabase.table("messages").insert({
    "group_name": group_name,
    "category": category,
    ...
}).execute()
```

### Step 4: Update .env

```env
# OLD
DB_NAME=ai_bang_aril
DB_USER=postgres
DB_PASSWORD=xxx
DB_HOST=127.0.0.1
DB_PORT=5432

# NEW
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
```

### Step 5: Test

```bash
python your_collector.py
# Check Supabase Table Editor untuk verify data masuk
```

---

## Option 2: Keep PostgreSQL Lokal (Development Only)

Jika ingin tetap pakai PostgreSQL lokal untuk development:

### Step 1: Run Schema

```bash
psql -U postgres -d ai_bang_aril -f schema-existing.sql
```

### Step 2: Update Frontend .env

```env
# Point ke PostgreSQL lokal via Supabase REST API
# (Requires additional setup - not recommended)
```

**⚠️ Note:** Option ini hanya untuk development. Production harus pakai Supabase.

---

## Option 3: Hybrid (Recommended untuk Transition)

### Development
- Collector → PostgreSQL lokal
- Frontend → PostgreSQL lokal (via connection string)

### Production
- Collector → Supabase Cloud
- Frontend → Supabase Cloud (via Vercel)

---

## 🔄 Collector Code Comparison

### Your Current Collector (PostgreSQL)

```python
# ✅ Sudah bagus, tinggal ganti library

# GET CATEGORY
cursor.execute("""
    SELECT category FROM groups_config 
    WHERE LOWER(TRIM(group_name)) = LOWER(TRIM(%s))
    AND is_active = TRUE
    LIMIT 1
""", (group_name,))
row = cursor.fetchone()
category = row[0] if row else None

# INSERT MESSAGE
cursor.execute("""
    INSERT INTO messages (group_name, category, sender_name, ...)
    VALUES (%s, %s, %s, ...)
""", (group_name, category, sender_name, ...))
```

### Updated for Supabase

```python
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# GET CATEGORY
response = supabase.table("groups_config")\
    .select("category")\
    .eq("group_name", group_name.strip())\
    .eq("is_active", True)\
    .limit(1)\
    .execute()

category = response.data[0]["category"] if response.data else None

# INSERT MESSAGE
supabase.table("messages").insert({
    "group_name": group_name,
    "category": category,
    "sender_name": sender_name,
    "sender_id": sender_id,
    "sender_username": sender_username,
    "sender_link": sender_link,
    "message": message,
    "raw_text": raw_text,
    "date": date.isoformat(),
    "message_type": message_type,
    "media_path": media_path
}).execute()
```

---

## 📊 Schema Compatibility

Schema `schema-existing.sql` sudah **100% compatible** dengan collector Anda:

| Field Collector | Field Supabase | Status |
|----------------|----------------|--------|
| `group_name` | `group_name` | ✅ Match |
| `category` | `category` | ✅ Match |
| `sender_name` | `sender_name` | ✅ Match |
| `sender_id` | `sender_id` | ✅ Match |
| `sender_username` | `sender_username` | ✅ Match |
| `sender_link` | `sender_link` | ✅ Match |
| `message` | `message` | ✅ Match |
| `raw_text` | `raw_text` | ✅ Match |
| `date` | `date` | ✅ Match |
| `message_type` | `message_type` | ✅ Match |
| `media_path` | `media_path` | ✅ Match |
| - | `is_ai_processed` | ✅ New (default FALSE) |

---

## 🚀 Deployment Flow

### Current (Development)
```
Telegram → Collector (Local) → PostgreSQL (Local) → Frontend (Local)
```

### Target (Production)
```
Telegram → Collector (VPS) → Supabase (Cloud) → Frontend (Vercel)
```

---

## 📝 Checklist

### Supabase Setup
- [ ] Create Supabase project
- [ ] Run `schema-existing.sql`
- [ ] Get credentials (URL + service_role key)
- [ ] Test connection

### Collector Update
- [ ] Install `supabase-py`: `pip install supabase`
- [ ] Replace `psycopg2` with `supabase`
- [ ] Update queries (SELECT, INSERT)
- [ ] Update `.env` with Supabase credentials
- [ ] Test locally

### Frontend Setup
- [ ] Update `web/.env.local` with Supabase credentials
- [ ] Test connection
- [ ] Verify data appears in UI

### Production Deploy
- [ ] Deploy frontend to Vercel
- [ ] Upload collector to VPS
- [ ] Setup collector as daemon
- [ ] Monitor logs

---

## 🐛 Troubleshooting

### Collector tidak connect ke Supabase
```bash
# Check credentials
echo $SUPABASE_URL
echo $SUPABASE_KEY

# Test connection
python -c "from supabase import create_client; client = create_client('URL', 'KEY'); print(client.table('groups_config').select('*').execute())"
```

### Data tidak muncul di Frontend
- Check Supabase RLS policies (harus allow all untuk development)
- Check frontend `.env.local` credentials
- Check browser console untuk errors

### Media files tidak tersimpan
- Supabase Storage perlu setup terpisah
- Atau tetap simpan di VPS dan store path saja di DB

---

## 💡 Tips

1. **Development:** Tetap pakai PostgreSQL lokal dulu
2. **Testing:** Migrate ke Supabase, test dengan data sample
3. **Production:** Full migration setelah yakin semua works

---

## 📞 Support

Jika ada masalah saat migration:
1. Check Supabase logs (Dashboard → Logs)
2. Check collector logs
3. Verify schema match dengan `schema-existing.sql`
