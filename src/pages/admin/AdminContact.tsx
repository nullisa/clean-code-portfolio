import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useContactInfo } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { Loader2, Save, Mail, MapPin, Github, Linkedin, Twitter, Globe } from "lucide-react";

const fields = [
  { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
  { key: "location", label: "Location", icon: MapPin, type: "text", placeholder: "City, Country" },
  { key: "github_url", label: "GitHub", icon: Github, type: "url", placeholder: "https://github.com/…" },
  { key: "linkedin_url", label: "LinkedIn", icon: Linkedin, type: "url", placeholder: "https://linkedin.com/in/…" },
  { key: "twitter_url", label: "Twitter", icon: Twitter, type: "url", placeholder: "https://twitter.com/…" },
  { key: "website_url", label: "Website", icon: Globe, type: "url", placeholder: "https://…" },
] as const;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Contact" description="Email, location, and social links." />

      <div className="space-y-4 rounded-xl bg-card p-4 sm:p-6 border border-border/50">
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              {label}
            </Label>
            <Input
              id={key}
              type={type}
              placeholder={placeholder}
              value={(form[key] as string) ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-16 md:static md:bottom-auto z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-0 bg-background/95 backdrop-blur sm:bg-transparent sm:backdrop-blur-none border-t border-border sm:border-0">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminContact;
