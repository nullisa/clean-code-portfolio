import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProjects } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  link: string;
  link2: string | null;
  demo: string | null;
  image_url: string | null;
  sort_order: number;
};

const empty = { title: "", description: "", tech: "", link: "", link2: "", demo: "", image_url: null as string | null };

const AdminProjects = () => {
  const { data, isLoading } = useProjects();
  const qc = useQueryClient();
  const [draft, setDraft] = useState(empty);
  const [adding, setAdding] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["projects"] });

  const handleAdd = async () => {
    if (!draft.title.trim()) return toast.error("Title required.");
    setAdding(true);
    const nextOrder = (data?.length ?? 0) + 1;
    const { error } = await supabase.from("projects").insert({
      ...draft,
      link2: draft.link2 || null,
      demo: draft.demo || null,
      sort_order: nextOrder,
    });
    setAdding(false);
    if (error) return toast.error(error.message);
    setDraft(empty);
    refresh();
    toast.success("Project added.");
  };

  const handleSave = async (p: Project): Promise<void> => {
    const { error } = await supabase
      .from("projects")
      .update({
        title: p.title,
        description: p.description,
        tech: p.tech,
        link: p.link,
        link2: p.link2 || null,
        demo: p.demo || null,
        image_url: p.image_url,
      })
      .eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
    toast.success("Saved.");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage portfolio projects.</p>
      </div>

      <div className="rounded-lg bg-card p-6 card-glow space-y-3">
        <p className="text-sm font-medium">Add new project</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={150} className="sm:col-span-2" />
          <Textarea placeholder="Description" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={500} className="sm:col-span-2" />
          <Input placeholder="Tech (e.g. NestJS · PostgreSQL)" value={draft.tech} onChange={(e) => setDraft({ ...draft, tech: e.target.value })} maxLength={200} className="sm:col-span-2" />
          <Input placeholder="Primary link (GitHub or site)" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} maxLength={500} />
          <Input placeholder="Secondary link (optional, e.g. frontend repo)" value={draft.link2} onChange={(e) => setDraft({ ...draft, link2: e.target.value })} maxLength={500} />
          <Input placeholder="Live demo URL (optional)" value={draft.demo} onChange={(e) => setDraft({ ...draft, demo: e.target.value })} maxLength={500} className="sm:col-span-2" />
        </div>
        <ImageUpload label="Cover image (optional)" value={draft.image_url} onChange={(url) => setDraft({ ...draft, image_url: url })} folder="projects" />
        <Button onClick={handleAdd} disabled={adding} className="gap-2">
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {data?.map((p) => (
          <ProjectCard key={p.id} project={p as Project} onSave={handleSave} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onSave, onDelete }: { project: Project; onSave: (p: Project) => Promise<void>; onDelete: (id: string) => void }) => {
  const [local, setLocal] = useState(project);
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-lg bg-card p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1 sm:col-span-2">
          <Label>Title</Label>
          <Input value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} maxLength={150} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Description</Label>
          <Textarea rows={3} value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Tech</Label>
          <Input value={local.tech} onChange={(e) => setLocal({ ...local, tech: e.target.value })} maxLength={200} />
        </div>
        <div className="space-y-1">
          <Label>Primary link</Label>
          <Input value={local.link} onChange={(e) => setLocal({ ...local, link: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1">
          <Label>Secondary link</Label>
          <Input value={local.link2 ?? ""} onChange={(e) => setLocal({ ...local, link2: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Live demo</Label>
          <Input value={local.demo ?? ""} onChange={(e) => setLocal({ ...local, demo: e.target.value })} maxLength={500} />
        </div>
      </div>
      <ImageUpload label="Cover image" value={local.image_url} onChange={(url) => setLocal({ ...local, image_url: url })} folder="projects" />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={async () => {
            setBusy(true);
            await onSave(local);
            setBusy(false);
          }}
          disabled={busy}
          className="gap-2"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(project.id)} className="text-destructive gap-2">
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminProjects;
