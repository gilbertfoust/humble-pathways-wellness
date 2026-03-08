import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion } from "framer-motion";
import { Leaf, Moon, Shield, Heart, Building, Stethoscope, ExternalLink } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const categories = [
  { icon: Leaf, en: "Grounding", es: "Arraigo", color: "bg-sage-light text-primary" },
  { icon: Moon, en: "Rest", es: "Descanso", color: "bg-gold-light text-accent" },
  { icon: Shield, en: "Boundaries", es: "Límites", color: "bg-earth-light text-earth" },
  { icon: Heart, en: "Faith & Community", es: "Fe y Comunidad", color: "bg-gold-light text-accent" },
  { icon: Building, en: "Local Support", es: "Apoyo Local", color: "bg-sage-light text-primary" },
  { icon: Stethoscope, en: "Professional Help", es: "Ayuda Profesional", color: "bg-earth-light text-earth" },
];

const resources = [
  { cat: 0, en: "5-4-3-2-1 Grounding Technique", es: "Técnica de Arraigo 5-4-3-2-1", descEn: "A simple sensory exercise to bring you back to the present moment when stress feels overwhelming.", descEs: "Un ejercicio sensorial simple para traerte de vuelta al momento presente cuando el estrés se siente abrumador.", link: "#" },
  { cat: 0, en: "Box Breathing Guide", es: "Guía de Respiración Cuadrada", descEn: "A four-step breathing technique used by first responders and military to calm the nervous system.", descEs: "Una técnica de respiración de cuatro pasos usada por respondedores de emergencia y militares para calmar el sistema nervioso.", link: "#" },
  { cat: 1, en: "Sleep Hygiene Checklist", es: "Lista de Higiene del Sueño", descEn: "Evidence-based tips for improving sleep quality, especially for shift workers and caregivers.", descEs: "Consejos basados en evidencia para mejorar la calidad del sueño, especialmente para trabajadores por turnos y cuidadores.", link: "#" },
  { cat: 1, en: "Micro-Rest Practices", es: "Prácticas de Micro-Descanso", descEn: "Small, intentional moments of rest you can fit into even the busiest days.", descEs: "Pequeños momentos intencionales de descanso que puedes encajar incluso en los días más ocupados.", link: "#" },
  { cat: 2, en: "Setting Boundaries at Work", es: "Estableciendo Límites en el Trabajo", descEn: "Practical scripts and strategies for communicating limits without guilt.", descEs: "Guiones y estrategias prácticas para comunicar límites sin culpa.", link: "#" },
  { cat: 3, en: "Chicago Faith-Based Support Networks", es: "Redes de Apoyo Basadas en la Fe de Chicago", descEn: "Community organizations offering spiritual support and fellowship in the Chicago area.", descEs: "Organizaciones comunitarias que ofrecen apoyo espiritual y compañerismo en el área de Chicago.", link: "#" },
  { cat: 4, en: "Chicago Community Health Resources", es: "Recursos de Salud Comunitaria de Chicago", descEn: "Free and low-cost health services available across Chicago neighborhoods.", descEs: "Servicios de salud gratuitos y de bajo costo disponibles en los vecindarios de Chicago.", link: "#" },
  { cat: 5, en: "Find a Culturally Responsive Therapist", es: "Encuentra un Terapeuta Culturalmente Responsivo", descEn: "Directories and resources for finding therapists who understand your cultural background.", descEs: "Directorios y recursos para encontrar terapeutas que entiendan tu trasfondo cultural.", link: "#" },
  { cat: 5, en: "988 Suicide & Crisis Lifeline", es: "988 Línea de Prevención del Suicidio y Crisis", descEn: "Free, confidential support 24/7. Call or text 988.", descEs: "Apoyo gratuito y confidencial 24/7. Llama o envía mensaje al 988.", link: "tel:988" },
];

const ResourceHub: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const filtered = selectedCat !== null ? resources.filter((r) => r.cat === selectedCat) : resources;

  return (
    <MemberLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Resource Hub", "Centro de Recursos")}</h1>
        <p className="text-muted-foreground mb-8">{t("Curated resources for grounding, rest, boundaries, and support.", "Recursos curados para arraigo, descanso, límites y apoyo.")}</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setSelectedCat(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCat === null ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
          {t("All", "Todos")}
        </button>
        {categories.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCat(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedCat === i ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            <cat.icon className="w-4 h-4" /> {t(cat.en, cat.es)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((resource, i) => {
          const cat = categories[resource.cat];
          return (
            <motion.a key={i} href={resource.link} target={resource.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all block">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{t(resource.en, resource.es)}</h3>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t(resource.descEn, resource.descEs)}</p>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </MemberLayout>
  );
};

export default ResourceHub;
