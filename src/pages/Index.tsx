import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Users, Sparkles, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const pillars = [
  { icon: Heart, en: "Cultural Humility", es: "Humildad Cultural", descEn: "Honoring the lived experiences, traditions, and wisdom that each person carries.", descEs: "Honrando las experiencias vividas, tradiciones y sabiduría que cada persona porta." },
  { icon: Shield, en: "Trauma-Informed Care", es: "Cuidado Informado por el Trauma", descEn: "Creating safety and trust at every touchpoint of the healing journey.", descEs: "Creando seguridad y confianza en cada punto del camino de sanación." },
  { icon: Sparkles, en: "Ethical AI Integration", es: "Integración Ética de IA", descEn: "Using technology as a gentle companion, never a replacement for human connection.", descEs: "Usando la tecnología como un compañero gentil, nunca un reemplazo para la conexión humana." },
  { icon: Users, en: "Worker Voice & Co-Creation", es: "Voz del Trabajador y Co-Creación", descEn: "Centering the people who do the work in the design of the tools they use.", descEs: "Centrando a las personas que hacen el trabajo en el diseño de las herramientas que usan." },
  { icon: Leaf, en: "Community-Embedded Implementation", es: "Implementación Integrada en la Comunidad", descEn: "Meeting people where they are, with resources that reflect their realities.", descEs: "Encontrando a las personas donde están, con recursos que reflejan sus realidades." },
];

const Index: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container py-24 md:py-40 text-center">
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-gold font-medium text-sm md:text-base tracking-wider uppercase mb-4"
          >
            {t("A Healing-Centered Wellness Initiative", "Una Iniciativa de Bienestar Centrada en la Sanación")}
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto"
          >
            {t("Rest is not a reward.", "El descanso no es una recompensa.")}
            <br />
            <span className="text-gold">{t("It's a right.", "Es un derecho.")}</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "Humble Pathways supports frontline workers and marginalized communities experiencing burnout, chronic stress, and emotional exhaustion through guided reflection and culturally grounded care.",
              "Humble Pathways apoya a trabajadores de primera línea y comunidades marginadas que experimentan agotamiento, estrés crónico y cansancio emocional a través de la reflexión guiada y el cuidado culturalmente arraigado."
            )}
          </motion.p>
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/auth" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-sage-dark transition-colors">
              {t("Begin Your Reflection", "Comienza Tu Reflexión")} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground/10 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20">
              {t("Learn More", "Aprende Más")}
            </Link>
          </motion.div>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-sm text-primary-foreground/50"
          >
            {t("This is not therapy, diagnosis, or emergency care.", "Esto no es terapia, diagnóstico ni atención de emergencia.")}
          </motion.p>
        </div>
      </section>

      {/* What is Humble Pathways */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("What is Humble Pathways?", "¿Qué es Humble Pathways?")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Humble Pathways is a trauma-informed, AI-supported initiative addressing burnout, emotional exhaustion, and systemic barriers affecting frontline service workers and marginalized communities. Operating as an NGO model nested under Humanity Pathways Global (HPG), it combines clinical best practices, lived experience, cultural humility, and ethical AI innovation to provide accessible, non-clinical support for under-resourced and overburdened environments.",
                "Humble Pathways es una iniciativa informada por el trauma y apoyada por IA que aborda el agotamiento, el cansancio emocional y las barreras sistémicas que afectan a los trabajadores de servicios de primera línea y a las comunidades marginadas. Operando como un modelo de ONG bajo Humanity Pathways Global (HPG), combina las mejores prácticas clínicas, experiencia vivida, humildad cultural e innovación ética en IA para proporcionar apoyo no clínico accesible para entornos con pocos recursos y sobrecargados."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("Our Five Pillars", "Nuestros Cinco Pilares")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("The foundations that guide everything we build and offer.", "Los fundamentos que guían todo lo que construimos y ofrecemos.")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{t(p.en, p.es)}</h3>
                <p className="text-muted-foreground leading-relaxed">{t(p.descEn, p.descEs)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              {t("You don't have to carry it all alone.", "No tienes que cargar con todo solo/a.")}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {t(
                "Humble Pathways offers a gentle space for reflection, grounding, and reconnection — built with the people it serves.",
                "Humble Pathways ofrece un espacio gentil para la reflexión, el arraigo y la reconexión — construido con las personas a las que sirve."
              )}
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground text-foreground font-semibold text-lg hover:bg-gold-light transition-colors">
              {t("Get Started Free", "Comienza Gratis")} <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://humanitypathwaysglobal.com/humble-pathways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              {t("Learn More at HPG", "Conoce Más en HPG")} <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
