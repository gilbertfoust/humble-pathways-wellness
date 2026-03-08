import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import communityImg from "@/assets/community.jpg";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-cream">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">{t("About Us", "Sobre Nosotros")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("Healing is not a luxury. It's a practice.", "La sanación no es un lujo. Es una práctica.")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Humble Pathways was born from the understanding that the people who hold our communities together are often the ones most overlooked in conversations about wellness and healing.",
                "Humble Pathways nació de la comprensión de que las personas que mantienen unidas a nuestras comunidades son a menudo las más ignoradas en las conversaciones sobre bienestar y sanación."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <img src={communityImg} alt={t("Community workers gathering together", "Trabajadores comunitarios reunidos")} className="rounded-2xl w-full h-auto shadow-lg" />
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t("Who We Serve", "A Quién Servimos")}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t(
                "Social workers, case managers, community health workers, educators, peer support specialists, and those in high-stress caregiving roles. People navigating generational trauma, systemic inequity, and the emotional weight of service.",
                "Trabajadores sociales, gestores de casos, trabajadores de salud comunitaria, educadores, especialistas en apoyo entre pares y aquellos en roles de cuidado de alto estrés. Personas que navegan el trauma generacional, la inequidad sistémica y el peso emocional del servicio."
              )}</p>
              <p>{t(
                "We also welcome anyone from marginalized communities who needs a moment of grounding, reflection, or reconnection with their own sense of purpose.",
                "También damos la bienvenida a cualquier persona de comunidades marginadas que necesite un momento de arraigo, reflexión o reconexión con su propio sentido de propósito."
              )}</p>
            </div>
            <div className="mt-8 p-6 bg-sage-light rounded-xl border border-primary/10">
              <p className="text-sm text-primary font-medium">
                {t(
                  "⚠ Humble Pathways is not therapy, diagnosis, crisis counseling, or emergency response. We offer supportive reflection and wellness tools only.",
                  "⚠ Humble Pathways no es terapia, diagnóstico, consejería de crisis ni respuesta de emergencia. Ofrecemos herramientas de reflexión y bienestar de apoyo únicamente."
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-card">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              {t("Our Approach", "Nuestro Enfoque")}
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t(
                "We combine clinical best practices with lived experience, cultural humility, and ethical AI innovation. Our tools are designed with — not just for — the communities they serve.",
                "Combinamos las mejores prácticas clínicas con experiencia vivida, humildad cultural e innovación ética en IA. Nuestras herramientas están diseñadas con — no solo para — las comunidades a las que sirven."
              )}</p>
              <p>{t(
                "Humble Pathways operates as an NGO model nested under Humanity Pathways Global (HPG), bringing together research-grounded frameworks and community-centered design to make wellness support genuinely accessible.",
                "Humble Pathways opera como un modelo de ONG bajo Humanity Pathways Global (HPG), reuniendo marcos fundamentados en la investigación y el diseño centrado en la comunidad para hacer que el apoyo al bienestar sea genuinamente accesible."
              )}</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
