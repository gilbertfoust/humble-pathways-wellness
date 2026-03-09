import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Auth: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      
      toast.success(t("Welcome back!", "¡Bienvenido/a de vuelta!"));
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || t("Login failed", "Error al iniciar sesión"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            display_name: form.name,
          },
        },
      });

      if (error) throw error;
      
      toast.success(
        t(
          "Check your email to confirm your account!",
          "¡Revisa tu correo para confirmar tu cuenta!"
        )
      );
      setMode("login");
    } catch (error: any) {
      toast.error(error.message || t("Signup failed", "Error al registrarse"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success(
        t(
          "Check your email for a reset link!",
          "¡Revisa tu correo para el enlace de restablecimiento!"
        )
      );
      setMode("login");
    } catch (error: any) {
      toast.error(error.message || t("Failed to send reset email", "Error al enviar correo de restablecimiento"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === "login") handleLogin(e);
    else if (mode === "signup") handleSignup(e);
    else handleForgotPassword(e);
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
                {mode === "login" && t("Welcome Back", "Bienvenido/a de Vuelta")}
                {mode === "signup" && t("Create Your Space", "Crea Tu Espacio")}
                {mode === "forgot" && t("Reset Password", "Restablecer Contraseña")}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {mode === "login" && t("Sign in to continue your reflection journey.", "Inicia sesión para continuar tu camino de reflexión.")}
                {mode === "signup" && t("Join a community of healing and reflection.", "Únete a una comunidad de sanación y reflexión.")}
                {mode === "forgot" && t("Enter your email to receive a reset link.", "Ingresa tu correo para recibir un enlace de restablecimiento.")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Full Name", "Nombre Completo")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("Email", "Correo")}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              {mode !== "forgot" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("Password", "Contraseña")}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("Forgot password?", "¿Olvidaste tu contraseña?")}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-sage-dark transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">{t("Please wait...", "Por favor espera...")}</span>
                ) : (
                  <>
                    {mode === "login" && t("Sign In", "Iniciar Sesión")}
                    {mode === "signup" && t("Create Account", "Crear Cuenta")}
                    {mode === "forgot" && t("Send Reset Link", "Enviar Enlace")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode === "login" && (
                <button onClick={() => setMode("signup")} className="text-sm text-primary hover:underline">
                  {t("Don't have an account? Sign up", "¿No tienes cuenta? Regístrate")}
                </button>
              )}
              {mode === "signup" && (
                <button onClick={() => setMode("login")} className="text-sm text-primary hover:underline">
                  {t("Already have an account? Sign in", "¿Ya tienes cuenta? Inicia sesión")}
                </button>
              )}
              {mode === "forgot" && (
                <button onClick={() => setMode("login")} className="text-sm text-primary hover:underline">
                  {t("Back to sign in", "Volver a iniciar sesión")}
                </button>
              )}
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
