import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { supabase } from "@/integrations/supabase/client";
import { must } from "@/lib/admin";
import type { MediaFolder } from "@/lib/media-name";
import { slugify, todayInDhaka } from "@/lib/schedule";

export const Route = createFileRoute("/hospital-admin-portal/content")({ component: ContentAdmin });

type Field = { key: string; label: string; kind?: "text" | "textarea" | "image" | "switch" | "date" | "number" };
type Kind = { id: string; label: string; table: "patient_stories" | "posts" | "hero_banners"; type?: "news" | "blog"; folder: MediaFolder; titleKey: string; slugFrom?: string; fields: Field[]; blank: Record<string, unknown> };

const KINDS: Kind[] = [
  { id: "banners", label: "Banners", table: "hero_banners", folder: "banners", titleKey: "title", fields: [{ key: "title", label: "Title" }, { key: "subtitle", label: "Subtitle" }, { key: "image_url", label: "Banner image (1920×565 recommended)", kind: "image" }, { key: "cta_text", label: "Button text" }, { key: "cta_link", label: "Button link" }, { key: "display_order", label: "Order", kind: "number" }, { key: "is_active", label: "Active", kind: "switch" }], blank: { title: "", subtitle: "", image_url: "", cta_text: "", cta_link: "", display_order: 0, is_active: true } },
  { id: "stories", label: "Patient Stories", table: "patient_stories", folder: "stories", titleKey: "treatment_title", slugFrom: "treatment_title", fields: [{ key: "treatment_title", label: "Treatment title" }, { key: "patient_name", label: "Patient name" }, { key: "thumbnail_url", label: "Thumbnail", kind: "image" }, { key: "youtube_video_url", label: "YouTube link (optional)" }, { key: "story_content", label: "Story", kind: "textarea" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }], blank: { treatment_title: "", patient_name: "", thumbnail_url: "", youtube_video_url: "", story_content: "", is_featured: true } },
  { id: "news", label: "News", table: "posts", type: "news", folder: "news", titleKey: "title", slugFrom: "title", fields: [{ key: "title", label: "Title" }, { key: "published_date", label: "Date", kind: "date" }, { key: "featured_image", label: "Image", kind: "image" }, { key: "excerpt", label: "Summary", kind: "textarea" }, { key: "content", label: "Content", kind: "textarea" }, { key: "author_name", label: "Author" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }], blank: { type: "news", title: "", published_date: "", featured_image: "", excerpt: "", content: "", author_name: "", is_featured: true } },
  { id: "blogs", label: "Blogs", table: "posts", type: "blog", folder: "blogs", titleKey: "title", slugFrom: "title", fields: [{ key: "title", label: "Title" }, { key: "published_date", label: "Date", kind: "date" }, { key: "featured_image", label: "Image", kind: "image" }, { key: "excerpt", label: "Summary", kind: "textarea" }, { key: "content", label: "Content", kind: "textarea" }, { key: "author_name", label: "Author" }, { key: "is_featured", label: "Featured on homepage", kind: "switch" }], blank: { type: "blog", title: "", published_date: "", featured_image: "", excerpt: "", content: "", author_name: "", is_featured: true } },
];

function ContentAdmin() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Website Content</h1>
      <Tabs defaultValue="banners">
        <TabsList className="flex-wrap">{KINDS.map((k) => <TabsTrigger key={k.id} value={k.id}>{k.label}</TabsTrigger>)}</TabsList>
        {KINDS.map((k) => <TabsContent key={k.id} value={k.id}><KindManager kind={k} /></TabsContent>)}
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
  const refresh = () => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: ["banners"] }); qc.invalidateQueries({ queryKey: ["stories"] }); qc.invalidateQueries({ queryKey: ["posts"] }); };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    if (!String(edit[kind.titleKey] ?? "").trim()) { toast.error("Enter a title"); return; }
    const row: Record<string, unknown> = { ...edit };
    if (kind.slugFrom && !row["slug"]) row["slug"] = `${slugify(String(row[kind.slugFrom]))}-${Date.now().toString(36)}`;
    if ("published_date" in row && !row["published_date"]) row["published_date"] = todayInDhaka();
    if (kind.table === "hero_banners" && !row["image_url"]) { toast.error("Upload a banner image"); return; }
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
      <Button className="bg-navy" onClick={() => setEdit({ ...kind.blank })}><Plus /> Add {kind.label.toLowerCase().replace(/s$/, "")}</Button>
      <div className="divide-y divide-line-soft rounded-lg border border-line-soft bg-background">
        {data.map((r) => (
          <div key={String(r["id"])} className="flex items-center gap-4 p-3">
            {r[imgKey] ? <img src={String(r[imgKey])} alt="" className="h-12 w-20 rounded object-cover" /> : <div className="h-12 w-20 rounded bg-surface-soft" />}
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{String(r[kind.titleKey])}</p>
            <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEdit({ ...r })}><Pencil /></Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(String(r["id"]))}><Trash2 /></Button>
          </div>
        ))}
        {!data.length && <p className="p-6 text-sm text-muted-foreground">Nothing here yet.</p>}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit" : "Add"} {kind.label}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="space-y-4">
              {kind.fields.map((f) =>
                f.kind === "image" ? <ImageField key={f.key} label={f.label} folder={kind.folder} value={String(edit[f.key] ?? "")} onChange={(u) => set(f.key, u)} />
                : f.kind === "switch" ? <label key={f.key} className="flex items-center gap-2 text-sm"><Switch checked={!!edit[f.key]} onCheckedChange={(c) => set(f.key, c)} />{f.label}</label>
                : f.kind === "textarea" ? <div key={f.key} className="space-y-1"><Label>{f.label}</Label><Textarea rows={f.key === "content" || f.key === "story_content" ? 8 : 3} value={String(edit[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} /></div>
                : <div key={f.key} className="space-y-1"><Label>{f.label}</Label><Input type={f.kind === "date" ? "date" : f.kind === "number" ? "number" : "text"} value={String(edit[f.key] ?? "")} onChange={(e) => set(f.key, f.kind === "number" ? Number(e.target.value) : e.target.value)} /></div>,
              )}
              <Button type="submit" disabled={busy} className="w-full bg-navy">{busy ? "Saving…" : "Save"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
