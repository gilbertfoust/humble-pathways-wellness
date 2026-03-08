import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Auth: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to backend later
    window.location.href = "/dashboard";
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container max-w-md">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}
            className="p-8 md:p-10 rounded-2xl bg-card border border-border">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-heading text-2xl font-bold">H</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {mode === "login" ? t("Welcome Back", "Bienvenido/a de Vuelta") : t("Create Your Space", "Crea Tu Espacio")}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {mode === "login"
                  ? t("Sign in to continue your reflection journey.", "Inicia sesión para continuar tu camino de reflexión.")
                  : t("Join a community of healing and reflection.", "Únete a una comunidad de sanación y reflexión.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Full Name", "Nombre Completo")}</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("Email", "Correo")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("Password", "Contraseña")}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-sage-dark transition-colors">
                {mode === "login" ? t("Sign In", "Iniciar Sesión") : t("Create Account", "Crear Cuenta")} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-primary hover:underline">
                {mode === "login"
                  ? t("Don't have an account? Sign up", "¿No tienes cuenta? Regístrate")
                  : t("Already have an account? Sign in", "¿Ya tienes cuenta? Inicia sesión")}
              </button>
            </div>

            <div className="mt-6 p-4 bg-sage-light rounded-lg">
              <p className="text-xs text-primary text-center leading-relaxed">
                {t(
                  "⚠ Humble Pathways offers supportive reflection and wellness tools only. It is not therapy, diagnosis, or emergency care.",
                  "⚠ Humble Pathways ofrece herramientas de reflexión y bienestar de apoyo únicamente. No es terapia, diagnóstico ni atención de emergencia."
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
