import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion } from "framer-motion";
import { Sun, Battery, Brain, MessageCircle, ArrowRight, Leaf, Shield, Heart, Compass } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const moods = [
  { emoji: "😔", en: "Heavy", es: "Pesado/a" },
  { emoji: "😐", en: "Okay", es: "Regular" },
  { emoji: "🙂", en: "Steady", es: "Estable" },
  { emoji: "😊", en: "Good", es: "Bien" },
  { emoji: "✨", en: "Bright", es: "Brillante" },
];

const reflectionPaths = [
  { icon: Heart, en: "Emotional Check-In", es: "Chequeo Emocional", color: "bg-gold-light text-accent" },
  { icon: Battery, en: "Burnout Reset", es: "Reinicio de Agotamiento", color: "bg-sage-light text-primary" },
  { icon: Shield, en: "Boundary Reflection", es: "Reflexión de Límites", color: "bg-earth-light text-earth" },
  { icon: Compass, en: "Purpose Reconnection", es: "Reconexión con el Propósito", color: "bg-gold-light text-accent" },
  { icon: Leaf, en: "Open Journal", es: "Diario Abierto", color: "bg-sage-light text-primary" },
];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);

  return (
    <MemberLayout>
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          {t("Welcome back.", "Bienvenido/a de vuelta.")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("How are you arriving today?", "¿Cómo llegas hoy?")}</p>
      </motion.div>

      {/* Check-in widget */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 md:p-8 rounded-2xl bg-card border border-border mb-8">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-5">{t("Gentle Check-In", "Chequeo Suave")}</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">{t("Mood", "Ánimo")}</label>
            <div className="flex gap-3">
              {moods.map((m, i) => (
                <button key={i} onClick={() => setSelectedMood(i)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    selectedMood === i ? "border-primary bg-sage-light scale-105" : "border-border hover:border-primary/30"
                  }`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs text-muted-foreground">{t(m.en, m.es)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-accent" /> {t("Energy", "Energía")}: {energy}/5
              </label>
              <input type="range" min="1" max="5" value={energy} onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-clay" /> {t("Stress", "Estrés")}: {stress}/5
              </label>
              <input type="range" min="1" max="5" value={stress} onChange={(e) => setStress(Number(e.target.value))}
                className="w-full accent-primary" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reflection paths */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-5">{t("Start a Reflection", "Comienza una Reflexión")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {reflectionPaths.map((path, i) => (
            <Link key={i} to="/reflection"
              className="p-5 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${path.color}`}>
                <path.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{t(path.en, path.es)}</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick reflect CTA */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 md:p-8 rounded-2xl bg-primary text-primary-foreground">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold mb-2">{t("Ready to reflect?", "¿Listo/a para reflexionar?")}</h2>
            <p className="text-primary-foreground/80 text-sm">{t("Your AI reflection companion is here whenever you need it.", "Tu compañero de reflexión IA está aquí cuando lo necesites.")}</p>
          </div>
          <Link to="/reflection" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground text-foreground font-semibold hover:bg-gold-light transition-colors flex-shrink-0">
            <MessageCircle className="w-4 h-4" /> {t("Begin", "Comenzar")}
          </Link>
        </div>
      </motion.div>
    </MemberLayout>
  );
};

export default Dashboard;
