-- AI Assistant Telegram RMW v3.0 - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    group_name TEXT NOT NULL,
    category TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_username TEXT,
    message_body TEXT NOT NULL,
    has_media BOOLEAN DEFAULT FALSE,
    is_ai_processed BOOLEAN DEFAULT FALSE
);

-- ============================================
-- Table: groups_config
-- ============================================
CREATE TABLE IF NOT EXISTS groups_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ZONA_WARRIOR', 'NEED_KANVAS', 'H2H_SUPPLIER', 'ROOFTOP', 'RMW_INTERNAL', 'UNMAPPED')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_group_name ON messages(group_name);
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_is_ai_processed ON messages(is_ai_processed);
CREATE INDEX IF NOT EXISTS idx_messages_sender_username ON messages(sender_username);
CREATE INDEX IF NOT EXISTS idx_groups_config_is_active ON groups_config(is_active);
CREATE INDEX IF NOT EXISTS idx_groups_config_category ON groups_config(category);

-- ============================================
-- Sample Data
-- ============================================
INSERT INTO groups_config (group_name, category, is_active) VALUES
    ('ZONA_WARRIOR', 'ZONA_WARRIOR', TRUE),
    ('NEED_KANVAS', 'NEED_KANVAS', TRUE),
    ('H2H_SUPPLIER', 'H2H_SUPPLIER', TRUE),
    ('ROOFTOP', 'ROOFTOP', TRUE),
    ('RMW_INTERNAL', 'RMW_INTERNAL', TRUE)
ON CONFLICT (group_name) DO NOTHING;

-- ============================================
-- Row Level Security (RLS) - Development Mode
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups_config ENABLE ROW LEVEL SECURITY;

-- Allow all operations for development (adjust for production)
CREATE POLICY "Allow all operations on messages"
    ON messages
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on groups_config"
    ON groups_config
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Function: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Trigger: Auto-update updated_at
-- ============================================
CREATE TRIGGER update_groups_config_updated_at
    BEFORE UPDATE ON groups_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify setup:
-- SELECT * FROM groups_config;
-- SELECT COUNT(*) FROM messages;
