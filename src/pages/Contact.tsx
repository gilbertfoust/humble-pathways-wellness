import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(t("Message sent! We'll be in touch.", "¡Mensaje enviado! Nos pondremos en contacto."));
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-cream">
        <div className="container max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <p className="text-primary font-medium text-sm tracking-wider uppercase mb-4">{t("Contact", "Contacto")}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("Let's connect.", "Conectemos.")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Whether you're a potential partner, funder, community organization, or someone who wants to learn more — we'd love to hear from you.",
                "Ya seas un socio potencial, financiador, organización comunitaria, o alguien que quiere saber más — nos encantaría saber de ti."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("Location", "Ubicación")}</h3>
                  <p className="text-sm text-muted-foreground">Chicago, Illinois</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sage-light flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("Email", "Correo")}</h3>
                  <p className="text-sm text-muted-foreground">hello@humblepathways.org</p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-sage-light rounded-xl">
                <p className="text-sm text-primary leading-relaxed">
                  {t(
                    "Humble Pathways operates under Humanity Pathways Global (HPG). For partnership or grant inquiries, please use the form or email us directly.",
                    "Humble Pathways opera bajo Humanity Pathways Global (HPG). Para consultas de asociación o subvenciones, utiliza el formulario o envíanos un correo directamente."
                  )}
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <motion.form onSubmit={handleSubmit} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
                className="p-8 rounded-2xl bg-card border border-border space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("Name", "Nombre")}</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("Email", "Correo")}</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Subject", "Asunto")}</label>
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Message", "Mensaje")}</label>
                  <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <button type="submit" disabled={sending}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4" /> {sending ? t("Sending...", "Enviando...") : t("Send Message", "Enviar Mensaje")}
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
