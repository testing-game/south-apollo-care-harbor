import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageField } from "@/components/admin/ImageField";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { adminDoctorsQuery, adminSpecialitiesQuery, DAYS } from "@/lib/admin";

export const Route = createFileRoute("/hospital-admin-portal/doctors")({ component: DoctorsAdmin });

type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
const blank: DoctorInsert = { name: "", designation: "", degrees: "", department_name: "", image_url: "", visiting_days: [], visiting_hours: "", room_number: "", consultation_fee: null, speciality_id: null, is_featured: false, is_active: true };

function DoctorsAdmin() {
  const qc = useQueryClient();
  const doctors = useQuery(adminDoctorsQuery).data ?? [];
  const specialities = useQuery(adminSpecialitiesQuery).data ?? [];
  const [edit, setEdit] = useState<DoctorInsert | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    if (!edit.name.trim()) return toast.error("Enter the doctor's name");
    setBusy(true);
    const spec = specialities.find((s) => s.id === edit.speciality_id);
    const row = { ...edit, name: edit.name.trim(), department_name: edit.department_name || spec?.name || "" };
    const res = edit.id ? await supabase.from("doctors").update(row).eq("id", edit.id) : await supabase.from("doctors").insert(row);
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Doctor saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin", "doctors"] });
    qc.invalidateQueries({ queryKey: ["doctors"] });
  }
  const set = (patch: Partial<DoctorInsert>) => setEdit((d) => (d ? { ...d, ...patch } : d));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-navy">Doctors</h1><Button className="bg-navy" onClick={() => setEdit({ ...blank })}><Plus /> Add doctor</Button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => (
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
        {!doctors.length && <p className="text-sm text-muted-foreground">No doctors yet. Add the first one.</p>}
      </div>
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
                      <Checkbox checked={edit.visiting_days?.includes(day)} onCheckedChange={(c) => set({ visiting_days: c ? [...(edit.visiting_days ?? []), day] : (edit.visiting_days ?? []).filter((x) => x !== day) })} />{day}
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
