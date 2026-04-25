import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTechStack } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/admin/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

const AdminTech = () => {
  const { data, isLoading } = useTechStack();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["tech_stack"] });

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    const nextOrder = (data?.length ?? 0) + 1;
    const { error } = await supabase
      .from("tech_stack")
      .insert({ name: name.trim(), category: category.trim() || "general", sort_order: nextOrder });
    setAdding(false);
    if (error) return toast.error(error.message);
    setName("");
    setCategory("");
    setOpen(false);
    refresh();
    toast.success("Added.");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tech_stack").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
    toast.success("Removed.");
  };

  const handleUpdate = async (id: string, field: "name" | "category", value: string) => {
    const payload = field === "name" ? { name: value } : { category: value };
    const { error } = await supabase.from("tech_stack").update(payload).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  };

  // Group by category for cleaner display
  const grouped = (data ?? []).reduce<Record<string, typeof data>>((acc, t) => {
    const cat = t.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tech Stack"
        description="Add, edit, or remove technologies."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 shrink-0">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Technology</DialogTitle>
                <DialogDescription>Enter a tech name and an optional category.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="tech-name">Name</Label>
                  <Input id="tech-name" placeholder="e.g. Go" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-cat">Category</Label>
                  <Input id="tech-cat" placeholder="e.g. backend" value={category} onChange={(e) => setCategory(e.target.value)} maxLength={30} />
                </div>
                <Button onClick={handleAdd} disabled={adding || !name.trim()} className="w-full gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
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
          <p className="text-sm text-muted-foreground">No technologies yet. Tap “Add” to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground px-1">{cat}</p>
              <div className="rounded-xl bg-card border border-border/50 divide-y divide-border/50 overflow-hidden">
                {items!.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-2 p-3">
                    <Input
                      defaultValue={tech.name}
                      onBlur={(e) => e.target.value !== tech.name && handleUpdate(tech.id, "name", e.target.value)}
                      maxLength={50}
                      className="flex-1 h-9 border-0 bg-transparent focus-visible:bg-secondary/40 px-2"
                    />
                    <Input
                      defaultValue={tech.category}
                      onBlur={(e) => e.target.value !== tech.category && handleUpdate(tech.id, "category", e.target.value)}
                      maxLength={30}
                      className="w-24 sm:w-32 h-9 border-0 bg-transparent focus-visible:bg-secondary/40 px-2 text-xs text-muted-foreground"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tech.id)} className="text-destructive shrink-0 h-9 w-9">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTech;
