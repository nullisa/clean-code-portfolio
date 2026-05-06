import { useState, ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

interface CvUploadProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
}

const CvUpload = ({ value, onChange, label = "CV / Resume" }: CvUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("CV must be a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV must be under 10MB.");
      return;
    }

    setUploading(true);
    const path = `cv-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from("cvs").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: "application/pdf",
    });
    setUploading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("cvs").getPublicUrl(path);
    onChange(data.publicUrl);
    toast.success("CV uploaded.");
    e.target.value = "";
  };

  const filename = value ? decodeURIComponent(value.split("/").pop() || "CV.pdf") : null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-start gap-4 flex-wrap">
        {value && (
          <div className="relative flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary/50">
            <FileText className="w-4 h-4 text-primary" />
            <a href={value} target="_blank" rel="noreferrer" className="text-sm underline-offset-2 hover:underline truncate max-w-[200px]">
              {filename}
            </a>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
              aria-label="Remove CV"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <label className="cursor-pointer">
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {value ? "Replace CV" : "Upload CV (PDF)"}
          </span>
        </label>
      </div>
    </div>
  );
};

export default CvUpload;
