import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { Pagination } from "@/components/admin/Pagination";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { adminPackagesQuery } from "@/lib/admin";
import { price, slugify } from "@/lib/schedule";
import { filterAdminPackages } from "@/lib/admin-filters";
import { paginate } from "@/lib/query-inbox";
import { PACKAGE_IMAGE_SIZES as SIZES } from "@/lib/packages";

const sizeHint = (s: (typeof SIZES)[keyof typeof SIZES]) => `Recommended ${s.width} × ${s.height} px (${s.ratio}). Keep text and faces near the centre.`;

export const Route = createFileRoute("/hospital-admin-portal/packages")({ component: PackagesAdmin });

type PkgInsert = Database["public"]["Tables"]["health_packages"]["Insert"];

function PackagesAdmin() {
  const qc = useQueryClient();
  const packagesQ = useQuery(adminPackagesQuery);
  const packages = packagesQ.data ?? [];
  const [edit, setEdit] = useState<(PkgInsert & { testsText: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => filterAdminPackages(packages, search), [packages, search]);
  const view = paginate(filtered, page);
  const set = (p: Partial<PkgInsert & { testsText: string }>) => setEdit((e) => (e ? { ...e, ...p } : e));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit?.title.trim()) { toast.error("Enter a title"); return; }
    setBusy(true);
    const { testsText, ...rest } = edit;
    const row = { ...rest, title: rest.title.trim(), slug: rest.slug || slugify(rest.title), included_tests: testsText.split("\n").map((t) => t.trim()).filter(Boolean) };
    const res = row.id ? await supabase.from("health_packages").update(row).eq("id", row.id) : await supabase.from("health_packages").insert(row);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Package saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin", "packages"] });
    qc.invalidateQueries({ queryKey: ["packages"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-navy">Health Packages</h1>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" aria-label="Search packages" placeholder="Search package by title, price, or included tests..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Button className="bg-navy md:ml-auto" onClick={() => setEdit({ title: "", slug: "", price: null, image_url: "", home_image_url: "", description: "", is_featured: false, is_active: true, display_order: packages.length, testsText: "" })}><Plus /> Add package</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {view.items.map((p) => (
          <div key={p.id} className={`flex gap-4 rounded-lg border border-line-soft bg-background p-4 ${p.is_active ? "" : "opacity-60"}`}>
            {p.image_url && <img src={p.image_url} alt="" className="h-16 w-16 rounded object-cover" />}
            <div className="min-w-0 flex-1"><p className="font-bold text-navy">{p.title}</p><p className="text-xs text-muted-foreground">{price(p.price)} · {p.included_tests.length} tests</p></div>
            <Button size="icon" variant="ghost" aria-label={`Edit ${p.title}`} onClick={() => setEdit({ ...p, testsText: p.included_tests.join("\n") })}><Pencil /></Button>
          </div>
        ))}
      </div>
      {!view.items.length && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line-soft bg-background py-12 text-center text-sm text-muted-foreground">
          <SearchX className="h-8 w-8 text-sky" />
          {packagesQ.isLoading ? "Loading…" : packages.length ? "No packages match your search." : "No packages yet. Add the first one."}
        </div>
      )}
      <Pagination view={view} onPage={setPage} noun={["package", "packages"]} />
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit package" : "Add package"}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-1"><Label>Title</Label><Input value={edit.title} onChange={(e) => set({ title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Price (৳) — leave empty for "Price on request"</Label><Input type="number" min={0} value={edit.price ?? ""} onChange={(e) => set({ price: e.target.value ? Number(e.target.value) : null })} /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea value={edit.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
              <div className="space-y-1"><Label>Included tests (one per line)</Label><Textarea rows={6} value={edit.testsText} onChange={(e) => set({ testsText: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageField label={SIZES.home.label} hint={`${sizeHint(SIZES.home)} If empty, the page banner is used.`} folder="packages" value={edit.home_image_url ?? ""} onChange={(url) => set({ home_image_url: url })} />
                <ImageField label={SIZES.page.label} hint={sizeHint(SIZES.page)} folder="packages" value={edit.image_url ?? ""} onChange={(url) => set({ image_url: url })} />
              </div>
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
