import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadVideo, type MediaFolder } from "@/lib/media";
import { videoFileProblem } from "@/lib/video";

export function VideoField({ label = "Video", hint, value, onChange, folder, maxMb }: { label?: string; hint?: string; value: string; onChange: (url: string) => void; folder: MediaFolder; maxMb: number }) {
  const [busy, setBusy] = useState(false);
  async function pick(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (!file) return;
    const problem = videoFileProblem(file, maxMb);
    if (problem) { toast.error(problem); input.value = ""; return; }
    setBusy(true);
    try { onChange(await uploadVideo(file, folder, maxMb)); toast.success("Video uploaded"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); input.value = ""; }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && (
        <div className="relative w-full max-w-sm">
          <video src={value} muted controls playsInline preload="metadata" className="aspect-video w-full rounded border bg-navy object-cover" />
          <Button type="button" size="icon" variant="secondary" aria-label="Remove video" className="absolute right-1 top-1 h-7 w-7" onClick={() => onChange("")}><X /></Button>
        </div>
      )}
      <Input type="file" accept="video/mp4,video/webm,.mp4,.webm" disabled={busy} onChange={(e) => pick(e.currentTarget)} aria-label={label} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {busy && <p className="text-xs text-muted-foreground">Uploading video… this can take a minute for larger files.</p>}
    </div>
  );
}
