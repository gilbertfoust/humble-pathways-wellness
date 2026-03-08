import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { HandHeart, GraduationCap, Building2, Stethoscope, Users } from "lucide-react";
import communityImg from "@/assets/community.jpg";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const partnerTypes = [
  { icon: HandHeart, en: "Community-Based Organizations", es: "Organizaciones Comunitarias", descEn: "Nonprofits, mutual aid groups, and grassroots organizations serving marginalized communities.", descEs: "Organizaciones sin fines de lucro, grupos de ayuda mutua y organizaciones de base que sirven a comunidades marginadas." },
  { icon: GraduationCap, en: "Educational Institutions", es: "Instituciones Educativas", descEn: "Schools, universities, and training programs supporting educators and student wellness.", descEs: "Escuelas, universidades y programas de capacitación que apoyan a educadores y el bienestar estudiantil." },
  { icon: Stethoscope, en: "Health & Human Services", es: "Salud y Servicios Humanos", descEn: "Community health centers, behavioral health organizations, and public health agencies.", descEs: "Centros de salud comunitarios, organizaciones de salud conductual y agencias de salud pública." },
  { icon: Building2, en: "Foundations & Funders", es: "Fundaciones y Financiadores", descEn: "Philanthropic organizations focused on workforce resilience, equity, trauma recovery, and innovation.", descEs: "Organizaciones filantrópicas enfocadas en resiliencia laboral, equidad, recuperación de trauma e innovación." },
  { icon: Users, en: "Workforce Development", es: "Desarrollo Laboral", descEn: "Agencies and programs focused on employee wellness, retention, and professional sustainability.", descEs: "Agencias y programas enfocados en el bienestar de empleados, retención y sostenibilidad profesional." },
];

const Community: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={communityImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="relative container max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-gold font-medium text-sm tracking-wider uppercase mb-4">{t("Community & Partners", "Comunidad y Socios")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {t("Healing happens in community.", "La sanación sucede en comunidad.")}
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              {t(
                "Humble Pathways is built for collaboration. We partner with organizations, institutions, and funders who share our commitment to equity, wellness, and community-centered care.",
                "Humble Pathways está construido para la colaboración. Nos asociamos con organizaciones, instituciones y financiadores que comparten nuestro compromiso con la equidad, el bienestar y el cuidado centrado en la comunidad."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-10 text-center">{t("Who We Partner With", "Con Quién Nos Asociamos")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{t(p.en, p.es)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(p.descEn, p.descEs)}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="mt-12 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-sage-dark transition-colors">
              {t("Become a Partner", "Conviértete en Socio")}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
