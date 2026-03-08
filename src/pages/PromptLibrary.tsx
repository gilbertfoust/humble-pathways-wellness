import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion } from "framer-motion";
import { Heart, Battery, Shield, Compass, Leaf, Bookmark } from "lucide-react";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const categories = [
  { icon: Heart, en: "Emotional Check-In", es: "Chequeo Emocional", color: "bg-gold-light text-accent" },
  { icon: Battery, en: "Burnout Reset", es: "Reinicio de Agotamiento", color: "bg-sage-light text-primary" },
  { icon: Shield, en: "Boundary Reflection", es: "Reflexión de Límites", color: "bg-earth-light text-earth" },
  { icon: Compass, en: "Purpose Reconnection", es: "Reconexión con el Propósito", color: "bg-gold-light text-accent" },
  { icon: Leaf, en: "Grounding", es: "Arraigo", color: "bg-sage-light text-primary" },
];

const prompts = [
  { cat: 0, en: "What emotion is sitting with you most strongly right now?", es: "¿Qué emoción está más fuerte contigo ahora mismo?" },
  { cat: 0, en: "If your body could speak, what would it tell you today?", es: "Si tu cuerpo pudiera hablar, ¿qué te diría hoy?" },
  { cat: 1, en: "What's one thing you can let go of today — even temporarily?", es: "¿Qué es algo que puedes soltar hoy — aunque sea temporalmente?" },
  { cat: 1, en: "When was the last time you felt truly rested?", es: "¿Cuándo fue la última vez que te sentiste verdaderamente descansado/a?" },
  { cat: 2, en: "Where in your life do you say 'yes' when your body says 'no'?", es: "¿En qué parte de tu vida dices 'sí' cuando tu cuerpo dice 'no'?" },
  { cat: 2, en: "What boundary would your future self thank you for?", es: "¿Qué límite te agradecería tu yo futuro?" },
  { cat: 3, en: "What part of your work still feels meaningful to you?", es: "¿Qué parte de tu trabajo todavía se siente significativa para ti?" },
  { cat: 3, en: "What would you do if rest and resources weren't barriers?", es: "¿Qué harías si el descanso y los recursos no fueran barreras?" },
  { cat: 4, en: "Name five things you can see right now. Describe one in detail.", es: "Nombra cinco cosas que puedes ver ahora mismo. Describe una en detalle." },
  { cat: 4, en: "Place both feet on the ground. What do you notice?", es: "Coloca ambos pies en el suelo. ¿Qué notas?" },
];

const PromptLibrary: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<number | null>(null);

  const filtered = selectedCat !== null ? prompts.filter((p) => p.cat === selectedCat) : prompts;

  const handleSave = (prompt: string) => {
    toast.success(t("Prompt saved ✨", "Indicación guardada ✨"));
  };

  return (
    <MemberLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Prompt Library", "Biblioteca de Indicaciones")}</h1>
        <p className="text-muted-foreground mb-8">{t("Explore reflection prompts by category.", "Explora indicaciones de reflexión por categoría.")}</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setSelectedCat(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCat === null ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
          {t("All", "Todos")}
        </button>
        {categories.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCat(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCat === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            {t(cat.en, cat.es)}
          </button>
        ))}
      </div>

      {/* Prompts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((prompt, i) => {
          const cat = categories[prompt.cat];
          return (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t(cat.en, cat.es)}</p>
                    <p className="text-foreground font-medium leading-relaxed">{t(prompt.en, prompt.es)}</p>
                  </div>
                </div>
                <button onClick={() => handleSave(t(prompt.en, prompt.es))} className="p-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </MemberLayout>
  );
};

// Need useState import
import { useState } from "react";

export default PromptLibrary;
