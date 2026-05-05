# AI Assistant Telegram RMW v3.0

AI-powered Telegram message collector and analyzer with decoupled architecture for optimal deployment.

## 🏗 Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Vercel        │      │  Supabase Cloud  │      │  VPS aaPanel    │
│   (Frontend)    │◄────►│   (Database)     │◄────►│  (Collector)    │
│   Next.js 14    │      │   PostgreSQL     │      │  Python Daemon  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

## 🚀 Tech Stack

### Frontend (`/web`)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Server Actions (no client-side DB calls)
- **Deployment:** Vercel

### Backend (`/collector`)
- **Language:** Python 3.10+
- **Library:** Telethon (Telegram API)
- **Deployment:** VPS aaPanel (24/7 daemon)

### Database
- **Service:** Supabase (PostgreSQL)
- **Tables:** `messages`, `groups_config`

### AI
- **Provider:** Google Gemini API
- **Integration:** Server-side API route

## 📁 Project Structure

```
/ai-assistant-rmw
├── /collector              # Python Telegram collector
│   ├── collector.py        # Main daemon script
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── session.session     # Telethon session (auto-generated)
│
├── /web                    # Next.js frontend
│   ├── /app                # App Router pages
│   │   ├── /api/gemini     # Gemini API route
│   │   ├── /dashboard      # Dashboard page
│   │   ├── /messages       # Messages viewer
│   │   ├── /ai-query       # AI chat interface
│   │   └── /settings       # Configuration hub
│   ├── /actions            # Server Actions (DB CRUD)
│   ├── /components         # React components
│   ├── /lib                # Utilities
│   └── .env.local.example  # Environment template
│
├── schema.sql              # Database schema
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## 🎯 Features

### Automatic Group Detection
- Collector auto-detects new Telegram groups
- New groups added as `UNMAPPED` category
- Admin can categorize via Settings UI

### Real-time Message Collection
- 24/7 daemon listens to Telegram
- Captures: text, sender, group, media status
- Auto-reconnect on connection loss

### Smart Categorization
- 6 categories: ZONA_WARRIOR, NEED_KANVAS, H2H_SUPPLIER, ROOFTOP, RMW_INTERNAL, UNMAPPED
- Dropdown selector in Settings
- Instant category updates

### AI-Powered Analysis
- Chat interface for querying messages
- Context-aware responses (today's messages)
- Gemini Pro integration

### Professional Dashboard
- KPI metrics (total, today, active groups, AI processed)
- Recent messages preview
- Real-time updates (60s revalidation)

## 🛠 Quick Start

### 1. Database Setup

```bash
# 1. Create Supabase project at supabase.com
# 2. Run schema.sql in SQL Editor
# 3. Get credentials from Settings → API
```

### 2. Frontend Setup

```bash
cd web
npm install
cp .env.local.example .env.local
# Edit .env.local with your credentials
npm run dev
```

### 3. Collector Setup

```bash
cd collector
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python collector.py
# Enter phone number and verification code
```

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for production
- **[schema.sql](schema.sql)** - Database schema with comments

## 🔐 Environment Variables

### Frontend (`web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Collector (`collector/.env`)
```env
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
```

## 🎨 UI Components

Built with shadcn/ui:
- ✓ Button, Input, Card, Tabs
- ✓ Table, Select, Toast
- ✓ ScrollArea, Dialog
- ✓ Dark mode support

## 🔄 Data Flow

1. **Collection:** Telegram → Collector (Python) → Supabase
2. **Display:** Supabase → Server Actions → Next.js → UI
3. **AI Query:** UI → API Route → Gemini → UI

## 📊 Database Schema

### `messages`
- Stores all collected Telegram messages
- Fields: group_name, category, sender_name, sender_username, message_body, has_media, is_ai_processed

### `groups_config`
- Manages monitored groups
- Fields: group_name, category, is_active

## 🚢 Deployment

### Frontend → Vercel
```bash
cd web
vercel --prod
```

### Collector → VPS aaPanel
```bash
# Upload to VPS
scp -r collector/* root@vps:/www/wwwroot/telegram-collector/

# Setup as daemon (see DEPLOYMENT.md)
```

## 🐛 Troubleshooting

### Collector not receiving messages
- Check session file exists
- Verify group is active in Settings
- Check VPS logs

### Frontend not loading data
- Verify Supabase credentials
- Check RLS policies
- Redeploy Vercel

### AI not responding
- Verify Gemini API key
- Check API quota
- Review server logs

## 📝 License

MIT

## 👥 Support

For issues and questions, check:
1. DEPLOYMENT.md troubleshooting section
2. Supabase logs
3. Collector logs (VPS)
4. Vercel deployment logs
