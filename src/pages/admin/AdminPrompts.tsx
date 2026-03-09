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
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

type PromptCategory = "emotional_checkin" | "burnout_reset" | "grief_loss" | "gratitude_practice";

interface Prompt {
  id: string;
  title_en: string;
  title_es: string;
  content_en: string;
  content_es: string;
  category: PromptCategory;
  is_active: boolean;
  sort_order: number;
}

const categoryLabels: Record<PromptCategory, { en: string; es: string }> = {
  emotional_checkin: { en: "Emotional Check-In", es: "Chequeo Emocional" },
  burnout_reset: { en: "Burnout Reset", es: "Reinicio de Agotamiento" },
  grief_loss: { en: "Grief & Loss", es: "Duelo y Pérdida" },
  gratitude_practice: { en: "Gratitude Practice", es: "Práctica de Gratitud" },
};

const AdminPrompts: React.FC = () => {
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    title_en: "",
    title_es: "",
    content_en: "",
    content_es: "",
    category: "emotional_checkin" as PromptCategory,
    is_active: true,
  });

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data as Prompt[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Prompt, "id" | "sort_order">) => {
      const { error } = await supabase.from("prompts").insert([
        { ...data, sort_order: (prompts?.length || 0) + 1 },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      toast.success(t("Prompt created!", "¡Indicación creada!"));
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Prompt> & { id: string }) => {
      const { error } = await supabase.from("prompts").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      toast.success(t("Prompt updated!", "¡Indicación actualizada!"));
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
      toast.success(t("Prompt deleted!", "¡Indicación eliminada!"));
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_es: "",
      content_en: "",
      content_es: "",
      category: "emotional_checkin",
      is_active: true,
    });
    setEditingPrompt(null);
    setDialogOpen(false);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title_en: prompt.title_en,
      title_es: prompt.title_es,
      content_en: prompt.content_en,
      content_es: prompt.content_es,
      category: prompt.category,
      is_active: prompt.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrompt) {
      updateMutation.mutate({ id: editingPrompt.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const groupedPrompts = prompts?.reduce((acc, prompt) => {
    if (!acc[prompt.category]) acc[prompt.category] = [];
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<PromptCategory, Prompt[]>);

  return (
    <AdminLayout title="Manage Prompts" titleEs="Gestionar Indicaciones">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {t(
              "Create and manage reflection prompts for each category.",
              "Crea y gestiona indicaciones de reflexión para cada categoría."
            )}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Add Prompt", "Añadir Indicación")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPrompt
                    ? t("Edit Prompt", "Editar Indicación")
                    : t("New Prompt", "Nueva Indicación")}
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
                  <Label>{t("Content (English)", "Contenido (Inglés)")}</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label>{t("Content (Spanish)", "Contenido (Español)")}</Label>
                  <Textarea
                    value={formData.content_es}
                    onChange={(e) => setFormData({ ...formData, content_es: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Category", "Categoría")}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v as PromptCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {t(label.en, label.es)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                    />
                    <Label>{t("Active", "Activo")}</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t("Cancel", "Cancelar")}
                  </Button>
                  <Button type="submit">
                    {editingPrompt ? t("Update", "Actualizar") : t("Create", "Crear")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("Loading prompts...", "Cargando indicaciones...")}
          </div>
        ) : (
          Object.entries(categoryLabels).map(([category, label]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{t(label.en, label.es)}</CardTitle>
              </CardHeader>
              <CardContent>
                {groupedPrompts?.[category as PromptCategory]?.length ? (
                  <div className="space-y-2">
                    {groupedPrompts[category as PromptCategory].map((prompt) => (
                      <div
                        key={prompt.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          prompt.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <div>
                            <p className="font-medium">
                              {lang === "en" ? prompt.title_en : prompt.title_es}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {lang === "en" ? prompt.content_en : prompt.content_es}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!prompt.is_active && (
                            <span className="text-xs px-2 py-1 bg-muted rounded">
                              {t("Inactive", "Inactivo")}
                            </span>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(prompt)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(prompt.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    {t("No prompts in this category yet.", "Aún no hay indicaciones en esta categoría.")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPrompts;
