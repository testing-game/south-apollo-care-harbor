import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageField } from "@/components/admin/ImageField";
import { Pagination } from "@/components/admin/Pagination";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { adminDoctorsQuery, adminSpecialitiesQuery, DAYS } from "@/lib/admin";
import { ALL_SPECIALITIES, filterAdminDoctors } from "@/lib/admin-filters";
import { paginate } from "@/lib/query-inbox";

export const Route = createFileRoute("/hospital-admin-portal/doctors")({ component: DoctorsAdmin });

type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
const blank: DoctorInsert = { name: "", designation: "", degrees: "", department_name: "", image_url: "", visiting_days: [], visiting_hours: "", room_number: "", consultation_fee: null, speciality_id: null, is_featured: false, is_active: true };

function DoctorsAdmin() {
  const qc = useQueryClient();
  const doctorsQ = useQuery(adminDoctorsQuery);
  const doctors = doctorsQ.data ?? [];
  const specialities = useQuery(adminSpecialitiesQuery).data ?? [];
  const [edit, setEdit] = useState<DoctorInsert | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState(ALL_SPECIALITIES);
  const [page, setPage] = useState(1);
  const specNames = useMemo(() => Object.fromEntries(specialities.map((s) => [s.id, s.name])), [specialities]);
  const filtered = useMemo(() => filterAdminDoctors(doctors, search, specFilter, specNames), [doctors, search, specFilter, specNames]);
  const view = paginate(filtered, page);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    if (!edit.name.trim()) { toast.error("Enter the doctor's name"); return; }
    setBusy(true);
    const spec = specialities.find((s) => s.id === edit.speciality_id);
    const row = { ...edit, name: edit.name.trim(), department_name: edit.department_name || spec?.name || "" };
    const res = edit.id ? await supabase.from("doctors").update(row).eq("id", edit.id) : await supabase.from("doctors").insert(row);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Doctor saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin", "doctors"] });
    qc.invalidateQueries({ queryKey: ["doctors"] });
  }
  const set = (patch: Partial<DoctorInsert>) => setEdit((d) => (d ? { ...d, ...patch } : d));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-navy">Doctors</h1>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" aria-label="Search doctors" placeholder="Search doctor by name, degree, speciality, or room..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={specFilter} onValueChange={(v) => { setSpecFilter(v); setPage(1); }}>
            <SelectTrigger aria-label="Filter by speciality" className="w-full md:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_SPECIALITIES}>All specialities</SelectItem>
              {specialities.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button className="bg-navy md:ml-auto" onClick={() => setEdit({ ...blank })}><Plus /> Add doctor</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {view.items.map((d) => (
          <div key={d.id} className={`flex gap-4 rounded-lg border border-line-soft bg-background p-4 ${d.is_active ? "" : "opacity-60"}`}>
            {d.image_url ? <img src={d.image_url} alt="" className="h-16 w-16 rounded object-cover" /> : <div className="h-16 w-16 rounded bg-surface-soft" />}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-navy">{d.name}</p>
              <p className="truncate text-xs text-muted-foreground">{d.designation} · {d.department_name}</p>
              <p className="text-xs text-muted-foreground">{d.visiting_days.join(", ") || "No days set"}</p>
              {!d.is_active && <p className="text-xs font-semibold text-destructive">Inactive</p>}
            </div>
            <Button size="icon" variant="ghost" aria-label={`Edit ${d.name}`} onClick={() => setEdit({ ...d })}><Pencil /></Button>
          </div>
        ))}
      </div>
      {!view.items.length && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line-soft bg-background py-12 text-center text-sm text-muted-foreground">
          <SearchX className="h-8 w-8 text-sky" />
          {doctorsQ.isLoading ? "Loading…" : doctors.length ? "No doctors match your search or filter." : "No doctors yet. Add the first one."}
        </div>
      )}
      <Pagination view={view} onPage={setPage} noun={["doctor", "doctors"]} />
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit doctor" : "Add doctor"}</DialogTitle></DialogHeader>
          {edit && (
            <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2"><Label>Name</Label><Input value={edit.name} onChange={(e) => set({ name: e.target.value })} /></div>
              <div className="space-y-1"><Label>Designation</Label><Input placeholder="Consultant" value={edit.designation ?? ""} onChange={(e) => set({ designation: e.target.value })} /></div>
              <div className="space-y-1"><Label>Degrees</Label><Input placeholder="MBBS, FCPS" value={edit.degrees ?? ""} onChange={(e) => set({ degrees: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Speciality</Label>
                <Select value={edit.speciality_id ?? ""} onValueChange={(v) => set({ speciality_id: v })}><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{specialities.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1"><Label>Department name</Label><Input placeholder="Defaults to speciality" value={edit.department_name ?? ""} onChange={(e) => set({ department_name: e.target.value })} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Visiting days</Label>
                <div className="flex flex-wrap gap-4">
                  {DAYS.map((day) => (
                    <label key={day} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={!!edit.visiting_days?.includes(day)} onCheckedChange={(c) => set({ visiting_days: c ? [...(edit.visiting_days ?? []), day] : (edit.visiting_days ?? []).filter((x) => x !== day) })} />{day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1"><Label>Visiting hours</Label><Input placeholder="05:00 PM - 09:00 PM" value={edit.visiting_hours ?? ""} onChange={(e) => set({ visiting_hours: e.target.value })} /></div>
              <div className="space-y-1"><Label>Room number</Label><Input value={edit.room_number ?? ""} onChange={(e) => set({ room_number: e.target.value })} /></div>
              <div className="space-y-1"><Label>Consultation fee (৳)</Label><Input type="number" min={0} value={edit.consultation_fee ?? ""} onChange={(e) => set({ consultation_fee: e.target.value ? Number(e.target.value) : null })} /></div>
              <ImageField label="Photo" folder="doctors" value={edit.image_url ?? ""} onChange={(url) => set({ image_url: url })} />
              <label className="flex items-center gap-2 text-sm"><Switch checked={!!edit.is_featured} onCheckedChange={(c) => set({ is_featured: c })} /> Featured on homepage</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={edit.is_active !== false} onCheckedChange={(c) => set({ is_active: c })} /> Active</label>
              <Button type="submit" disabled={busy} className="bg-navy md:col-span-2">{busy ? "Saving…" : "Save doctor"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
