import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Leaf, AlertTriangle, Phone, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const starterPromptsEn = [
  "How are you arriving today?",
  "What feels heavy right now?",
  "Where do you need more gentleness or boundaries?",
  "What helped you stay grounded this week?",
  "What part of your purpose feels most alive today?",
];

const starterPromptsEs = [
  "¿Cómo llegas hoy?",
  "¿Qué se siente pesado en este momento?",
  "¿Dónde necesitas más suavidad o límites?",
  "¿Qué te ayudó a mantenerte con los pies en la tierra esta semana?",
  "¿Qué parte de tu propósito se siente más viva hoy?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reflection-chat`;

type Msg = { role: "user" | "assistant"; content: string };

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    onError(errorData.error || "Something went wrong. Please try again.");
    return;
  }

  if (!resp.body) {
    onError("No response received.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const ReflectionChat: React.FC = () => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const starterPrompts = lang === "en" ? starterPromptsEn : starterPromptsEs;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    // Check for safety keywords client-side for immediate response
    const lower = text.toLowerCase();
    const safetyKeywords = ["suicide", "kill myself", "hurt myself", "suicidio", "matarme", "hacerme daño", "end it all", "don't want to live", "no quiero vivir"];
    if (safetyKeywords.some((kw) => lower.includes(kw))) {
      setShowSafety(true);
    }

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsTyping(false),
        onError: (error) => {
          toast.error(error);
          setIsTyping(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error(t("Something went wrong. Please try again.", "Algo salió mal. Intenta de nuevo."));
      setIsTyping(false);
    }
  };

  const handleSave = () => {
    toast.success(t("Reflection saved ✨", "Reflexión guardada ✨"));
  };

  return (
    <MemberLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">{t("Reflection Space", "Espacio de Reflexión")}</h1>
              <p className="text-xs text-muted-foreground">{t("Your AI reflection companion", "Tu compañero de reflexión IA")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSafety(!showSafety)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors" aria-label="Safety resources">
              <AlertTriangle className="w-5 h-5" />
            </button>
            {messages.length > 0 && (
              <button onClick={handleSave}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors" aria-label="Save reflection">
                <Save className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Safety panel */}
        <AnimatePresence>
          {showSafety && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="p-5 my-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5" /> {t("If you need immediate support", "Si necesitas apoyo inmediato")}
                </h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:988" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" /> 988 Suicide & Crisis Lifeline {t("(call or text 988)", "(llama o envía mensaje al 988)")}
                  </a>
                  <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" /> Crisis Text Line — {t("Text HOME to 741741", "Envía HOME al 741741")}
                  </a>
                  <a href="tel:911" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" /> {t("Emergency: 911", "Emergencia: 911")}
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {t(
                    "Humble Pathways is not a crisis service. If you are in danger, please reach out to the resources above.",
                    "Humble Pathways no es un servicio de crisis. Si estás en peligro, por favor comunícate con los recursos anteriores."
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="py-3">
          <p className="text-xs text-center text-muted-foreground">
            {t(
              "This is a reflective companion, not therapy or clinical care. Your reflections are private.",
              "Este es un compañero reflexivo, no terapia ni atención clínica. Tus reflexiones son privadas."
            )}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center mb-6 animate-breathe">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                {t("What's on your heart today?", "¿Qué hay en tu corazón hoy?")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                {t("Choose a starting point, or simply share what's present for you.", "Elige un punto de partida, o simplemente comparte lo que está presente para ti.")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {starterPrompts.map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt)}
                    className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all text-sm text-foreground">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-stone max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4 text-sm text-muted-foreground">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.2s" }}> ●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.4s" }}> ●</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("Share what's on your mind...", "Comparte lo que tienes en mente...")}
              className="flex-1 px-5 py-3 rounded-xl bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isTyping}
            />
            <button type="submit" disabled={!input.trim() || isTyping}
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-sage-dark transition-colors disabled:opacity-40">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ReflectionChat;
