import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const AdminAbout = () => {
  const { data, isLoading } = useProfile();
  const qc = useQueryClient();
  const [form, setForm] = useState({ id: "", name: "", role: "", tagline: "", bio: "", avatar_url: "" as string | null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        name: data.name ?? "",
        role: data.role ?? "",
        tagline: data.tagline ?? "",
        bio: data.bio ?? "",
        avatar_url: data.avatar_url,
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update({
        name: form.name,
        role: form.role,
        tagline: form.tagline,
        bio: form.bio,
        avatar_url: form.avatar_url,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile saved.");
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit your hero section content and avatar.</p>
      </div>

      <div className="space-y-5 rounded-lg bg-card p-6 card-glow">
        <ImageUpload label="Avatar" value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} folder="avatars" />
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminAbout;
