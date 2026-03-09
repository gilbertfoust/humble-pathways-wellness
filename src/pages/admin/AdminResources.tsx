import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, ExternalLink, FileText, Video, Headphones, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  url: string | null;
  resource_type: string;
  is_active: boolean;
  sort_order: number;
}

const resourceTypes = [
  { value: "article", label: { en: "Article", es: "Artículo" }, icon: FileText },
  { value: "video", label: { en: "Video", es: "Video" }, icon: Video },
  { value: "podcast", label: { en: "Podcast", es: "Podcast" }, icon: Headphones },
  { value: "link", label: { en: "External Link", es: "Enlace Externo" }, icon: LinkIcon },
];

const AdminResources: React.FC = () => {
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    title_es: "",
    description_en: "",
    description_es: "",
    url: "",
    resource_type: "article",
    is_active: true,
  });

  const { data: resources, isLoading } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Resource[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Resource, "id" | "sort_order">) => {
      const { error } = await supabase.from("resources").insert([
        { ...data, sort_order: (resources?.length || 0) + 1 },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast.success(t("Resource created!", "¡Recurso creado!"));
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Resource> & { id: string }) => {
      const { error } = await supabase.from("resources").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast.success(t("Resource updated!", "¡Recurso actualizado!"));
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast.success(t("Resource deleted!", "¡Recurso eliminado!"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_es: "",
      description_en: "",
      description_es: "",
      url: "",
      resource_type: "article",
      is_active: true,
    });
    setEditingResource(null);
    setDialogOpen(false);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title_en: resource.title_en,
      title_es: resource.title_es,
      description_en: resource.description_en,
      description_es: resource.description_es,
      url: resource.url || "",
      resource_type: resource.resource_type,
      is_active: resource.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      url: formData.url || null,
    };
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, ...submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const getTypeIcon = (type: string) => {
    const found = resourceTypes.find((t) => t.value === type);
    return found ? found.icon : FileText;
  };

  return (
    <AdminLayout title="Manage Resources" titleEs="Gestionar Recursos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {t(
              "Curate wellness resources for your community.",
              "Cura recursos de bienestar para tu comunidad."
            )}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Add Resource", "Añadir Recurso")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingResource
                    ? t("Edit Resource", "Editar Recurso")
                    : t("New Resource", "Nuevo Recurso")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Title (English)", "Título (Inglés)")}</Label>
                    <Input
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>{t("Title (Spanish)", "Título (Español)")}</Label>
                    <Input
                      value={formData.title_es}
                      onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>{t("Description (English)", "Descripción (Inglés)")}</Label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label>{t("Description (Spanish)", "Descripción (Español)")}</Label>
                  <Textarea
                    value={formData.description_es}
                    onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Resource Type", "Tipo de Recurso")}</Label>
                    <Select
                      value={formData.resource_type}
                      onValueChange={(v) => setFormData({ ...formData, resource_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {t(type.label.en, type.label.es)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("URL (optional)", "URL (opcional)")}</Label>
                    <Input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                  <Label>{t("Active", "Activo")}</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t("Cancel", "Cancelar")}
                  </Button>
                  <Button type="submit">
                    {editingResource ? t("Update", "Actualizar") : t("Create", "Crear")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("All Resources", "Todos los Recursos")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("Loading resources...", "Cargando recursos...")}
              </div>
            ) : resources?.length ? (
              <div className="space-y-2">
                {resources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.resource_type);
                  return (
                    <div
                      key={resource.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        resource.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {lang === "en" ? resource.title_en : resource.title_es}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {lang === "en" ? resource.description_en : resource.description_es}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!resource.is_active && (
                          <span className="text-xs px-2 py-1 bg-muted rounded">
                            {t("Inactive", "Inactivo")}
                          </span>
                        )}
                        {resource.url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(resource.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">
                {t("No resources yet. Add your first resource above.", "Aún no hay recursos. Añade tu primer recurso arriba.")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminResources;
