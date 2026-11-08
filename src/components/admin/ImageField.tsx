import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadWebp, type MediaFolder } from "@/lib/media";

export function ImageField({ label = "Image", value, onChange, folder }: { label?: string; value: string; onChange: (url: string) => void; folder: MediaFolder }) {
  const [busy, setBusy] = useState(false);
  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    setBusy(true);
    try { onChange(await uploadWebp(file, folder)); toast.success("Image uploaded as WebP"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {value ? <img src={value} alt="" className="h-16 w-16 rounded border object-cover" /> : <div className="h-16 w-16 rounded border bg-surface-soft" />}
        <Input type="file" accept="image/*" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
      </div>
      {busy && <p className="text-xs text-muted-foreground">Converting and uploading…</p>}
    </div>
  );
}
