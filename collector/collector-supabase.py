"""
Telegram Message Collector for AI Assistant RMW
Compatible with existing collector logic + Supabase
"""

import os
from datetime import datetime
from telethon import TelegramClient, events
from supabase import create_client, Client
from dotenv import load_dotenv

# ================== LOAD ENV ==================
load_dotenv()

API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ================== CONNECT SUPABASE ==================
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Connected to Supabase")

# ================== GET CATEGORY FROM DB ==================
def get_category(group_name):
    try:
        response = supabase.table("groups_config")\
            .select("category")\
            .eq("group_name", group_name.strip())\
            .eq("is_active", True)\
            .limit(1)\
            .execute()
        
        return response.data[0]["category"] if response.data else None
    except Exception as e:
        print(f"❌ Error get_category: {e}")
        return None

# ================== AUTO CATEGORY ==================
def auto_category(group_name):
    name = group_name.lower()
    if "visit" in name or "warrior" in name or "zona" in name:
        return "ZONA_WARRIOR"
    elif "kebutuhan saldo" in name:
        return "NEED_KANVAS"
    elif "rmw apps" in name or "reload" in name or "payment" in name or "h2h" in name:
        return "H2H_SUPPLIER"
    elif "rooftop" in name:
        return "ROOFTOP"
    elif "laporan" in name or "cs" in name or "diskusi" in name:
        return "RMW_INTERNAL"
    return None

# ================== TELEGRAM ==================
client = TelegramClient("session", API_ID, API_HASH)

# folder media
os.makedirs("media", exist_ok=True)

# ================== HANDLER ==================
@client.on(events.NewMessage)
async def handler(event):
    try:
        chat = await event.get_chat()
        sender = await event.get_sender()
        
        group_name = getattr(chat, "title", "Private")
        group_name_clean = group_name.strip()
        
        print(f"📩 DEBUG GROUP: '{group_name_clean}'")
        
        # ================== CATEGORY ==================
        category = get_category(group_name_clean)
        
        if not category:
            category = auto_category(group_name_clean)
            
            if not category:
                # simpan sebagai UNMAPPED
                try:
                    supabase.table("groups_config").insert({
                        "group_name": group_name_clean,
                        "category": "UNMAPPED",
                        "is_active": False
                    }).execute()
                    print(f"🆕 GROUP BARU (UNMAPPED): {group_name_clean}")
                except Exception as e:
                    # Ignore duplicate key error
                    if "duplicate" not in str(e).lower():
                        print(f"❌ Error insert group: {e}")
                return
        
        # ================== SENDER ==================
        sender_id = getattr(sender, "id", None)
        sender_username = getattr(sender, "username", None)
        
        if sender_username:
            sender_link = f"https://t.me/{sender_username}"
        else:
            sender_link = f"tg://user?id={sender_id}"
        
        sender_name = (getattr(sender, "first_name", "") or 
                      getattr(sender, "username", "Unknown"))
        
        # ================== MESSAGE ==================
        message = event.message.message or ""
        raw_text = event.raw_text or message or ""
        date = event.message.date
        
        # 🔥 FIX: jangan skip kalau ada media
        if not raw_text and not event.message.media:
            return
        
        # ================== MEDIA ==================
        message_type = "text"
        media_path = None
        
        if event.message.media:
            message_type = "media"
            try:
                media_path = await event.download_media(file=f"media/{event.id}")
            except Exception as e:
                print(f"⚠️ Media download failed: {e}")
                media_path = None
        
        # ================== INSERT ==================
        try:
            supabase.table("messages").insert({
                "group_name": group_name_clean,
                "category": category,
                "sender_name": sender_name,
                "sender_id": sender_id,
                "sender_username": sender_username,
                "sender_link": sender_link,
                "message": message,
                "raw_text": raw_text,
                "date": date.isoformat(),
                "message_type": message_type,
                "media_path": media_path,
                "is_ai_processed": False
            }).execute()
            
            print(f"💾 SAVED | {category} | {group_name_clean} | {sender_name}")
        except Exception as e:
            print(f"❌ Error insert message: {e}")
    
    except Exception as e:
        print(f"❌ Error handler: {e}")

# ================== START ==================
print("🚀 Collector PRO (Supabase) aktif...")
with client:
    client.run_until_disconnected()
