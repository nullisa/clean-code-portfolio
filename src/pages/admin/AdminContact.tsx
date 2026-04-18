import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useContactInfo } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const AdminContact = () => {
  const { data, isLoading } = useContactInfo();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    id: "",
    email: "",
    location: "",
    github_url: "" as string | null,
    linkedin_url: "" as string | null,
    twitter_url: "" as string | null,
    website_url: "" as string | null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...form, ...data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("contact_info")
      .update({
        email: form.email,
        location: form.location,
        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
        twitter_url: form.twitter_url || null,
        website_url: form.website_url || null,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["contact_info"] });
    toast.success("Contact info saved.");
  };

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="text-sm text-muted-foreground mt-1">Email, location, and social links.</p>
      </div>

      <div className="space-y-5 rounded-lg bg-card p-6 card-glow">
        {([
          ["email", "Email"],
          ["location", "Location"],
          ["github_url", "GitHub URL"],
          ["linkedin_url", "LinkedIn URL"],
          ["twitter_url", "Twitter URL"],
          ["website_url", "Website URL"],
        ] as const).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={(form[key] as string) ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminContact;
