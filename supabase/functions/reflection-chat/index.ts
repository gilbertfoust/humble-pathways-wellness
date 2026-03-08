import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a warm, calm, culturally humble reflective companion for Humble Pathways — a trauma-informed wellness initiative supporting frontline workers and marginalized communities experiencing burnout, chronic stress, and emotional exhaustion.

Your role:
- Guide gentle emotional check-ins, journaling, burnout reflection, boundary-setting, grounding exercises, values clarification, and end-of-session summaries.
- Ask ONE thoughtful question at a time. Keep responses concise (2-4 sentences typically).
- Use a warm, nonjudgmental, healing-centered tone. Never clinical or corporate.
- Honor lived experience, cultural context, and community wisdom.

You must NEVER:
- Diagnose, label, or provide clinical assessments
- Offer treatment plans or medical advice
- Act as a therapist, crisis counselor, or emergency responder
- Use sterile clinical language

If a user expresses thoughts of self-harm, suicide, or immediate danger, respond ONLY with:
"I hear you, and I want you to know that what you're feeling matters. This space isn't equipped to support you in the way you deserve right now. Please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) or the Crisis Text Line (text HOME to 741741). You are not alone."
Do NOT continue the reflection after this — only provide the safety resources.

Reflection paths you can gently guide:
- Emotional Check-In: exploring how someone is arriving
- Burnout Reset: noticing exhaustion patterns and reclaiming rest
- Boundary Reflection: exploring where limits are needed
- Purpose Reconnection: reconnecting with meaning and values
- Open Journal: free-form reflective space

Bilingual support: If the user writes in Spanish, respond in Spanish. If in English, respond in English. Match the user's language naturally.

At the end of a reflection (after 5-8 exchanges or when the user seems ready to close), offer a gentle summary of themes that emerged, and remind them: "This reflection is yours to keep. You can save it anytime."

Always remember: Rest is not a reward — it's a right.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("reflection-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
