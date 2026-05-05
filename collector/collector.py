"""
Telegram Message Collector for AI Assistant RMW v3.0
Runs as 24/7 daemon on VPS aaPanel
"""

import os
import asyncio
import logging
from datetime import datetime
from telethon import TelegramClient, events
from supabase import create_client, Client
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Telegram Configuration
API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Telegram client with local session file
client = TelegramClient('session', API_ID, API_HASH)

# Cache for groups config (refresh every 5 minutes)
groups_cache = {}
last_cache_update = None
CACHE_DURATION = 300  # 5 minutes in seconds


async def refresh_groups_cache():
    """Fetch and cache groups configuration from Supabase"""
    global groups_cache, last_cache_update
    try:
        response = supabase.table("groups_config").select("*").execute()
        groups_cache = {group['group_name']: group for group in response.data}
        last_cache_update = datetime.now()
        logger.info(f"✓ Groups cache refreshed: {len(groups_cache)} groups loaded")
    except Exception as e:
        logger.error(f"✗ Error refreshing groups cache: {e}")


async def get_or_create_group(group_name: str):
    """
    Get group config from cache or create new UNMAPPED group
    Returns group config dict or None
    """
    global groups_cache, last_cache_update
    
    # Refresh cache if needed
    if last_cache_update is None or (datetime.now() - last_cache_update).seconds > CACHE_DURATION:
        await refresh_groups_cache()
    
    # Check if group exists in cache
    if group_name in groups_cache:
        return groups_cache[group_name]
    
    # Group not found - create new UNMAPPED group
    try:
        logger.info(f"⊕ New group detected: {group_name} - Creating as UNMAPPED")
        new_group = {
            "group_name": group_name,
            "category": "UNMAPPED",
            "is_active": True
        }
        
        response = supabase.table("groups_config").insert(new_group).execute()
        
        if response.data:
            created_group = response.data[0]
            groups_cache[group_name] = created_group
            logger.info(f"✓ Group created: {group_name}")
            return created_group
        
    except Exception as e:
        logger.error(f"✗ Error creating group {group_name}: {e}")
        return None


async def insert_message(group_name: str, category: str, sender_name: str, 
                        sender_username: str, message_body: str, has_media: bool):
    """Insert message into Supabase with retry logic"""
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            data = {
                "group_name": group_name,
                "category": category,
                "sender_name": sender_name,
                "sender_username": sender_username,
                "message_body": message_body,
                "has_media": has_media,
                "is_ai_processed": False,
                "created_at": datetime.utcnow().isoformat()
            }
            
            response = supabase.table("messages").insert(data).execute()
            logger.info(f"✓ Message saved: {sender_name} in {group_name} ({category})")
            return response.data
            
        except Exception as e:
            logger.error(f"✗ Error inserting message (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
            else:
                logger.error(f"✗ Failed to insert message after {max_retries} attempts")
                return None


@client.on(events.NewMessage)
async def handle_new_message(event):
    """Handle incoming Telegram messages"""
    try:
        # Get chat information
        chat = await event.get_chat()
        
        # Skip private chats
        if not hasattr(chat, 'title'):
            return
        
        group_name = chat.title
        
        # Get message body
        message_body = event.message.text or ""
        
        # Check if message has media
        has_media = event.message.media is not None
        
        # Skip if no text and no media
        if not message_body and not has_media:
            return
        
        # If no text but has media, use placeholder
        if not message_body:
            message_body = "[Media message]"
        
        # Get sender information
        sender = await event.get_sender()
        sender_name = f"{sender.first_name or ''} {sender.last_name or ''}".strip() or "Unknown"
        sender_username = sender.username if hasattr(sender, 'username') else None
        
        # Get or create group configuration
        group_config = await get_or_create_group(group_name)
        
        if not group_config:
            logger.warning(f"⊘ Failed to get/create group config for: {group_name}")
            return
        
        # Check if group is active
        if not group_config.get("is_active", False):
            logger.debug(f"⊘ Group inactive: {group_name}")
            return
        
        category = group_config.get("category", "UNMAPPED")
        
        # Insert message to database
        await insert_message(
            group_name=group_name,
            category=category,
            sender_name=sender_name,
            sender_username=sender_username,
            message_body=message_body,
            has_media=has_media
        )
        
    except Exception as e:
        logger.error(f"✗ Error handling message: {e}", exc_info=True)


async def main():
    """Main function to start the collector daemon"""
    logger.info("=" * 60)
    logger.info("🚀 AI Assistant RMW - Telegram Collector v3.0")
    logger.info("=" * 60)
    
    # Initial cache load
    await refresh_groups_cache()
    
    # Connect to Telegram
    logger.info("📡 Connecting to Telegram...")
    await client.start()
    logger.info("✓ Connected to Telegram")
    
    # Get current user info
    me = await client.get_me()
    logger.info(f"✓ Logged in as: {me.first_name} (@{me.username})")
    logger.info(f"✓ Monitoring {len(groups_cache)} groups")
    
    logger.info("👂 Listening for new messages...")
    logger.info("Press Ctrl+C to stop")
    logger.info("=" * 60)
    
    # Keep the client running with auto-reconnect
    try:
        await client.run_until_disconnected()
    except Exception as e:
        logger.error(f"✗ Connection lost: {e}")
        logger.info("🔄 Attempting to reconnect in 10 seconds...")
        await asyncio.sleep(10)
        await main()  # Recursive reconnect


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\n👋 Collector stopped by user")
    except Exception as e:
        logger.error(f"✗ Fatal error: {e}", exc_info=True)
        logger.info("🔄 Restarting in 30 seconds...")
        asyncio.sleep(30)
        asyncio.run(main())
