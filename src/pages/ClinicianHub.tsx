import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Stethoscope, Heart, FileText, Brain, ArrowLeft, AlertTriangle, Phone, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type ClinicianMode = "debrief" | "notes" | "diagnosis" | "selfcare";

const modes = {
  debrief: {
    icon: Heart,
    en: "Patient Debrief",
    es: "Procesamiento de Casos",
    descEn: "Process difficult patient encounters to prevent compassion fatigue",
    descEs: "Procesa encuentros difíciles con pacientes para prevenir la fatiga por compasión",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  notes: {
    icon: FileText,
    en: "Case Notes",
    es: "Notas Clínicas",
    descEn: "Structure observations into SOAP, DAP, or Narrative format",
    descEs: "Estructura observaciones en formato SOAP, DAP o Narrativo",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  diagnosis: {
    icon: Brain,
    en: "Diagnosis Support",
    es: "Apoyo Diagnóstico",
    descEn: "Think through differential diagnosis with a reasoning partner",
    descEs: "Razona el diagnóstico diferencial con un compañero de pensamiento",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  selfcare: {
    icon: Stethoscope,
    en: "Self-Care Check",
    es: "Chequeo de Autocuidado",
    descEn: "Assess compassion fatigue and get personalized self-care guidance",
    descEs: "Evalúa la fatiga por compasión y recibe orientación personalizada",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
};

const starterPrompts: Record<ClinicianMode, { en: string[]; es: string[] }> = {
  debrief: {
    en: [
      "I had a really difficult session today...",
      "I can't stop thinking about a patient",
      "I feel emotionally drained after work",
      "Something triggered me during a case",
    ],
    es: [
      "Tuve una sesión muy difícil hoy...",
      "No puedo dejar de pensar en un paciente",
      "Me siento emocionalmente agotado/a después del trabajo",
      "Algo me activó durante un caso",
    ],
  },
  notes: {
    en: [
      "Help me structure a SOAP note",
      "I need to write a progress note",
      "Let's organize my session observations",
      "Help me with DAP note format",
    ],
    es: [
      "Ayúdame a estructurar una nota SOAP",
      "Necesito escribir una nota de progreso",
      "Organicemos mis observaciones de la sesión",
      "Ayúdame con el formato de nota DAP",
    ],
  },
  diagnosis: {
    en: [
      "I'm seeing symptoms that could be multiple things",
      "Help me think through this presentation",
      "I want to rule out some conditions",
      "Let's explore differential diagnosis",
    ],
    es: [
      "Estoy viendo síntomas que podrían ser varias cosas",
      "Ayúdame a pensar en esta presentación",
      "Quiero descartar algunas condiciones",
      "Exploremos el diagnóstico diferencial",
    ],
  },
  selfcare: {
    en: [
      "I'm feeling burned out lately",
      "Check in on my wellbeing",
      "I think I might have compassion fatigue",
      "Help me assess my stress levels",
    ],
    es: [
      "Me siento agotado/a últimamente",
      "Revisa mi bienestar",
      "Creo que podría tener fatiga por compasión",
      "Ayúdame a evaluar mis niveles de estrés",
    ],
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinician-chat`;

type Msg = { role: "user" | "assistant"; content: string };

async function streamChat({
  messages,
  mode,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  mode: ClinicianMode;
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
    body: JSON.stringify({ messages, mode }),
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

const ClinicianHub: React.FC = () => {
  const { lang, t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<ClinicianMode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleModeSelect = (mode: ClinicianMode) => {
    setSelectedMode(mode);
    setMessages([]);
    setInput("");
  };

  const handleBack = () => {
    setSelectedMode(null);
    setMessages([]);
    setInput("");
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping || !selectedMode) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

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
        mode: selectedMode,
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

  // Mode selection view
  if (!selectedMode) {
    return (
      <MemberLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {t("Clinician Hub", "Centro Clínico")}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t(
                "AI-powered tools designed for healthcare workers and clinicians to support patient care and prevent burnout.",
                "Herramientas impulsadas por IA diseñadas para trabajadores de salud y clínicos para apoyar el cuidado del paciente y prevenir el agotamiento."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(modes) as ClinicianMode[]).map((mode) => {
              const { icon: Icon, en, es, descEn, descEs, color, bg } = modes[mode];
              return (
                <motion.button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {t(en, es)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(descEn, descEs)}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-center text-muted-foreground">
              {t(
                "⚕️ These tools support clinical work but do not replace supervision, consultation, or professional judgment. Never enter Protected Health Information (PHI).",
                "⚕️ Estas herramientas apoyan el trabajo clínico pero no reemplazan la supervisión, consulta o juicio profesional. Nunca ingrese Información de Salud Protegida (PHI)."
              )}
            </p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  // Chat view
  const currentMode = modes[selectedMode];
  const CurrentIcon = currentMode.icon;
  const prompts = starterPrompts[selectedMode][lang];

  return (
    <MemberLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-full ${currentMode.bg} flex items-center justify-center`}>
              <CurrentIcon className={`w-5 h-5 ${currentMode.color}`} />
            </div>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {t(currentMode.en, currentMode.es)}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("Clinician AI Assistant", "Asistente de IA Clínica")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSafety(!showSafety)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>

        {/* Safety panel */}
        <AnimatePresence>
          {showSafety && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 my-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5" /> {t("Crisis Resources", "Recursos de Crisis")}
                </h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:988" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" /> 988 Suicide & Crisis Lifeline
                  </a>
                  <a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" /> Crisis Text Line — Text HOME to 741741
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="py-3">
          <p className="text-xs text-center text-muted-foreground">
            {t(
              "Do not enter PHI. This is a reasoning support tool, not a medical record.",
              "No ingrese PHI. Esta es una herramienta de apoyo al razonamiento, no un registro médico."
            )}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className={`w-16 h-16 rounded-full ${currentMode.bg} flex items-center justify-center mb-6`}>
                <CurrentIcon className={`w-8 h-8 ${currentMode.color}`} />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                {t(currentMode.en, currentMode.es)}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                {t(currentMode.descEn, currentMode.descEs)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all text-sm text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
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
              placeholder={t("Type your message...", "Escribe tu mensaje...")}
              className="flex-1 px-5 py-3 rounded-xl bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ClinicianHub;
