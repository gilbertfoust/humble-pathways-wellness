import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Globe, LogOut, User } from "lucide-react";

const navItems = [
  { path: "/", en: "Home", es: "Inicio" },
  { path: "/about", en: "About", es: "Acerca de" },
  { path: "/founder", en: "Founder", es: "Fundadora" },
  { path: "/how-it-works", en: "How It Works", es: "Cómo Funciona" },
  { path: "/research", en: "Research", es: "Investigación" },
  { path: "/hipaa", en: "HIPAA & Privacy", es: "HIPAA y Privacidad" },
  { path: "/community", en: "Community", es: "Comunidad" },
  { path: "/contact", en: "Contact", es: "Contacto" },
];

const Header: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-lg font-bold">H</span>
          </div>
          <span className="font-heading text-xl md:text-2xl font-semibold text-foreground">
            Humble Pathways
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-sage-light"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {t(item.en, item.es)}
            </Link>
          ))}
          <button
            onClick={toggleLang}
            className="ml-2 flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "ES" : "EN"}
          </button>
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-sage-light text-primary text-sm font-semibold hover:bg-sage transition-colors"
              >
                <User className="w-4 h-4" />
                {t("Dashboard", "Panel")}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-sage-dark transition-colors"
            >
              {t("Sign In", "Iniciar Sesión")}
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleLang} className="p-2 text-muted-foreground" aria-label="Toggle language">
            <Globe className="w-5 h-5" />
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden border-t border-border bg-background pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-base font-medium ${
                location.pathname === item.path ? "text-primary bg-sage-light" : "text-foreground"
              }`}
            >
              {t(item.en, item.es)}
            </Link>
          ))}
          <div className="px-6 pt-2 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block text-center px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
                >
                  {t("Dashboard", "Panel")}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-center px-5 py-3 rounded-lg border border-border text-foreground font-semibold"
                >
                  {t("Sign Out", "Cerrar Sesión")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="block text-center px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
              >
                {t("Sign In", "Iniciar Sesión")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
