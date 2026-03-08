import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LayoutDashboard, MessageCircle, BookOpen, FolderHeart, Archive, Settings, LogOut, Globe } from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, en: "Dashboard", es: "Panel" },
  { path: "/reflection", icon: MessageCircle, en: "Reflect", es: "Reflexionar" },
  { path: "/prompts", icon: BookOpen, en: "Prompts", es: "Indicaciones" },
  { path: "/resources", icon: FolderHeart, en: "Resources", es: "Recursos" },
  { path: "/saved", icon: Archive, en: "Saved", es: "Guardado" },
  { path: "/settings", icon: Settings, en: "Settings", es: "Ajustes" },
];

const MemberLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-lg font-bold">H</span>
          </div>
          <span className="font-heading text-lg font-semibold text-foreground">Humble Pathways</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path ? "bg-sage-light text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
              <item.icon className="w-5 h-5" />
              {t(item.en, item.es)}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 pt-4 border-t border-border">
          <button onClick={toggleLang} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-colors">
            <Globe className="w-5 h-5" /> {lang === "en" ? "Español" : "English"}
          </button>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" /> {t("Sign Out", "Cerrar Sesión")}
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-50">
        <nav className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}>
              <item.icon className="w-5 h-5" />
              <span>{t(item.en, item.es)}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default MemberLayout;
