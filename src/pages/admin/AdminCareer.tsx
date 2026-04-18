import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCareerTimeline } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

type Entry = {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  is_highlight: boolean;
  sort_order: number;
};

const empty = { year: "", role: "", company: "", description: "", is_highlight: false };

const AdminCareer = () => {
  const { data, isLoading } = useCareerTimeline();
  const qc = useQueryClient();
  const [draft, setDraft] = useState(empty);
  const [adding, setAdding] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["career_timeline"] });

  const handleAdd = async () => {
    if (!draft.year.trim() || !draft.role.trim()) return toast.error("Year and role required.");
    setAdding(true);
    const nextOrder = (data?.length ?? 0) + 1;
    const { error } = await supabase.from("career_timeline").insert({ ...draft, sort_order: nextOrder });
    setAdding(false);
    if (error) return toast.error(error.message);
    setDraft(empty);
    refresh();
    toast.success("Entry added.");
  };

  const handleSave = async (entry: Entry) => {
    const { error } = await supabase
      .from("career_timeline")
      .update({
        year: entry.year,
        role: entry.role,
        company: entry.company,
        description: entry.description,
        is_highlight: entry.is_highlight,
      })
      .eq("id", entry.id);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    refresh();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("career_timeline").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Career Journey</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage timeline entries.</p>
      </div>

      <div className="rounded-lg bg-card p-6 card-glow space-y-4">
        <p className="text-sm font-medium">Add new entry</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Year (e.g. 2026)" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} maxLength={20} />
          <Input placeholder="Role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} maxLength={100} />
          <Input placeholder="Company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} maxLength={100} className="sm:col-span-2" />
          <Textarea placeholder="Description" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={500} className="sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <Switch checked={draft.is_highlight} onCheckedChange={(v) => setDraft({ ...draft, is_highlight: v })} />
            Highlight entry
          </label>
        </div>
        <Button onClick={handleAdd} disabled={adding} className="gap-2">
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Entry
        </Button>
      </div>

      <div className="space-y-3">
        {data?.map((entry) => (
          <CareerEntryCard key={entry.id} entry={entry as Entry} onSave={handleSave} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

const CareerEntryCard = ({ entry, onSave, onDelete }: { entry: Entry; onSave: (e: Entry) => Promise<void>; onDelete: (id: string) => void }) => {
  const [local, setLocal] = useState(entry);
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-lg bg-card p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Year</Label>
          <Input value={local.year} onChange={(e) => setLocal({ ...local, year: e.target.value })} maxLength={20} />
        </div>
        <div className="space-y-1">
          <Label>Role</Label>
          <Input value={local.role} onChange={(e) => setLocal({ ...local, role: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Company</Label>
          <Input value={local.company} onChange={(e) => setLocal({ ...local, company: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Description</Label>
          <Textarea rows={3} value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} maxLength={500} />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <Switch checked={local.is_highlight} onCheckedChange={(v) => setLocal({ ...local, is_highlight: v })} />
          Highlight entry
        </label>
      </div>
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
        <Button size="sm" variant="ghost" onClick={() => onDelete(entry.id)} className="text-destructive gap-2">
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminCareer;
