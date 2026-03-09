import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  const { data: promptsCount } = useQuery({
    queryKey: ["admin-prompts-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("prompts")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: resourcesCount } = useQuery({
    queryKey: ["admin-resources-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: todayStats } = useQuery({
    queryKey: ["admin-today-stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("usage_stats")
        .select("*")
        .eq("stat_date", new Date().toISOString().split("T")[0])
        .single();
      return data;
    },
  });

  const statsCards = [
    {
      title: { en: "Total Prompts", es: "Total de Indicaciones" },
      value: promptsCount ?? 0,
      icon: MessageSquare,
      link: "/admin/prompts",
      color: "bg-primary/10 text-primary",
    },
    {
      title: { en: "Total Resources", es: "Total de Recursos" },
      value: resourcesCount ?? 0,
      icon: BookOpen,
      link: "/admin/resources",
      color: "bg-accent/10 text-accent",
    },
    {
      title: { en: "Today's Reflections", es: "Reflexiones de Hoy" },
      value: todayStats?.total_reflections ?? 0,
      icon: TrendingUp,
      link: "/admin/stats",
      color: "bg-sage text-sage-dark",
    },
    {
      title: { en: "Today's Sessions", es: "Sesiones de Hoy" },
      value: todayStats?.total_sessions ?? 0,
      icon: Users,
      link: "/admin/stats",
      color: "bg-gold-light text-gold",
    },
  ];

  return (
    <AdminLayout title="Admin Overview" titleEs="Resumen de Admin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => (
            <Link key={i} to={stat.link}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(stat.title.en, stat.title.es)}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Quick Actions", "Acciones Rápidas")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/prompts"
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">{t("Manage Prompts", "Gestionar Indicaciones")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Add, edit, or remove reflection prompts", "Añadir, editar o eliminar indicaciones")}
              </p>
            </Link>
            <Link
              to="/admin/resources"
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-accent mb-2" />
              <h3 className="font-medium">{t("Manage Resources", "Gestionar Recursos")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Curate wellness resources for members", "Curar recursos de bienestar para miembros")}
              </p>
            </Link>
            <Link
              to="/admin/stats"
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-sage-dark mb-2" />
              <h3 className="font-medium">{t("View Analytics", "Ver Analíticas")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Privacy-conscious usage summaries", "Resúmenes de uso conscientes de privacidad")}
              </p>
            </Link>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">{t("Privacy Note:", "Nota de Privacidad:")}</strong>{" "}
              {t(
                "Usage statistics are aggregated and anonymized. No individual user data or reflection content is stored or displayed here.",
                "Las estadísticas de uso son agregadas y anónimas. No se almacenan ni muestran datos individuales de usuarios ni contenido de reflexiones aquí."
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
