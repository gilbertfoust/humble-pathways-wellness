import React from "react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
} from "lucide-react";

const adminNavItems = [
  { title: { en: "Overview", es: "Resumen" }, url: "/admin", icon: LayoutDashboard },
  { title: { en: "Prompts", es: "Indicaciones" }, url: "/admin/prompts", icon: MessageSquare },
  { title: { en: "Resources", es: "Recursos" }, url: "/admin/resources", icon: BookOpen },
  { title: { en: "Usage Stats", es: "Estadísticas" }, url: "/admin/stats", icon: BarChart3 },
  { title: { en: "Settings", es: "Configuración" }, url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-heading font-semibold text-sm">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Humble Pathways</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("Management", "Gestión")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{t(item.title.en, item.title.es)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center hover:bg-muted/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {!collapsed && <span>{t("Back to App", "Volver a App")}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center hover:bg-muted/50 text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>{t("Sign Out", "Cerrar Sesión")}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
