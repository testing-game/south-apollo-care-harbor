import { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { lightboxStep } from "@/lib/gallery";

/** Responsive photo grid; clicking a photo opens a full-screen viewer with arrows, keys and swipe. */
export function NewsGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  if (!images.length) return null;
  const go = (delta: number) => setOpen((i) => (i === null ? i : lightboxStep(i, delta, images.length)));
  const many = images.length > 1;

  return (
    <section aria-labelledby="news-gallery-heading" className="mt-12 border-t border-line-soft pt-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="block h-1 w-10 rounded-full bg-sky" />
          <h2 id="news-gallery-heading" className="mt-3 text-xl font-bold text-navy">Event Photo Gallery</h2>
        </div>
        <p className="text-sm text-muted-foreground">{images.length} photo{images.length === 1 ? "" : "s"}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <li key={src}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${images.length}`} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-soft ring-offset-2 ring-offset-background transition-shadow hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky">
              <img src={src} alt={`${title} — photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
              <span className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/30" />
              <Expand className="absolute right-2 top-2 h-7 w-7 rounded-full bg-navy/80 p-1.5 text-sky opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-deep/[0.97] backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-50 flex flex-col text-primary-foreground outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
            }}
            onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              const start = touchX.current; touchX.current = null;
              const end = e.changedTouches[0]?.clientX;
              if (start == null || end == null || Math.abs(end - start) < 40) return;
              go(end < start ? 1 : -1);
            }}
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <DialogPrimitive.Title className="truncate text-sm font-medium">
                <span className="text-sky">{open === null ? 0 : open + 1}</span> / {images.length}<span className="ml-3 hidden text-primary-foreground/70 sm:inline">{title}</span>
              </DialogPrimitive.Title>
              <DialogPrimitive.Close aria-label="Close gallery" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-sky hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky">
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-20">
              {open !== null && <img key={open} src={images[open]} alt={`${title} — photo ${open + 1}`} className="max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl animate-in fade-in-0 duration-300" draggable={false} />}
              {many && (
                <>
                  <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-sky hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky sm:left-6"><ChevronLeft className="h-6 w-6" /></button>
                  <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-sky hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky sm:right-6"><ChevronRight className="h-6 w-6" /></button>
                </>
              )}
            </div>
            {many && (
              <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-4">
                {images.map((src, i) => (
                  <button key={src} type="button" aria-label={`Show photo ${i + 1}`} aria-current={i === open} onClick={() => setOpen(i)} className={`h-12 w-16 shrink-0 overflow-hidden rounded-md ring-2 transition ${i === open ? "ring-sky" : "opacity-60 ring-transparent hover:opacity-100"}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}
