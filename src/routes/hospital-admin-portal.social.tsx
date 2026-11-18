import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SOCIAL_ICONS } from "@/components/site/SocialIcon";
import { supabase } from "@/integrations/supabase/client";
import { adminSocialLinksQuery } from "@/lib/admin";
import { SOCIAL_LABELS, SOCIAL_PLATFORMS, socialLinkSchema, type SocialPlatform } from "@/lib/social-links";

export const Route = createFileRoute("/hospital-admin-portal/social")({ staticData: { sitemap: false }, component: SocialSettings });

type Draft = { url: string; is_active: boolean };

function SocialSettings() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(adminSocialLinksQuery);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(Object.fromEntries(data.map((r) => [r.platform, { url: r.url, is_active: r.is_active }])));
  }, [data]);

  const set = (p: string, v: Partial<Draft>) => setDrafts((d) => ({ ...d, [p]: { ...(d[p] ?? { url: "", is_active: false }), ...v } }));

  async function save(platform: SocialPlatform) {
    const parsed = socialLinkSchema.safeParse(drafts[platform]);
    if (!parsed.success) { setErrors((e) => ({ ...e, [platform]: parsed.error.issues[0]?.message ?? "Check this link" })); return; }
    setErrors((e) => ({ ...e, [platform]: "" }));
    setBusy(platform);
    const { error } = await supabase.from("social_links").update(parsed.data).eq("platform", platform);
    setBusy(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`${SOCIAL_LABELS[platform]} saved`);
    qc.invalidateQueries({ queryKey: ["admin", "social-links"] });
    qc.invalidateQueries({ queryKey: ["social-links"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Social Links / Footer Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste each profile link and switch it on to show its icon in the website footer. Icons open in a new tab.</p>
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="divide-y divide-line-soft rounded-lg border border-line-soft bg-background">
          {SOCIAL_PLATFORMS.map((p) => {
            const Icon = SOCIAL_ICONS[p];
            const d = drafts[p] ?? { url: "", is_active: false };
            const saved = data.find((r) => r.platform === p);
            const dirty = !saved || saved.url !== d.url || saved.is_active !== d.is_active;
            return (
              <form key={p} onSubmit={(e) => { e.preventDefault(); save(p); }} className="grid gap-3 p-4 md:grid-cols-[180px_1fr_auto_auto] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-primary-foreground"><Icon className="h-4 w-4" /></span>
                  <Label htmlFor={`social-${p}`} className="font-bold text-navy">{SOCIAL_LABELS[p]}</Label>
                </div>
                <div className="space-y-1">
                  <Input id={`social-${p}`} placeholder={p === "whatsapp" ? "https://wa.me/8801XXXXXXXXX" : `https://${p === "twitter" ? "x" : p}.com/…`} value={d.url} onChange={(e) => set(p, { url: e.target.value })} aria-invalid={!!errors[p]} />
                  {errors[p] && <p className="text-xs text-destructive">{errors[p]}</p>}
                </div>
                <label className="flex items-center gap-2 text-sm"><Switch checked={d.is_active} onCheckedChange={(c) => set(p, { is_active: c })} aria-label={`Show ${SOCIAL_LABELS[p]} in footer`} />{d.is_active ? "Shown" : "Hidden"}</label>
                <div className="flex items-center gap-2">
                  {saved?.url && <Button asChild size="icon" variant="ghost" aria-label={`Open ${SOCIAL_LABELS[p]}`}><a href={saved.url} target="_blank" rel="noopener noreferrer"><ExternalLink /></a></Button>}
                  <Button type="submit" disabled={busy === p || !dirty} className="bg-navy">{busy === p ? "Saving…" : "Save"}</Button>
                </div>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
