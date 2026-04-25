import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProjects } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, ChevronDown, FolderGit2 } from "lucide-react";

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
  const [open, setOpen] = useState(false);

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
    setOpen(false);
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
    toast.success("Removed.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Projects"
        description="Manage portfolio projects."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
                <DialogDescription>Add a new project to your portfolio.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={150} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={500} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech">Tech</Label>
                  <Input id="tech" placeholder="NestJS · PostgreSQL" value={draft.tech} onChange={(e) => setDraft({ ...draft, tech: e.target.value })} maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Primary link</Label>
                  <Input id="link" placeholder="GitHub or site" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} maxLength={500} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link2">Secondary link</Label>
                  <Input id="link2" placeholder="optional" value={draft.link2} onChange={(e) => setDraft({ ...draft, link2: e.target.value })} maxLength={500} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo">Live demo</Label>
                  <Input id="demo" placeholder="optional" value={draft.demo} onChange={(e) => setDraft({ ...draft, demo: e.target.value })} maxLength={500} />
                </div>
                <ImageUpload label="Cover image" value={draft.image_url} onChange={(url) => setDraft({ ...draft, image_url: url })} folder="projects" />
                <Button onClick={handleAdd} disabled={adding} className="w-full gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : data?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No projects yet. Tap “Add” to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((p) => (
            <ProjectCard key={p.id} project={p as Project} onSave={handleSave} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, onSave, onDelete }: { project: Project; onSave: (p: Project) => Promise<void>; onDelete: (id: string) => void }) => {
  const [local, setLocal] = useState(project);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl bg-card border border-border/50 overflow-hidden">
      <CollapsibleTrigger className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/30 transition-colors">
        {project.image_url ? (
          <img src={project.image_url} alt="" className="w-12 h-12 rounded-md object-cover border border-border/50 shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{project.title || "Untitled"}</p>
          <p className="text-xs text-muted-foreground truncate">{project.tech || "—"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50">
        <div className="space-y-1 pt-3">
          <Label className="text-xs">Title</Label>
          <Input value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} maxLength={150} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Textarea rows={3} value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Tech</Label>
          <Input value={local.tech} onChange={(e) => setLocal({ ...local, tech: e.target.value })} maxLength={200} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Primary link</Label>
          <Input value={local.link} onChange={(e) => setLocal({ ...local, link: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Secondary link</Label>
          <Input value={local.link2 ?? ""} onChange={(e) => setLocal({ ...local, link2: e.target.value })} maxLength={500} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Live demo</Label>
          <Input value={local.demo ?? ""} onChange={(e) => setLocal({ ...local, demo: e.target.value })} maxLength={500} />
        </div>
        <ImageUpload label="Cover image" value={local.image_url} onChange={(url) => setLocal({ ...local, image_url: url })} folder="projects" />
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            onClick={async () => {
              setBusy(true);
              await onSave(local);
              setBusy(false);
            }}
            disabled={busy}
            className="flex-1 gap-2"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </Button>
          <ConfirmDeleteButton
            onConfirm={() => onDelete(project.id)}
            itemLabel={`the project “${project.title || "Untitled"}”`}
            title="Delete project?"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdminProjects;
