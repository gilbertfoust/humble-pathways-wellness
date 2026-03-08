import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import founderPhoto from "@/assets/founder-photo.jpg";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Founder: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-cream">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <img src={founderPhoto} alt="Lizette Roman" className="rounded-2xl w-full max-w-md mx-auto shadow-lg" />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">{t("Founder", "Fundadora")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Lizette Roman</h1>
            <p className="text-accent font-medium mb-6">{t("Licensed Professional Counselor & Community Healer", "Consejera Profesional Licenciada y Sanadora Comunitaria")}</p>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t(
                "Lizette Roman is a Chicago-based licensed professional counselor whose work lives at the intersection of clinical practice, community healing, and social justice. With over a decade of experience serving frontline workers and under-resourced communities, she has witnessed firsthand the emotional toll that caregiving, systemic inequity, and generational trauma take on the people who hold our neighborhoods together.",
                "Lizette Roman es una consejera profesional licenciada con sede en Chicago cuyo trabajo vive en la intersección de la práctica clínica, la sanación comunitaria y la justicia social. Con más de una década de experiencia sirviendo a trabajadores de primera línea y comunidades con pocos recursos, ha sido testigo de primera mano del costo emocional que el cuidado, la inequidad sistémica y el trauma generacional tienen en las personas que mantienen unidos nuestros vecindarios."
              )}</p>
              <p>{t(
                "Humble Pathways was born from Lizette's conviction that healing should never be a luxury — and that the tools we build for wellness should reflect the cultures, languages, and lived realities of the people they're meant to serve.",
                "Humble Pathways nació de la convicción de Lizette de que la sanación nunca debería ser un lujo — y que las herramientas que construimos para el bienestar deben reflejar las culturas, los idiomas y las realidades vividas de las personas a las que están destinadas a servir."
              )}</p>
              <p>{t(
                "Her approach is grounded in Healing-Centered Engagement, Liberation Psychology, and trauma-informed frameworks — brought together with cultural humility and a deep respect for community wisdom.",
                "Su enfoque está fundamentado en el Compromiso Centrado en la Sanación, la Psicología de la Liberación y marcos informados por el trauma — reunidos con humildad cultural y un profundo respeto por la sabiduría comunitaria."
              )}</p>
            </div>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-sage-dark transition-colors">
              <Mail className="w-4 h-4" /> {t("Get in Touch", "Ponte en Contacto")}
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Founder;
