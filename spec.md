# Technical Specification: AI Assistant Telegram RMW

## 🏗 Architecture & Tech Stack
- **Collector:** Python 3.10+ with Telethon library.
- **Database & Auth:** Supabase (PostgreSQL).
- **Frontend Framework:** Next.js 14+ (App Router).
- **Styling & UI:** Tailwind CSS + **shadcn/ui** (Lucide Icons, Radix UI primitives).
- **AI Integration:** Google Gemini API.
- **State Management & Fetching:** React Query / SWR (optional for real-time), Supabase JS Client.

## 🗃 Database Schema (Supabase)

### Table: `messages`
- `id`: uuid (primary key)
- `created_at`: timestamp with time zone
- `group_name`: text
- `category`: text 
- `sender_name`: text
- `message_body`: text
- `is_ai_processed`: boolean

### Table: `system_configs` (NEW)
- `id`: integer (primary key)
- `config_key`: text (unique) (e.g., 'GEMINI_API_KEY', 'TELEGRAM_API_ID', 'TELEGRAM_HASH')
- `config_value`: text (encrypted/masked at application level)

### Table: `groups_config`
- `id`: uuid (primary key)
- `group_name`: text (unique)
- `category`: text
- `is_active`: boolean (default true)

## 💻 Frontend Pages & Routing (Next.js)

### 1. `/login`
- **UI:** Minimalist login form using shadcn `Card`, `Input`, and `Button`.
- **Logic:** Supabase Email/Password authentication.

### 2. `/dashboard`
- **UI:** Professional dashboard layout.
- **Components:** shadcn `Card` for KPI metrics (Total Messages Today, Active Groups), and minimal charts for message volume.

### 3. `/messages`
- **UI:** shadcn `DataTable` (TanStack Table).
- **Features:** Server-side pagination, sorting, and filtering based on category.

### 4. `/ai-query`
- **UI:** Chat-like interface using shadcn `ScrollArea` for message history and fixed bottom `Textarea` for input.

### 5. `/settings` (Configuration Hub)
- **UI:** shadcn `Tabs` layout to separate different setting categories cleanly.
- **Tab 1: API & Tokens:** Forms to update/save Gemini API Key and Telegram Session Tokens securely.
- **Tab 2: Group Management:** shadcn `DataTable` to CRUD `groups_config` (Whitelist groups, set categories).
- **Tab 3: AI Preferences:** Setting system prompts or auto-summary rules.

## 🎨 Design System (shadcn/ui requirements)
- **Theme:** Clean, minimalistic, monochrome with subtle primary brand colors. Dark mode support out-of-the-box.
- **Required shadcn components to initialize:** `button`, `input`, `form`, `card`, `dialog`, `table`, `tabs`, `scroll-area`, `toast`, `dropdown-menu`.