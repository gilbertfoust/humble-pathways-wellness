import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShieldCheck, TrendingUp, Users, MessageSquare, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(142, 76%, 36%)"];

const AdminStats: React.FC = () => {
  const { t } = useLanguage();
  const [dateRange] = useState(7);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-usage-stats", dateRange],
    queryFn: async () => {
      const startDate = format(subDays(new Date(), dateRange), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("usage_stats")
        .select("*")
        .gte("stat_date", startDate)
        .order("stat_date");
      if (error) throw error;
      return data;
    },
  });

  const totalStats = stats?.reduce(
    (acc, day) => ({
      reflections: acc.reflections + day.total_reflections,
      sessions: acc.sessions + day.total_sessions,
      emotional: acc.emotional + day.category_emotional_checkin,
      burnout: acc.burnout + day.category_burnout_reset,
      grief: acc.grief + day.category_grief_loss,
      gratitude: acc.gratitude + day.category_gratitude_practice,
    }),
    { reflections: 0, sessions: 0, emotional: 0, burnout: 0, grief: 0, gratitude: 0 }
  ) || { reflections: 0, sessions: 0, emotional: 0, burnout: 0, grief: 0, gratitude: 0 };

  const chartData = stats?.map((day) => ({
    date: format(new Date(day.stat_date), "MMM dd"),
    reflections: day.total_reflections,
    sessions: day.total_sessions,
  })) || [];

  const categoryData = [
    { name: t("Emotional Check-In", "Chequeo Emocional"), value: totalStats.emotional },
    { name: t("Burnout Reset", "Reinicio de Agotamiento"), value: totalStats.burnout },
    { name: t("Grief & Loss", "Duelo y Pérdida"), value: totalStats.grief },
    { name: t("Gratitude Practice", "Práctica de Gratitud"), value: totalStats.gratitude },
  ];

  return (
    <AdminLayout title="Usage Statistics" titleEs="Estadísticas de Uso">
      <div className="space-y-6">
        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">
                {t("Privacy-First Analytics", "Analíticas con Privacidad Primero")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  "All statistics shown here are aggregated and anonymized. We never store, display, or analyze individual user data, reflection content, or personal information. These metrics help us understand platform usage patterns to improve the service while maintaining complete user privacy.",
                  "Todas las estadísticas mostradas aquí son agregadas y anónimas. Nunca almacenamos, mostramos ni analizamos datos individuales de usuarios, contenido de reflexiones ni información personal. Estas métricas nos ayudan a entender patrones de uso de la plataforma para mejorar el servicio mientras mantenemos la privacidad completa del usuario."
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("Total Reflections", "Total de Reflexiones")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{totalStats.reflections}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("Last 7 days", "Últimos 7 días")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("Total Sessions", "Total de Sesiones")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold">{totalStats.sessions}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("Last 7 days", "Últimos 7 días")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("Avg. Reflections/Day", "Prom. Reflexiones/Día")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sage-dark" />
                <span className="text-2xl font-bold">
                  {stats?.length ? Math.round(totalStats.reflections / stats.length) : 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("Last 7 days", "Últimos 7 días")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("Days Tracked", "Días Rastreados")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="text-2xl font-bold">{stats?.length || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("With activity", "Con actividad")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">{t("Daily Activity", "Actividad Diaria")}</TabsTrigger>
            <TabsTrigger value="categories">{t("Categories", "Categorías")}</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>{t("Daily Reflections & Sessions", "Reflexiones y Sesiones Diarias")}</CardTitle>
                <CardDescription>
                  {t("Activity over the last 7 days", "Actividad en los últimos 7 días")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t("Loading...", "Cargando...")}
                  </div>
                ) : chartData.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="reflections" name={t("Reflections", "Reflexiones")} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sessions" name={t("Sessions", "Sesiones")} fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t("No data available yet", "Aún no hay datos disponibles")}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>{t("Reflection Categories", "Categorías de Reflexión")}</CardTitle>
                <CardDescription>
                  {t("Distribution by category (last 7 days)", "Distribución por categoría (últimos 7 días)")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t("Loading...", "Cargando...")}
                  </div>
                ) : categoryData.some((d) => d.value > 0) ? (
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t("No category data available yet", "Aún no hay datos de categorías disponibles")}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
