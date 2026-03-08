import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberLayout from "@/components/layout/MemberLayout";
import { motion } from "framer-motion";
import { Globe, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const MemberSettings: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  return (
    <MemberLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("Settings", "Ajustes")}</h1>
        <p className="text-muted-foreground mb-8">{t("Manage your preferences and privacy.", "Administra tus preferencias y privacidad.")}</p>
      </motion.div>

      <div className="space-y-6 max-w-2xl">
        {/* Language */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">{t("Language", "Idioma")}</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { if (lang !== "en") toggleLang(); }}
              className={`px-5 py-3 rounded-lg font-medium transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              English
            </button>
            <button onClick={() => { if (lang !== "es") toggleLang(); }}
              className={`px-5 py-3 rounded-lg font-medium transition-colors ${lang === "es" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              Español
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-foreground">{t("Privacy & Data", "Privacidad y Datos")}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{t("Gentle Reminders", "Recordatorios Suaves")}</p>
                <p className="text-xs text-muted-foreground">{t("Receive optional check-in reminders", "Recibe recordatorios opcionales de chequeo")}</p>
              </div>
              <button onClick={() => { setNotifications(!notifications); toast.success(t("Updated", "Actualizado")); }}
                className={`w-12 h-7 rounded-full transition-colors relative ${notifications ? "bg-primary" : "bg-muted"}`}>
                <span className={`block w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                {t(
                  "Your reflections are stored privately and are only visible to you. We use minimal logging and privacy-conscious storage.",
                  "Tus reflexiones se almacenan de forma privada y solo son visibles para ti. Usamos un registro mínimo y almacenamiento consciente de la privacidad."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="p-6 rounded-xl bg-card border border-destructive/20">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-destructive" />
            <h2 className="font-heading text-lg font-semibold text-foreground">{t("Delete Account", "Eliminar Cuenta")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t("This will permanently delete all your data including reflections and saved prompts.", "Esto eliminará permanentemente todos tus datos, incluyendo reflexiones e indicaciones guardadas.")}
          </p>
          <button className="px-5 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">
            {t("Delete My Account", "Eliminar Mi Cuenta")}
          </button>
        </div>
      </div>
    </MemberLayout>
  );
};

export default MemberSettings;
