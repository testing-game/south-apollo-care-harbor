import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Film, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { GalleryField } from "@/components/admin/GalleryField";
import { JobCircularsManager } from "@/components/admin/JobCircularsManager";
import { AboutVideoManager } from "@/components/admin/AboutVideoManager";
import { VideoField } from "@/components/admin/VideoField";
import { supabase } from "@/integrations/supabase/client";
import { must } from "@/lib/admin";
import type { MediaFolder } from "@/lib/media-name";
import { galleryImages } from "@/lib/gallery";
import { slugify, todayInDhaka } from "@/lib/schedule";
import { HERO_POSTER_HINT, HERO_VIDEO_HINT, HERO_VIDEO_MAX_MB, bannerMediaProblem } from "@/lib/video";

export const Route = createFileRoute("/hospital-admin-portal/content")({ staticData: { sitemap: false }, component: ContentAdmin });

type Row = Record<string, unknown>;
type Field = { key: string; label: string | ((r: Row) => string); hint?: string | ((r: Row) => string); kind?: "text" | "textarea" | "image" | "gallery" | "switch" | "date" | "number" | "mediaType" | "video"; when?: (r: Row) => boolean };
const isVideo = (r: Row) => r["media_type"] === "video";
const text = (v: string | ((r: Row) => string) | undefined, r: Row): string => (typeof v === "function" ? v(r) : v ?? "");
type Kind = { id: string; label: string; table: "patient_stories" | "posts" | "hero_banners"; type?: "news" | "blog"; folder: MediaFolder; titleKey: string; slugFrom?: string; fields: Field[]; blank: Record<string, unknown> };

