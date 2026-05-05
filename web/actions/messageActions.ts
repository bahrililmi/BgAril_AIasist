"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Message {
  id: string;
  created_at: string;
  group_name: string;
  category: string;
  sender_name: string;
  sender_id: number | null;
  sender_username: string | null;
  sender_link: string | null;
  message: string | null;
  raw_text: string | null;
  date: string;
  message_type: string;
  media_path: string | null;
  is_ai_processed: boolean;
}

export async function getRecentMessages(limit: number = 500): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function getMessagesByCategory(category: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("category", category)
      .order("date", { ascending: false })
      .limit(500);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages by category:", error);
    return [];
  }
}

export async function getTodayMessages(): Promise<Message[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .gte("date", today.toISOString())
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching today's messages:", error);
    return [];
  }
}

export async function getMessageStats() {
  try {
    // Total messages
    const { count: totalMessages } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true });

    // Messages today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: messagesToday } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .gte("date", today.toISOString());

    // Active groups
    const { count: activeGroups } = await supabase
      .from("groups_config")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // AI processed
    const { count: aiProcessed } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_ai_processed", true);

    return {
      totalMessages: totalMessages || 0,
      messagesToday: messagesToday || 0,
      activeGroups: activeGroups || 0,
      aiProcessed: aiProcessed || 0,
    };
  } catch (error) {
    console.error("Error fetching message stats:", error);
    return {
      totalMessages: 0,
      messagesToday: 0,
      activeGroups: 0,
      aiProcessed: 0,
    };
  }
}
