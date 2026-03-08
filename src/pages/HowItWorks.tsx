import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { UserPlus, MessageCircle, BookOpen, Sparkles, ArrowRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { icon: UserPlus, en: "Create Your Space", es: "Crea Tu Espacio", descEn: "Sign up for a free account. Choose your language. Set your preferences. This is your space — no one else sees what you share here.", descEs: "Regístrate para una cuenta gratuita. Elige tu idioma. Establece tus preferencias. Este es tu espacio — nadie más ve lo que compartes aquí." },
  { icon: MessageCircle, en: "Begin a Guided Reflection", es: "Comienza una Reflexión Guiada", descEn: "Choose a reflection path — Emotional Check-In, Burnout Reset, Boundary Reflection, Purpose Reconnection, or Open Journal. Our AI companion offers gentle, thoughtful prompts one at a time.", descEs: "Elige un camino de reflexión — Chequeo Emocional, Reinicio de Agotamiento, Reflexión de Límites, Reconexión con el Propósito, o Diario Abierto. Nuestro compañero de IA ofrece indicaciones gentiles y reflexivas, una a la vez." },
  { icon: BookOpen, en: "Save & Revisit", es: "Guarda y Revisa", descEn: "Save reflections that resonate. Track how you're feeling over time. Revisit past entries to notice patterns and celebrate growth.", descEs: "Guarda las reflexiones que resuenen. Rastrea cómo te sientes con el tiempo. Revisa entradas pasadas para notar patrones y celebrar el crecimiento." },
  { icon: Sparkles, en: "Explore Resources", es: "Explora Recursos", descEn: "Access curated resources for grounding, rest, boundaries, community support, and professional help — organized by what you need most.", descEs: "Accede a recursos curados para arraigo, descanso, límites, apoyo comunitario y ayuda profesional — organizados por lo que más necesitas." },
];

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">{t("How It Works", "Cómo Funciona")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("A gentle path, at your own pace.", "Un camino gentil, a tu propio ritmo.")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "No appointments. No paperwork. Just a calm, private space for you to pause, reflect, and reconnect with what matters most.",
                "Sin citas. Sin papeleo. Solo un espacio tranquilo y privado para que hagas una pausa, reflexiones y te reconectes con lo que más importa."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 items-start p-8 rounded-2xl bg-card border border-border"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-sage-light flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-accent">{t("Step", "Paso")} {i + 1}</span>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{t(step.en, step.es)}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{t(step.descEn, step.descEs)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="mt-12 text-center">
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-sage-dark transition-colors">
              {t("Start Your Journey", "Comienza Tu Camino")} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
