import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTechStack } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

const AdminTech = () => {
  const { data, isLoading } = useTechStack();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);

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
    refresh();
    toast.success("Added.");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tech_stack").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const handleUpdate = async (id: string, field: "name" | "category", value: string) => {
    const { error } = await supabase.from("tech_stack").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tech Stack</h1>
        <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove technologies.</p>
      </div>

      <div className="rounded-lg bg-card p-6 card-glow space-y-4">
        <p className="text-sm font-medium">Add new</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Tech name (e.g. Go)" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
          <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} maxLength={30} className="sm:w-40" />
          <Button onClick={handleAdd} disabled={adding || !name.trim()} className="gap-2">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {data?.map((tech) => (
          <div key={tech.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center rounded-md bg-card p-3">
            <Input
              defaultValue={tech.name}
              onBlur={(e) => e.target.value !== tech.name && handleUpdate(tech.id, "name", e.target.value)}
              maxLength={50}
            />
            <Input
              defaultValue={tech.category}
              onBlur={(e) => e.target.value !== tech.category && handleUpdate(tech.id, "category", e.target.value)}
              maxLength={30}
              className="sm:w-40"
            />
            <Button variant="ghost" size="icon" onClick={() => handleDelete(tech.id)} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {data?.length === 0 && <p className="text-sm text-muted-foreground">No technologies yet.</p>}
      </div>
    </div>
  );
};

export default AdminTech;