const KINDS: Kind[] = [
  { id: "banners", label: "Banners", table: "hero_banners", folder: "banners", titleKey: "title", fields: [{ key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" }, { key: "media_type", label: "Media type", kind: "mediaType" }, { key: "video_url", label: "Short video (MP4 / WebM)", kind: "video", hint: HERO_VIDEO_HINT, when: isVideo }, { key: "image_url", label: (r) => (isVideo(r) ? "Fallback poster image (optional)" : "Banner image (1920×565 recommended)"), hint: (r) => (isVideo(r) ? HERO_POSTER_HINT : ""), kind: "image" }, { key: "cta_text", label: "Button text" }, { key: "cta_link", label: "Button link" }, { key: "display_order", label: "Order", kind: "number" }, { key: "is_active", label: "Active", kind: "switch" }], blank: { title: "", subtitle: "", media_type: "image", video_url: "", image_url: "", cta_text: "", cta_link: "", display_order: 0, is_active: true } },
  { id: "stories", label: "Patient Stories", table: "patient_stories", folder: "stories", titleKey: "treatment_title", slugFrom: "treatment_title", fields: [{ key: "treatment_title", label: "Treatment title" }, { key: "patient_name", label: "Patient name" }, { key: "thumbnail_url", label: "Thumbnail", kind: "image" }, { key: "youtube_video_url", label: "YouTube link (optional)" }, { key: "story_content", label: "Story", kind: "textarea" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }, { key: "is_published", label: "Published (visible on website)", kind: "switch" }], blank: { treatment_title: "", patient_name: "", thumbnail_url: "", youtube_video_url: "", story_content: "", is_featured: true, is_published: true } },
  { id: "news", label: "News", table: "posts", type: "news", folder: "news", titleKey: "title", slugFrom: "title", fields: [{ key: "title", label: "Title" }, { key: "published_date", label: "Date", kind: "date" }, { key: "featured_image", label: "Main Featured Image", hint: "Cover photo used on news cards and at the top of the article.", kind: "image" }, { key: "gallery_images", label: "Additional / Gallery Images (Multiple)", kind: "gallery" }, { key: "excerpt", label: "Summary", kind: "textarea" }, { key: "content", label: "Content", kind: "textarea" }, { key: "author_name", label: "Author" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }, { key: "is_published", label: "Published (visible on website)", kind: "switch" }], blank: { type: "news", title: "", published_date: "", featured_image: "", gallery_images: [], excerpt: "", content: "", author_name: "", is_featured: true, is_published: true } },
  { id: "blogs", label: "Blogs", table: "posts", type: "blog", folder: "blogs", titleKey: "title", slugFrom: "title", fields: [{ key: "title", label: "Title" }, { key: "published_date", label: "Date", kind: "date" }, { key: "featured_image", label: "Image", kind: "image" }, { key: "excerpt", label: "Summary", kind: "textarea" }, { key: "content", label: "Content", kind: "textarea" }, { key: "author_name", label: "Author" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }, { key: "is_published", label: "Published (visible on website)", kind: "switch" }], blank: { type: "blog", title: "", published_date: "", featured_image: "", excerpt: "", content: "", author_name: "", is_featured: true, is_published: true } },
];

function ContentAdmin() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Website Content</h1>
      <Tabs defaultValue="banners">
        <TabsList className="h-auto flex-wrap">{KINDS.map((k) => <TabsTrigger key={k.id} value={k.id}>{k.label}</TabsTrigger>)}<TabsTrigger value="about-video">About Intro Video</TabsTrigger><TabsTrigger value="jobs">Job Circulars</TabsTrigger></TabsList>
        {KINDS.map((k) => <TabsContent key={k.id} value={k.id}><KindManager kind={k} /></TabsContent>)}
        <TabsContent value="about-video"><AboutVideoManager /></TabsContent>
        <TabsContent value="jobs"><JobCircularsManager /></TabsContent>
      </Tabs>
    </div>
  );
}

function KindManager({ kind }: { kind: Kind }) {
  const qc = useQueryClient();
  const key = ["admin", "content", kind.id];
  const { data = [] } = useQuery({
    queryKey: key,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = supabase.from(kind.table).select("*").order("created_at", { ascending: false });
      if (kind.type) q = q.eq("type", kind.type);
      return must<Record<string, unknown>[]>(await q);
    },
  });
  const [edit, setEdit] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const onUploading = useCallback((u: boolean) => setUploading(u), []);
  const refresh = () => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: ["banners"] }); qc.invalidateQueries({ queryKey: ["stories"] }); qc.invalidateQueries({ queryKey: ["posts"] }); };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    if (!String(edit[kind.titleKey] ?? "").trim()) { toast.error("Enter a title"); return; }
    if (uploading) { toast.error("Wait for the photos to finish uploading"); return; }
    const row: Record<string, unknown> = { ...edit };
    if ("gallery_images" in row) row["gallery_images"] = galleryImages(row["gallery_images"]);
    if (kind.slugFrom && !row["slug"]) row["slug"] = `${slugify(String(row[kind.slugFrom]))}-${Date.now().toString(36)}`;
    if ("published_date" in row && !row["published_date"]) row["published_date"] = todayInDhaka();
    if (kind.table === "hero_banners") {
      const problem = bannerMediaProblem(row);
      if (problem) { toast.error(problem); return; }
      if (!isVideo(row)) row["video_url"] = "";
    }
    setBusy(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t: any = supabase.from(kind.table);
    const res = row["id"] ? await t.update(row).eq("id", row["id"]) : await t.insert(row);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setEdit(null);
    refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(kind.table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }
  const set = (k: string, v: unknown) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  const imgKey = kind.fields.find((f) => f.kind === "image")!.key;

  return (
    <div className="mt-4 space-y-4">
      <Button className="bg-navy" onClick={() => setEdit({ ...kind.blank })}><Plus /> Add {kind.id === "news" ? "news" : kind.label.toLowerCase().replace(/s$/, "")}</Button>
      <div className="divide-y divide-line-soft rounded-lg border border-line-soft bg-background">
        {data.map((r) => (
          <div key={String(r["id"])} className="flex items-center gap-4 p-3">
            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-surface-soft">
              {r[imgKey] ? <img src={String(r[imgKey])} alt="" className="h-full w-full object-cover" /> : isVideo(r) && r["video_url"] ? <video src={String(r["video_url"])} muted playsInline preload="metadata" className="h-full w-full object-cover" /> : null}
              {isVideo(r) && <span className="absolute bottom-0.5 left-0.5 grid h-5 w-5 place-items-center rounded bg-navy text-primary-foreground"><Film className="h-3 w-3" /></span>}
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{String(r[kind.titleKey])}{isVideo(r) && <span className="ml-2 rounded bg-clinical-tint px-1.5 py-0.5 text-xs font-medium text-clinical-teal">Video</span>}</p>
            <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEdit({ ...r })}><Pencil /></Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(String(r["id"]))}><Trash2 /></Button>
          </div>
        ))}
        {!data.length && <p className="p-6 text-sm text-muted-foreground">Nothing here yet.</p>}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{edit?.["id"] ? "Edit" : "Add"} {kind.label}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="space-y-4">
              {kind.fields.filter((f) => !f.when || f.when(edit)).map((f) =>
                f.kind === "image" ? <ImageField key={f.key} label={text(f.label, edit)} hint={text(f.hint, edit)} folder={kind.folder} value={String(edit[f.key] ?? "")} onChange={(u) => set(f.key, u)} />
                : f.kind === "gallery" ? <GalleryField key={f.key} label={text(f.label, edit)} folder={kind.folder} value={edit[f.key]} onPendingChange={onUploading} onChange={(u) => setEdit((e) => (e ? { ...e, [f.key]: u(galleryImages(e[f.key])) } : e))} />
                : f.kind === "video" ? <VideoField key={f.key} label={text(f.label, edit)} hint={text(f.hint, edit)} folder={kind.folder} maxMb={HERO_VIDEO_MAX_MB} value={String(edit[f.key] ?? "")} onChange={(u) => set(f.key, u)} />
                : f.kind === "mediaType" ? (
                  <div key={f.key} className="space-y-2">
                    <Label>{text(f.label, edit)}</Label>
                    <div role="radiogroup" aria-label="Media type" className="flex w-fit rounded-md border border-line-soft p-1">
                      {([["image", "Image"], ["video", "Short Video"]] as const).map(([v, l]) => (
                        <button key={v} type="button" role="radio" aria-checked={(edit[f.key] ?? "image") === v} onClick={() => set(f.key, v)} className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${(edit[f.key] ?? "image") === v ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:text-navy"}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                )
                : f.kind === "switch" ? <label key={f.key} className="flex items-center gap-2 text-sm"><Switch checked={!!edit[f.key]} onCheckedChange={(c) => set(f.key, c)} />{text(f.label, edit)}</label>
                : f.kind === "textarea" ? <div key={f.key} className="space-y-1"><Label>{text(f.label, edit)}</Label><Textarea rows={f.key === "content" || f.key === "story_content" ? 8 : 3} value={String(edit[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} /></div>
                : <div key={f.key} className="space-y-1"><Label>{text(f.label, edit)}</Label><Input type={f.kind === "date" ? "date" : f.kind === "number" ? "number" : "text"} value={String(edit[f.key] ?? "")} onChange={(e) => set(f.key, f.kind === "number" ? Number(e.target.value) : e.target.value)} /></div>,
              )}
              <Button type="submit" disabled={busy || uploading} className="w-full bg-navy">{busy ? "Saving…" : uploading ? "Uploading photos…" : "Save"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
