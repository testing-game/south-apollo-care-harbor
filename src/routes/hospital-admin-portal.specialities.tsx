import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ImageUp, Pencil, Plus, Search, SearchX, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/admin/Pagination";
import { SpecialityIcon } from "@/components/specialities/SpecialityIcon";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { adminSpecialityRowsQuery } from "@/lib/admin";
import { moveDoctor, nextSerial, sortDoctors } from "@/lib/doctor-order";
import { uploadIcon } from "@/lib/media";
import { paginate } from "@/lib/query-inbox";
import { toSpeciality } from "@/lib/specialities";
import { iconFileProblem, iconKind, pngSizeWarning, SPECIALITY_ICON_HINT, uniqueSlug } from "@/lib/speciality-icon";

export const Route = createFileRoute("/hospital-admin-portal/specialities")({ staticData: { sitemap: false }, component: SpecialitiesAdmin });

type Row = Database["public"]["Tables"]["specialities"]["Row"];
type Form = { id?: string; slug?: string; name: string; description: string; icon_url: string; display_order: number; is_active: boolean };

function SpecialitiesAdmin() {
  const qc = useQueryClient();
  const q = useQuery(adminSpecialityRowsQuery);
  const all = useMemo(() => sortDoctors(q.data ?? []), [q.data]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<Form | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [moving, setMoving] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const n = search.trim().toLowerCase();
    return n ? all.filter((s) => `${s.name} ${s.description ?? ""}`.toLowerCase().includes(n)) : all;
  }, [all, search]);
  const view = paginate(filtered, page);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", "specialities"] });
    qc.invalidateQueries({ queryKey: ["speciality-rows"] });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const name = edit.name.trim();
    if (!name) { toast.error("Enter the speciality name"); return; }
    if (!edit.icon_url) { toast.error("Upload an icon for this speciality"); return; }
    setBusy(true);
    const row = { name, description: edit.description.trim() || null, icon_url: edit.icon_url, is_active: edit.is_active, display_order: Math.max(1, Math.round(Number(edit.display_order) || 1)) };
    const res = edit.id
      ? await supabase.from("specialities").update(row).eq("id", edit.id)
      : await supabase.from("specialities").insert({ ...row, slug: uniqueSlug(name, all.map((s) => s.slug)) });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Speciality saved");
    setEdit(null);
    refresh();
  }

  async function toggle(r: Row, on: boolean) {
    const { error } = await supabase.from("specialities").update({ is_active: on }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success(on ? `${r.name} is now shown on the website` : `${r.name} is now hidden from the website`);
    refresh();
  }

  async function move(id: string, dir: "up" | "down") {
    const changes = moveDoctor(all, filtered, id, dir);
    if (!changes.length) return;
    setMoving(id);
    const results = await Promise.all(changes.map((c) => supabase.from("specialities").update({ display_order: c.display_order }).eq("id", c.id)));
    setMoving(null);
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(failed.error.message);
    await qc.invalidateQueries({ queryKey: ["admin", "specialities"] });
    qc.invalidateQueries({ queryKey: ["speciality-rows"] });
  }

  async function remove() {
    if (!toDelete) return;
    const { error } = await supabase.from("specialities").delete().eq("id", toDelete.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`${toDelete.name} deleted`);
    setToDelete(null);
    refresh();
  }

  const set = (patch: Partial<Form>) => setEdit((f) => (f ? { ...f, ...patch } : f));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Specialities</h1>
          <p className="text-sm text-muted-foreground">Active specialities appear on the homepage and the Specialities page, lowest serial first.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 pr-9" aria-label="Search specialities" placeholder="Search speciality name or description…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            {search && <Button size="icon" variant="ghost" aria-label="Clear search" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => { setSearch(""); setPage(1); }}><X /></Button>}
          </div>
          <Button className="bg-navy sm:ml-auto" onClick={() => setEdit({ name: "", description: "", icon_url: "", display_order: nextSerial(all), is_active: true })}><Plus /> Add Speciality</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line-soft bg-surface-soft text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="w-28 px-4 py-3">Serial</th><th className="w-20 px-2 py-3">Icon</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Description</th><th className="w-32 px-4 py-3">Active</th><th className="w-24 px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {view.items.map((s) => (
              <tr key={s.id} className={s.is_active ? "" : "bg-surface-soft/60"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="min-w-9 rounded bg-navy px-2 py-0.5 text-center text-xs font-bold text-primary-foreground" title="Display serial">#{s.display_order}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={`Move ${s.name} up`} disabled={!!moving || filtered[0]?.id === s.id} onClick={() => move(s.id, "up")}><ArrowUp /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" aria-label={`Move ${s.name} down`} disabled={!!moving || filtered[filtered.length - 1]?.id === s.id} onClick={() => move(s.id, "down")}><ArrowDown /></Button>
                  </div>
                </td>
                <td className="px-2 py-3"><div className={`grid h-12 w-12 place-items-center rounded-lg border border-speciality-border bg-speciality-surface ${s.is_active ? "" : "opacity-50"}`}><SpecialityIcon speciality={toSpeciality(s)} /></div></td>
                <td className="px-4 py-3 font-semibold text-navy">{s.name}</td>
                <td className="max-w-xs px-4 py-3 text-muted-foreground"><p className="line-clamp-2">{s.description || <span className="italic">No description</span>}</p></td>
                <td className="px-4 py-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Switch checked={s.is_active} onCheckedChange={(c) => toggle(s, c)} aria-label={`${s.is_active ? "Hide" : "Show"} ${s.name}`} />
                    {s.is_active ? "Active" : "Hidden"}
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" aria-label={`Edit ${s.name}`} onClick={() => setEdit({ id: s.id, slug: s.slug, name: s.name, description: s.description ?? "", icon_url: s.icon_url, display_order: s.display_order, is_active: s.is_active })}><Pencil /></Button>
                    <Button size="icon" variant="ghost" aria-label={`Delete ${s.name}`} className="text-destructive hover:text-destructive" onClick={() => setToDelete(s)}><Trash2 /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!view.items.length && (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <SearchX className="h-8 w-8 text-sky" />
            {q.isLoading ? "Loading…" : all.length ? "No specialities match your search." : "No specialities yet. Add the first one."}
          </div>
        )}
      </div>
      <Pagination view={view} onPage={setPage} noun={["speciality", "specialities"]} />

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Edit Speciality" : "Add Speciality"}</DialogTitle>
            <DialogDescription>Shown on the homepage and the Specialities page while Active is on.</DialogDescription>
          </DialogHeader>
          {edit && (
            <form onSubmit={save} noValidate className="space-y-4">
              <div className="space-y-1"><Label htmlFor="sp-name">Speciality Name</Label><Input id="sp-name" maxLength={80} placeholder="e.g. Cardiology" value={edit.name} onChange={(e) => set({ name: e.target.value })} /></div>
              <div className="space-y-1">
                <Label htmlFor="sp-desc">Short Description</Label>
                <Textarea id="sp-desc" rows={3} maxLength={240} placeholder="One or two sentences about this department." value={edit.description} onChange={(e) => set({ description: e.target.value })} />
                <p className="text-xs text-muted-foreground">Shown under the name on the Specialities page. {edit.description.length}/240</p>
              </div>
              <IconField name={edit.name} value={edit.icon_url} onChange={(icon_url) => set({ icon_url })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="sp-serial">Display Serial / Order</Label>
                  <Input id="sp-serial" type="number" min={1} step={1} value={edit.display_order || ""} onChange={(e) => set({ display_order: Number(e.target.value) || 0 })} />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
                </div>
                <label className="flex items-center gap-3 self-start rounded-lg border border-line-soft p-3 text-sm sm:mt-6">
                  <Switch checked={edit.is_active} onCheckedChange={(c) => set({ is_active: c })} />
                  <span><span className="font-medium text-navy">Active</span><span className="block text-xs text-muted-foreground">Turn off to hide without deleting.</span></span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
                <Button type="submit" className="bg-navy" disabled={busy}>{busy ? "Saving…" : "Save Speciality"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this speciality?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.name}" will be removed permanently. Doctors linked to it keep their department name but lose the speciality link. To hide it temporarily, switch Active off instead.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={(e) => { e.preventDefault(); void remove(); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function readPngSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = () => { resolve(null); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

function IconField({ name, value, onChange }: { name: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const preview = value ? toSpeciality({ id: "preview", name, icon_url: value, description: null }) : null;
  async function pick(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    const problem = iconFileProblem(file);
    if (problem) { toast.error(problem); return; }
    if (iconKind(file) === "png") {
      const size = await readPngSize(file);
      const warning = size && pngSizeWarning(size.width, size.height);
      if (warning) toast.warning(warning);
    }
    setBusy(true);
    try { onChange(await uploadIcon(file)); toast.success("Icon uploaded"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
    finally { setBusy(false); }
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="sp-icon">Custom Icon</Label>
      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-line-soft p-3 sm:flex-row sm:items-center">
        <div className="flex gap-2" aria-label="Icon preview">
          <div className="speciality-card flex h-[88px] w-[88px] flex-col items-center justify-center gap-1.5 rounded-[12px] border border-speciality-border bg-speciality-surface text-speciality-label">
            {preview ? <SpecialityIcon speciality={preview} /> : <ImageUp className="h-6 w-6 text-muted-foreground" />}
            <span className="text-[10px] text-muted-foreground">Normal</span>
          </div>
          <div className="speciality-card flex h-[88px] w-[88px] flex-col items-center justify-center gap-1.5 rounded-[12px] border border-speciality-active bg-speciality-active text-speciality-on-active">
            {preview ? <span className="[&_.speciality-icon]:[filter:brightness(0)_invert(1)]"><SpecialityIcon speciality={preview} /></span> : <ImageUp className="h-6 w-6 opacity-70" />}
            <span className="text-[10px] opacity-80">Hover</span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Input id="sp-icon" type="file" accept=".svg,image/svg+xml,.png,image/png" disabled={busy} onChange={(e) => void pick(e.currentTarget)} />
          {busy && <p className="text-xs text-muted-foreground">Uploading…</p>}
          {value && !busy && <p className="text-xs text-muted-foreground">Previews show the icon at its real website size.</p>}
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-navy">Recommended:</span> {SPECIALITY_ICON_HINT}</p>
    </div>
  );
}
