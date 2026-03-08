import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const demoReflections = [
  { date: "2026-03-07", en: "I noticed today that my body holds tension in my shoulders when I feel overwhelmed at work. I want to try pausing more intentionally before responding to urgent emails.", es: "Noté hoy que mi cuerpo retiene tensión en los hombros cuando me siento abrumado/a en el trabajo. Quiero intentar hacer pausas más intencionales antes de responder correos urgentes.", mood: "😐" },
  { date: "2026-03-05", en: "I realized I've been saying 'yes' to everyone else and 'not yet' to myself. The boundary I want to set is leaving work on time at least three days this week.", es: "Me di cuenta de que he estado diciendo 'sí' a todos los demás y 'todavía no' a mí mismo/a. El límite que quiero establecer es salir del trabajo a tiempo al menos tres días esta semana.", mood: "🙂" },
  { date: "2026-03-02", en: "Today was heavy. A difficult case stayed with me after hours. I used the grounding exercise and it helped a little. I'm grateful for this space to process.", es: "Hoy fue pesado. Un caso difícil se quedó conmigo después del horario. Usé el ejercicio de arraigo y ayudó un poco. Estoy agradecido/a por este espacio para procesar.", mood: "😔" },
];

const SavedReflections: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MemberLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Saved Reflections", "Reflexiones Guardadas")}</h1>
        <p className="text-muted-foreground mb-8">{t("Your private reflection journal. Only you can see these.", "Tu diario de reflexión privado. Solo tú puedes ver esto.")}</p>
      </motion.div>

      <div className="space-y-4">
        {demoReflections.map((ref, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ref.mood}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> {ref.date}
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-foreground leading-relaxed">{t(ref.en, ref.es)}</p>
          </motion.div>
        ))}
      </div>
    </MemberLayout>
  );
};

export default SavedReflections;
