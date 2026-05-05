import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch today's messages for context
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayMessages } = await supabase
      .from("messages")
      .select("*")
      .gte("date", today.toISOString())
      .order("date", { ascending: false })
      .limit(100);

    // Build context from messages
    const messagesByCategory: Record<string, any[]> = {};
    todayMessages?.forEach((msg) => {
      if (!messagesByCategory[msg.category]) {
        messagesByCategory[msg.category] = [];
      }
      messagesByCategory[msg.category].push(msg);
    });

    const contextSummary = Object.entries(messagesByCategory)
      .map(([category, messages]) => {
        return `\n## ${category} (${messages.length} messages)\n${messages
          .slice(0, 10)
          .map((m) => {
            const text = m.raw_text || m.message || "[Media message]";
            return `- [${m.group_name}] ${m.sender_name}: ${text.substring(0, 100)}${
              text.length > 100 ? "..." : ""
            }`;
          })
          .join("\n")}`;
      })
      .join("\n");

    // Create system prompt
    const systemPrompt = `You are an AI assistant for RMW (Rooftop Media Works), analyzing Telegram messages from various business groups.

**Your role:**
- Analyze messages from different categories: ZONA_WARRIOR, NEED_KANVAS, H2H_SUPPLIER, ROOFTOP, RMW_INTERNAL
- Provide insights, summaries, and answer questions about the messages
- Be concise and professional in Indonesian language
- Focus on actionable insights

**Today's Messages Summary:**
${contextSummary}

**Total messages today:** ${todayMessages?.length || 0}

User question: ${message}`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Error in Gemini API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
