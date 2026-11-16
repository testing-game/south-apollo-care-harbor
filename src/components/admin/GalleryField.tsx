import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { uploadWebp, type MediaFolder } from "@/lib/media";
import { GALLERY_HINT, GALLERY_MAX_IMAGES, addGalleryImages, galleryImages, galleryRoom, removeGalleryImage } from "@/lib/gallery";

type Update = (current: string[]) => string[];

/** Multi-photo uploader: pick several images at once, preview them, remove any with ×. */
export function GalleryField({ label, value, onChange, folder, onPendingChange }: { label: string; value: unknown; onChange: (update: Update) => void; folder: MediaFolder; onPendingChange?: (uploading: boolean) => void }) {
  const images = galleryImages(value);
  const [pending, setPending] = useState(0);
  useEffect(() => { onPendingChange?.(pending > 0); }, [pending, onPendingChange]);
  useEffect(() => () => onPendingChange?.(false), [onPendingChange]);

  async function pick(list: FileList | null) {
    const files = Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) { if (list?.length) toast.error("Choose image files"); return; }
    const room = galleryRoom(images);
    if (!room) { toast.error(`A gallery can hold up to ${GALLERY_MAX_IMAGES} photos`); return; }
    const batch = files.slice(0, room);
    if (batch.length < files.length) toast.message(`Only the first ${batch.length} photos were added (limit ${GALLERY_MAX_IMAGES})`);
    setPending((n) => n + batch.length);
    let ok = 0;
    // Upload three at a time; each photo appears in the grid as soon as it finishes.
    const queue = [...batch];
    await Promise.all(Array.from({ length: Math.min(3, queue.length) }, async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        try {
          const url = await uploadWebp(file, folder);
          onChange((cur) => addGalleryImages(cur, [url]));
          ok++;
        } catch (e) {
          toast.error(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
        } finally {
          setPending((n) => n - 1);
        }
      }
    }));
    if (ok) toast.success(`${ok} photo${ok === 1 ? "" : "s"} added to the gallery`);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border border-line-soft bg-surface-soft">
            <img src={src} alt={`Gallery photo ${i + 1}`} className="h-full w-full object-cover" />
            <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => onChange((cur) => removeGalleryImage(cur, i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-navy text-primary-foreground shadow transition-colors hover:bg-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {Array.from({ length: pending }, (_, i) => <div key={`p${i}`} className="aspect-square animate-pulse rounded-lg border border-line-soft bg-surface-soft" />)}
        {images.length + pending < GALLERY_MAX_IMAGES && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line-soft text-xs font-medium text-muted-foreground transition-colors hover:border-sky hover:text-navy">
            <ImagePlus className="h-5 w-5" />
            {images.length ? "Add more" : "Add photos"}
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { void pick(e.target.files); e.target.value = ""; }} />
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{GALLERY_HINT}</p>
      {pending > 0 && <p className="text-xs text-muted-foreground">Converting and uploading {pending} photo{pending === 1 ? "" : "s"}… please wait before saving.</p>}
    </div>
  );
}
