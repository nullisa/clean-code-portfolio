import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCareerTimeline } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
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
import { Loader2, Plus, Trash2, Save, ChevronDown, Sparkles } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["career_timeline"] });

  const handleAdd = async () => {
    if (!draft.year.trim() || !draft.role.trim()) return toast.error("Year and role required.");
    setAdding(true);
    const nextOrder = (data?.length ?? 0) + 1;
    const { error } = await supabase.from("career_timeline").insert({ ...draft, sort_order: nextOrder });
    setAdding(false);
    if (error) return toast.error(error.message);
    setDraft(empty);
    setOpen(false);
    refresh();
    toast.success("Entry added.");
  };

  const handleSave = async (entry: Entry): Promise<void> => {
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
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved.");
    refresh();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("career_timeline").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
    toast.success("Removed.");
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (!data) return;
    const target = index + direction;
    if (target < 0 || target >= data.length) return;
    const a = data[index];
    const b = data[target];
    const { error: e1 } = await supabase.from("career_timeline").update({ sort_order: b.sort_order }).eq("id", a.id);
    const { error: e2 } = await supabase.from("career_timeline").update({ sort_order: a.sort_order }).eq("id", b.id);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    refresh();
  };


  return (
    <div className="space-y-5">
      <PageHeader
        title="Career Journey"
        description="Manage timeline entries."
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
                <DialogTitle>New Entry</DialogTitle>
                <DialogDescription>Add a milestone to your career timeline.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="2026" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} maxLength={20} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" placeholder="Backend Developer" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} maxLength={100} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={500} />
                </div>
                <label className="flex items-center justify-between gap-3 p-3 rounded-md bg-secondary/50">
                  <span className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Highlight entry
                  </span>
                  <Switch checked={draft.is_highlight} onCheckedChange={(v) => setDraft({ ...draft, is_highlight: v })} />
                </label>
                <Button onClick={handleAdd} disabled={adding} className="w-full gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Entry
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
          <p className="text-sm text-muted-foreground">No entries yet. Tap “Add” to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((entry, idx) => (
            <CareerEntryCard
              key={entry.id}
              entry={entry as Entry}
              onSave={handleSave}
              onDelete={handleDelete}
              onMoveUp={() => handleMove(idx, -1)}
              onMoveDown={() => handleMove(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === (data!.length - 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CareerEntryCard = ({
  entry, onSave, onDelete, onMoveUp, onMoveDown, isFirst, isLast,
}: {
  entry: Entry;
  onSave: (e: Entry) => Promise<void>;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
        </div>
      )}
    </div>
  );
};

const CareerEntryCard = ({ entry, onSave, onDelete }: { entry: Entry; onSave: (e: Entry) => Promise<void>; onDelete: (id: string) => void }) => {
  const [local, setLocal] = useState(entry);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl bg-card border border-border/50 overflow-hidden">
      <CollapsibleTrigger className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors">
        <div className="flex flex-col items-center justify-center min-w-12 px-2 py-1 rounded-md bg-primary/10 text-primary">
          <span className="font-mono text-sm font-bold leading-tight">{entry.year || "—"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{entry.role || "Untitled role"}</p>
            {entry.is_highlight && <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">{entry.company || "—"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50">
        <div className="grid grid-cols-3 gap-3 pt-3">
          <div className="space-y-1 col-span-1">
            <Label className="text-xs">Year</Label>
            <Input value={local.year} onChange={(e) => setLocal({ ...local, year: e.target.value })} maxLength={20} />
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs">Role</Label>
            <Input value={local.role} onChange={(e) => setLocal({ ...local, role: e.target.value })} maxLength={100} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Company</Label>
          <Input value={local.company} onChange={(e) => setLocal({ ...local, company: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Description</Label>
          <Textarea rows={3} value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} maxLength={500} />
        </div>
        <label className="flex items-center justify-between gap-3 p-3 rounded-md bg-secondary/50">
          <span className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Highlight entry
          </span>
          <Switch checked={local.is_highlight} onCheckedChange={(v) => setLocal({ ...local, is_highlight: v })} />
        </label>
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
            onConfirm={() => onDelete(entry.id)}
            itemLabel={`the “${entry.year || ""} ${entry.role || "entry"}” milestone`}
            title="Delete entry?"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdminCareer;
