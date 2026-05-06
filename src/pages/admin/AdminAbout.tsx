import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import CvUpload from "@/components/admin/CvUpload";
import PageHeader from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const AdminAbout = () => {
  const { data, isLoading } = useProfile();
  const qc = useQueryClient();
  const [form, setForm] = useState({ id: "", name: "", role: "", tagline: "", bio: "", avatar_url: "" as string | null, cv_url: "" as string | null });
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
        cv_url: (data as any).cv_url ?? null,
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
        cv_url: form.cv_url,
      } as any)
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile saved.");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="About" description="Edit your hero section content and avatar." />

      <div className="space-y-5 rounded-xl bg-card p-4 sm:p-6 border border-border/50">
        <ImageUpload label="Avatar" value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} folder="avatars" />
        <CvUpload value={form.cv_url} onChange={(url) => setForm({ ...form, cv_url: url })} />
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
          <p className="text-xs text-muted-foreground text-right">{form.bio.length}/500</p>
        </div>
      </div>

      {/* Sticky save bar on mobile */}
      <div className="sticky bottom-16 md:static md:bottom-auto z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 bg-background/95 backdrop-blur sm:bg-transparent sm:backdrop-blur-none border-t border-border sm:border-0">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminAbout;
