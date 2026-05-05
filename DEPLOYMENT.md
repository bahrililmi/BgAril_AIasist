# Deployment Guide - AI Assistant Telegram RMW v3.0

## Architecture Overview

This project uses a **decoupled architecture** for optimal resource efficiency:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Vercel        │      │  Supabase Cloud  │      │  VPS aaPanel    │
│   (Frontend)    │◄────►│   (Database)     │◄────►│  (Collector)    │
│   Next.js 14    │      │   PostgreSQL     │      │  Python Daemon  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

---

## Part 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** ai-assistant-rmw
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
4. Wait for project initialization (~2 minutes)

### 1.2 Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy entire content from `schema.sql`
3. Click "Run" to execute
4. Verify tables created in **Table Editor**:
   - ✓ `messages`
   - ✓ `groups_config`

### 1.3 Get Credentials

Go to **Settings → API**:
- Copy `Project URL` → Save as `SUPABASE_URL`
- Copy `anon public` key → Save as `SUPABASE_ANON_KEY`
- Copy `service_role` key → Save as `SUPABASE_KEY` (for collector)

---

## Part 2: Frontend Deployment (Vercel)

### 2.1 Prepare Repository

```bash
cd web
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 2.3 Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.4 Deploy

Click "Deploy" and wait for build to complete (~2-3 minutes).

Your app will be live at: `https://your-project.vercel.app`

---

## Part 3: Collector Deployment (VPS aaPanel)

### 3.1 Prerequisites

- Ubuntu VPS with aaPanel installed
- Python 3.10+ installed
- SSH access to VPS

### 3.2 Upload Collector Files

```bash
# On your local machine
cd collector
scp -r * root@your-vps-ip:/www/wwwroot/telegram-collector/
```

Or use aaPanel File Manager to upload:
- `collector.py`
- `requirements.txt`
- `.env` (create from `.env.example`)

### 3.3 Configure Environment

SSH into VPS and edit `.env`:

```bash
ssh root@your-vps-ip
cd /www/wwwroot/telegram-collector
nano .env
```

Add your credentials:

```env
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
```

### 3.4 Install Dependencies

```bash
cd /www/wwwroot/telegram-collector
pip3 install -r requirements.txt
```

### 3.5 Generate Telegram Session

**First time only:**

```bash
python3 collector.py
```

- Enter your phone number (with country code, e.g., +62812345678)
- Enter verification code from Telegram
- Session file `session.session` will be created
- Press Ctrl+C to stop

### 3.6 Setup as Daemon (Option A: Python Manager in aaPanel)

1. Go to aaPanel → **App Store** → Install **Python Manager**
2. Open Python Manager
3. Click "Add Project"
4. Configure:
   - **Project Name:** telegram-collector
   - **Project Path:** `/www/wwwroot/telegram-collector`
   - **Startup File:** `collector.py`
   - **Python Version:** 3.10+
   - **Auto Start:** ✓ Enable
5. Click "Save" and "Start"

### 3.7 Setup as Daemon (Option B: systemd)

Create service file:

```bash
sudo nano /etc/systemd/system/telegram-collector.service
```

Add content:

```ini
[Unit]
Description=Telegram Message Collector
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/www/wwwroot/telegram-collector
ExecStart=/usr/bin/python3 /www/wwwroot/telegram-collector/collector.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-collector
sudo systemctl start telegram-collector
sudo systemctl status telegram-collector
```

### 3.8 Monitor Logs

**Python Manager:**
- Check logs in aaPanel Python Manager interface

**systemd:**
```bash
sudo journalctl -u telegram-collector -f
```

---

## Part 4: Verification

### 4.1 Check Frontend

1. Visit your Vercel URL
2. Login should work
3. Dashboard should load (may show 0 messages initially)

### 4.2 Check Collector

1. SSH to VPS
2. Check logs for "Connected to Telegram"
3. Send a test message in any Telegram group
4. Check logs for "Message saved"

### 4.3 Check Database

1. Go to Supabase → Table Editor → `messages`
2. You should see the test message
3. Go to `groups_config` → New group should appear as UNMAPPED

### 4.4 Check Integration

1. Go to your Vercel app → Messages page
2. Test message should appear
3. Go to Settings → Groups
4. Change UNMAPPED group to proper category
5. Send another message
6. Verify it appears with correct category

---

## Troubleshooting

### Collector Not Starting

**Check Python version:**
```bash
python3 --version  # Should be 3.10+
```

**Check dependencies:**
```bash
pip3 list | grep telethon
pip3 list | grep supabase
```

**Check session file:**
```bash
ls -la session.session  # Should exist after first run
```

### Messages Not Appearing

**Check collector logs:**
```bash
# Python Manager: Check in aaPanel interface
# systemd: sudo journalctl -u telegram-collector -f
```

**Check Supabase connection:**
```bash
# In collector.py, check SUPABASE_URL and SUPABASE_KEY
```

**Check group is active:**
- Go to Settings → Groups
- Ensure group `is_active = true`

### Frontend Not Loading Data

**Check environment variables in Vercel:**
- Settings → Environment Variables
- Ensure all 3 variables are set
- Redeploy if you changed them

**Check Supabase RLS policies:**
- Go to Supabase → Authentication → Policies
- Ensure "Allow all operations" policies exist

---

## Maintenance

### Update Frontend

```bash
cd web
git add .
git commit -m "Update"
git push
# Vercel auto-deploys on push
```

### Update Collector

```bash
# Upload new collector.py via aaPanel or SCP
# Restart service:
# Python Manager: Click "Restart" button
# systemd: sudo systemctl restart telegram-collector
```

### Backup Database

Supabase provides automatic backups. To manual backup:
1. Go to Supabase → Database → Backups
2. Click "Create Backup"

---

## Security Notes

- Never commit `.env` files to Git
- Use `service_role` key only on backend (VPS)
- Use `anon` key only on frontend (Vercel)
- Keep Telegram session file secure
- Enable 2FA on Telegram account
- Regularly rotate API keys

---

## Cost Estimate

- **Supabase:** Free tier (500MB database, 2GB bandwidth)
- **Vercel:** Free tier (100GB bandwidth, unlimited deployments)
- **VPS:** ~$5-10/month (1GB RAM sufficient)

**Total:** ~$5-10/month
