import { useState, ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: string; // e.g. "avatars", "projects"
  label?: string;
}

const ImageUpload = ({ value, onChange, folder, label = "Image" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("Image uploaded.");
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-start gap-4">
        {value && (
          <div className="relative">
            <img src={value} alt="" className="w-20 h-20 object-cover rounded-md border border-border" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {value ? "Replace" : "Upload"}
          </span>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
