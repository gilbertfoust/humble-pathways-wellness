import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  titleEs: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, titleEs }) => {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {t(title, titleEs)}
              </h1>
            </div>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === "en" ? "ES" : "EN"}
            </button>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
