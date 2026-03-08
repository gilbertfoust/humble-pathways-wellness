import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading text-lg font-bold">H</span>
              </div>
              <span className="font-heading text-xl font-semibold">Humble Pathways</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">
              {t(
                "A healing-centered wellness initiative for frontline workers and marginalized communities. Nested under Humanity Pathways Global (HPG).",
                "Una iniciativa de bienestar centrada en la sanación para trabajadores de primera línea y comunidades marginadas. Bajo Humanity Pathways Global (HPG)."
              )}
            </p>
            <a
              href="https://humanitypathwaysglobal.com/humble-pathways"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-gold hover:text-gold-light transition-colors"
            >
              {t("Visit us on HPG →", "Visítanos en HPG →")}
            </a>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t("Navigate", "Navegar")}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/about" className="hover:opacity-100 transition-opacity">{t("About", "Acerca de")}</Link>
              <Link to="/founder" className="hover:opacity-100 transition-opacity">{t("Founder", "Fundadora")}</Link>
              <Link to="/how-it-works" className="hover:opacity-100 transition-opacity">{t("How It Works", "Cómo Funciona")}</Link>
              <Link to="/research" className="hover:opacity-100 transition-opacity">{t("Research", "Investigación")}</Link>
              <Link to="/contact" className="hover:opacity-100 transition-opacity">{t("Contact", "Contacto")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">{t("Important Notice", "Aviso Importante")}</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              {t(
                "Humble Pathways offers supportive reflection and wellness tools only. It is not therapy, clinical treatment, crisis counseling, diagnosis, or emergency response.",
                "Humble Pathways ofrece herramientas de reflexión y bienestar de apoyo únicamente. No es terapia, tratamiento clínico, consejería de crisis, diagnóstico ni respuesta de emergencia."
              )}
            </p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-50">
          <p>© {new Date().getFullYear()} Humble Pathways · Humanity Pathways Global</p>
          <p className="flex items-center gap-1">
            {t("Built with", "Hecho con")} <Heart className="w-3 h-3 text-accent" /> {t("for community", "para la comunidad")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
