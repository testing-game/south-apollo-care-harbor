import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { VideoField } from "@/components/admin/VideoField";
import { IntroVideoPlayer } from "@/components/site/IntroVideo";
import { supabase } from "@/integrations/supabase/client";
import { INTRO_POSTER_HINT, INTRO_VIDEO_HINT, INTRO_VIDEO_MAX_MB, parseVideoUrl } from "@/lib/video";

const SLOT = "about_intro";
type Form = { source_type: "upload" | "link"; video_url: string; poster_url: string; title: string; caption: string; is_active: boolean };

export function AboutVideoManager() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "page-video", SLOT],
    queryFn: async () => {
      const { data: row, error } = await supabase.from("page_videos").select("*").eq("slot", SLOT).maybeSingle();
      if (error) throw new Error(error.message);
      return row;
    },
  });
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (data) setForm({ source_type: data.source_type === "link" ? "link" : "upload", video_url: data.video_url, poster_url: data.poster_url, title: data.title, caption: data.caption, is_active: data.is_active });
  }, [data]);

  if (!form) return <p className="mt-4 text-sm text-muted-foreground">Loading…</p>;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const linkOk = !form.video_url || !!parseVideoUrl(form.video_url);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const url = form.video_url.trim();
    if (url && !parseVideoUrl(url)) { toast.error("Paste a valid YouTube, Vimeo or direct video link"); return; }
    if (form.is_active && !url) { toast.error(form.source_type === "upload" ? "Upload a video before showing it" : "Paste a video link before showing it"); return; }
    setBusy(true);
    const { error } = await supabase.from("page_videos").update({ ...form, video_url: url, title: form.title.trim(), caption: form.caption.trim() }).eq("slot", SLOT);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Intro video saved");
    qc.invalidateQueries({ queryKey: ["admin", "page-video", SLOT] });
    qc.invalidateQueries({ queryKey: ["page-video", SLOT] });
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-lg border border-line-soft bg-background p-5">
        <div>
          <h2 className="text-lg font-semibold text-navy">About page intro video</h2>
          <p className="text-sm text-muted-foreground">Shown in the “Hospital Intro Video” section of the About Us page.</p>
        </div>
        <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_active} onCheckedChange={(c) => set("is_active", c)} />Show on the About page</label>
        <div className="space-y-2">
          <Label>Video source</Label>
          <div role="radiogroup" aria-label="Video source" className="inline-flex rounded-md border border-line-soft p-1">
            {([["upload", "Upload MP4"], ["link", "YouTube / Vimeo / link"]] as const).map(([v, l]) => (
              <button key={v} type="button" role="radio" aria-checked={form.source_type === v} onClick={() => { set("source_type", v); set("video_url", v === form.source_type ? form.video_url : ""); }} className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${form.source_type === v ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:text-navy"}`}>{l}</button>
            ))}
          </div>
        </div>
        {form.source_type === "upload" ? (
          <VideoField label="Video file" hint={INTRO_VIDEO_HINT} folder="about" maxMb={INTRO_VIDEO_MAX_MB} value={form.video_url} onChange={(u) => set("video_url", u)} />
        ) : (
          <div className="space-y-1">
            <Label htmlFor="intro-link">Video link</Label>
            <Input id="intro-link" placeholder="https://www.youtube.com/watch?v=…" value={form.video_url} onChange={(e) => set("video_url", e.target.value)} aria-invalid={!linkOk} />
            <p className={`text-xs ${linkOk ? "text-muted-foreground" : "text-destructive"}`}>{linkOk ? "YouTube, Vimeo or a direct .mp4/.webm link." : "This doesn't look like a YouTube, Vimeo or video link."}</p>
          </div>
        )}
        <ImageField label="Thumbnail / poster image (optional)" hint={INTRO_POSTER_HINT} folder="about" value={form.poster_url} onChange={(u) => set("poster_url", u)} />
        {form.poster_url && <Button type="button" variant="outline" size="sm" onClick={() => set("poster_url", "")}>Remove poster</Button>}
        <div className="space-y-1"><Label htmlFor="intro-title">Video title</Label><Input id="intro-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Hospital Intro Video" /></div>
        <div className="space-y-1"><Label htmlFor="intro-caption">Caption (optional)</Label><Textarea id="intro-caption" rows={3} value={form.caption} onChange={(e) => set("caption", e.target.value)} placeholder="A short line about what visitors will see" /></div>
        <Button type="submit" disabled={busy} className="w-full bg-navy">{busy ? "Saving…" : "Save intro video"}</Button>
      </form>
      <div className="space-y-2">
        <p className="text-sm font-medium text-navy">Preview</p>
        {parseVideoUrl(form.video_url) ? <IntroVideoPlayer key={form.video_url + form.poster_url} video={form} /> : <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-line-soft text-sm text-muted-foreground">Add a video to see the preview</div>}
        {!form.is_active && <p className="text-xs text-muted-foreground">Currently hidden from visitors.</p>}
      </div>
    </div>
  );
}
