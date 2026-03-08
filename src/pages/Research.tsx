import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { TrendingDown, Brain, Cpu, BookOpen, DollarSign, Scale, Building, HeartHandshake } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Research: React.FC = () => {
  const { t } = useLanguage();

  const findings = [
    { icon: TrendingDown, en: "Reduced Paperwork Burden", es: "Reducción de la Carga de Papeleo", descEn: "Early findings suggest that AI-supported reflection can reduce documentation fatigue among practitioners, freeing time for meaningful connection.", descEs: "Los hallazgos iniciales sugieren que la reflexión asistida por IA puede reducir la fatiga de documentación entre los profesionales, liberando tiempo para conexiones significativas." },
    { icon: Brain, en: "Improved Emotional Recovery", es: "Mejor Recuperación Emocional", descEn: "Participants report increased self-awareness and faster emotional recovery through structured, culturally responsive reflection practices.", descEs: "Los participantes reportan mayor autoconciencia y recuperación emocional más rápida a través de prácticas de reflexión estructuradas y culturalmente responsivas." },
    { icon: Cpu, en: "Feasibility of Trauma-Informed AI", es: "Viabilidad de IA Informada por el Trauma", descEn: "Preliminary work demonstrates that AI can be designed to support — not replace — human healing when grounded in ethical frameworks and community input.", descEs: "El trabajo preliminar demuestra que la IA puede diseñarse para apoyar — no reemplazar — la sanación humana cuando está fundamentada en marcos éticos y aportaciones comunitarias." },
  ];

  const frameworks = [
    { en: "Healing-Centered Engagement (Dr. Shawn Ginwright)", es: "Compromiso Centrado en la Sanación (Dr. Shawn Ginwright)" },
    { en: "Liberation Psychology", es: "Psicología de la Liberación" },
    { en: "SAMHSA's Trauma-Informed Care Framework", es: "Marco de Cuidado Informado por el Trauma de SAMHSA" },
  ];

  const grantRelevance = [
    { icon: DollarSign, en: "Cost-Effective Burnout Prevention", es: "Prevención del Agotamiento Rentable", descEn: "No traditional medical infrastructure required. A scalable model that can be implemented in under-resourced settings at a fraction of the cost of clinical programs.", descEs: "Sin necesidad de infraestructura médica tradicional. Un modelo escalable que puede implementarse en entornos con pocos recursos a una fracción del costo de los programas clínicos." },
    { icon: Scale, en: "Equity-Based Outcomes", es: "Resultados Basados en la Equidad", descEn: "Supports measurable equity outcomes across education, health, and community services — aligned with funder priorities for diversity, equity, and inclusion.", descEs: "Apoya resultados de equidad medibles en educación, salud y servicios comunitarios — alineados con las prioridades de financiadores en diversidad, equidad e inclusión." },
    { icon: Building, en: "Foundation & Grant Alignment", es: "Alineación con Fundaciones y Subvenciones", descEn: "Relevant for workforce resilience funds, innovation grants, trauma recovery funding, and social justice philanthropy.", descEs: "Relevante para fondos de resiliencia laboral, subvenciones de innovación, financiamiento de recuperación de trauma y filantropía de justicia social." },
    { icon: HeartHandshake, en: "Community Partnership Model", es: "Modelo de Asociación Comunitaria", descEn: "Built for collaboration with schools, nonprofits, health systems, and workforce development organizations.", descEs: "Construido para la colaboración con escuelas, organizaciones sin fines de lucro, sistemas de salud y organizaciones de desarrollo laboral." },
  ];

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">{t("Research & Impact", "Investigación e Impacto")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("Grounded in evidence. Guided by community.", "Fundamentado en evidencia. Guiado por la comunidad.")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Our work is informed by established research frameworks and emerging evidence on the intersection of trauma-informed care, community wellness, and ethical technology.",
                "Nuestro trabajo está informado por marcos de investigación establecidos y evidencia emergente sobre la intersección del cuidado informado por el trauma, el bienestar comunitario y la tecnología ética."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Early Findings */}
      <section className="py-20 md:py-28">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-10 text-center">{t("Early Findings", "Hallazgos Iniciales")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {findings.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-gold-light flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{t(f.en, f.es)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(f.descEn, f.descEs)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section className="py-16 bg-sage-light">
        <div className="container max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{t("Grounding Frameworks", "Marcos Fundamentales")}</h2>
          <div className="flex flex-col gap-3">
            {frameworks.map((f, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">{t(f.en, f.es)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grant Relevance */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">{t("Partner & Grant Relevance", "Relevancia para Socios y Subvenciones")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("Built for impact measurement, equity alignment, and collaborative funding.", "Construido para la medición del impacto, la alineación con la equidad y el financiamiento colaborativo.")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grantRelevance.map((g, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center mb-4">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{t(g.en, g.es)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(g.descEn, g.descEs)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Research;
