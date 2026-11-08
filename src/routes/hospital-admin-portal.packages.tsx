import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { adminPackagesQuery } from "@/lib/admin";
import { price, slugify } from "@/lib/schedule";

export const Route = createFileRoute("/hospital-admin-portal/packages")({ component: PackagesAdmin });

type PkgInsert = Database["public"]["Tables"]["health_packages"]["Insert"];

function PackagesAdmin() {
  const qc = useQueryClient();
  const packages = useQuery(adminPackagesQuery).data ?? [];
  const [edit, setEdit] = useState<(PkgInsert & { testsText: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (p: Partial<PkgInsert & { testsText: string }>) => setEdit((e) => (e ? { ...e, ...p } : e));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit?.title.trim()) return toast.error("Enter a title");
    setBusy(true);
    const { testsText, ...rest } = edit;
    const row = { ...rest, title: rest.title.trim(), slug: rest.slug || slugify(rest.title), included_tests: testsText.split("\n").map((t) => t.trim()).filter(Boolean) };
    const res = row.id ? await supabase.from("health_packages").update(row).eq("id", row.id) : await supabase.from("health_packages").insert(row);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Package saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin", "packages"] });
    qc.invalidateQueries({ queryKey: ["packages"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-navy">Health Packages</h1><Button className="bg-navy" onClick={() => setEdit({ title: "", slug: "", price: null, image_url: "", description: "", is_featured: false, is_active: true, display_order: packages.length, testsText: "" })}><Plus /> Add package</Button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((p) => (
          <div key={p.id} className={`flex gap-4 rounded-lg border border-line-soft bg-background p-4 ${p.is_active ? "" : "opacity-60"}`}>
            {p.image_url && <img src={p.image_url} alt="" className="h-16 w-16 rounded object-cover" />}
            <div className="min-w-0 flex-1"><p className="font-bold text-navy">{p.title}</p><p className="text-xs text-muted-foreground">{price(p.price)} · {p.included_tests.length} tests</p></div>
            <Button size="icon" variant="ghost" aria-label={`Edit ${p.title}`} onClick={() => setEdit({ ...p, testsText: p.included_tests.join("\n") })}><Pencil /></Button>
          </div>
        ))}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit package" : "Add package"}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-1"><Label>Title</Label><Input value={edit.title} onChange={(e) => set({ title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Price (৳) — leave empty for "Price on request"</Label><Input type="number" min={0} value={edit.price ?? ""} onChange={(e) => set({ price: e.target.value ? Number(e.target.value) : null })} /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={edit.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
              <div className="space-y-1"><Label>Included tests (one per line)</Label><Textarea rows={6} value={edit.testsText} onChange={(e) => set({ testsText: e.target.value })} /></div>
              <ImageField folder="packages" value={edit.image_url ?? ""} onChange={(url) => set({ image_url: url })} />
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={!!edit.is_featured} onCheckedChange={(c) => set({ is_featured: c })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={edit.is_active !== false} onCheckedChange={(c) => set({ is_active: c })} /> Active</label>
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-navy">{busy ? "Saving…" : "Save package"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
