import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Shield, Mail } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface AdminDomain {
  id: string;
  domain: string;
  created_at: string;
}

const AdminSettings: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [newDomain, setNewDomain] = useState("");

  const { data: domains, isLoading } = useQuery({
    queryKey: ["admin-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_domains")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data as AdminDomain[];
    },
  });

  const addDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      const cleanDomain = domain.replace(/^@/, "").toLowerCase().trim();
      if (!cleanDomain.includes(".")) {
        throw new Error("Invalid domain format");
      }
      const { error } = await supabase.from("admin_domains").insert([{ domain: cleanDomain }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-domains"] });
      toast.success(t("Domain added!", "¡Dominio añadido!"));
      setNewDomain("");
    },
    onError: (err: any) => {
      if (err.message.includes("duplicate")) {
        toast.error(t("Domain already exists", "El dominio ya existe"));
      } else {
        toast.error(err.message);
      }
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      if (domains?.length === 1) {
        throw new Error("Cannot delete the last admin domain");
      }
      const { error } = await supabase.from("admin_domains").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-domains"] });
      toast.success(t("Domain removed!", "¡Dominio eliminado!"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      addDomainMutation.mutate(newDomain);
    }
  };

  return (
    <AdminLayout title="Admin Settings" titleEs="Configuración de Admin">
      <div className="space-y-6 max-w-2xl">
        {/* Admin Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t("Admin Email Domains", "Dominios de Email Admin")}
            </CardTitle>
            <CardDescription>
              {t(
                "Users who sign up with these email domains will automatically receive admin access.",
                "Los usuarios que se registren con estos dominios de email recibirán acceso de administrador automáticamente."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddDomain} className="flex gap-2">
              <div className="flex-1">
                <Label className="sr-only">{t("New Domain", "Nuevo Dominio")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={!newDomain.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Add", "Añadir")}
              </Button>
            </form>

            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                {t("Loading...", "Cargando...")}
              </div>
            ) : (
              <div className="space-y-2">
                {domains?.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">@{domain.domain}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteDomainMutation.mutate(domain.id)}
                      disabled={domains.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {t(
                "Note: Removing a domain does not revoke existing admin access. You would need to manually update user roles in the database.",
                "Nota: Eliminar un dominio no revoca el acceso admin existente. Necesitarás actualizar manualmente los roles de usuario en la base de datos."
              )}
            </p>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("Security Information", "Información de Seguridad")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • {t(
                "Admin access is determined at signup time based on email domain.",
                "El acceso admin se determina al registrarse basándose en el dominio de email."
              )}
            </p>
            <p>
              • {t(
                "Roles are stored in a separate table from profiles for security.",
                "Los roles se almacenan en una tabla separada de los perfiles por seguridad."
              )}
            </p>
            <p>
              • {t(
                "All admin actions are protected by Row Level Security policies.",
                "Todas las acciones de admin están protegidas por políticas de Seguridad a Nivel de Fila."
              )}
            </p>
            <p>
              • {t(
                "Usage statistics are aggregated and contain no personally identifiable information.",
                "Las estadísticas de uso son agregadas y no contienen información de identificación personal."
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
