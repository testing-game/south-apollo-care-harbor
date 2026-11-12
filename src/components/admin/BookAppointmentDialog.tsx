import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { todayInDhaka, weekdayOf } from "@/lib/schedule";
import { walkInSchema, type WalkInForm } from "@/lib/walk-in";
import { cn } from "@/lib/utils";

type Doctor = Tables<"doctors">;
export type WalkInBooking = {
  id: string;
  number: string;
  bookedAt: Date;
  doctor: Doctor;
  speciality: string;
  patient: { name: string; phone: string; age: number; gender: string };
  date: string;
  time: string;
};

const GENDERS = [["male", "Male"], ["female", "Female"], ["other", "Other"]] as const;
const short = (days: string[]) => (days.length ? days.map((d) => d.slice(0, 3)).join(", ") : "Any day");

export function BookAppointmentDialog({ open, onOpenChange, defaultDate, doctors, specialities, onBooked }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultDate: string;
  doctors: Doctor[];
  specialities: { id: string; name: string }[];
  onBooked: (b: WalkInBooking) => void;
}) {
  const today = todayInDhaka();
  const blank = (): WalkInForm => ({ name: "", phone: "", age: "", gender: "", doctorId: "", date: defaultDate < today ? today : defaultDate, time: "", notes: "" });
  const [form, setForm] = useState<WalkInForm>(blank);
  const [busy, setBusy] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) setForm(blank()); }, [open]);

  const active = useMemo(() => doctors.filter((d) => d.is_active), [doctors]);
  const specName = (d: Doctor) => specialities.find((s) => s.id === d.speciality_id)?.name || d.department_name || "General";
  const doctor = active.find((d) => d.id === form.doctorId);
  const offDay = doctor && form.date && doctor.visiting_days.length > 0 && !doctor.visiting_days.includes(weekdayOf(form.date));
  const set = (k: keyof WalkInForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = walkInSchema(today).safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
    const p = parsed.data;
    const doc = active.find((d) => d.id === p.doctorId)!;
    setBusy(true);
    const { data, error } = await supabase.rpc("staff_book_appointment", { _doctor_id: p.doctorId, _date: p.date, _time: p.time, _name: p.name, _phone: p.phone, _age: p.age, _gender: p.gender, _notes: p.notes });
    setBusy(false);
    const row = data?.[0];
    if (error || !row) { toast.error(error?.message ?? "The appointment couldn't be saved. Please try again."); return; }
    onOpenChange(false);
    onBooked({ id: row.id, number: row.appointment_number, bookedAt: new Date(), doctor: doc, speciality: specName(doc), patient: { name: p.name, phone: p.phone, age: p.age, gender: p.gender }, date: p.date, time: p.time || doc.visiting_hours });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-xl p-0 sm:max-w-xl sm:rounded-xl">
        <DialogHeader className="rounded-t-xl bg-navy px-6 pb-5 pt-6 text-left text-primary-foreground">
          <div className="flex items-center gap-3 pr-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-sky"><CalendarPlus className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <DialogTitle className="text-lg font-bold">Book New Appointment</DialogTitle>
              <DialogDescription className="text-primary-foreground/75">Walk-in or phone booking. Saved as Confirmed and the patient gets an SMS.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="wi-name">Patient full name *</Label>
            <Input id="wi-name" maxLength={120} placeholder="Full name" value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wi-phone">Phone number *</Label>
            <Input id="wi-phone" type="tel" inputMode="tel" maxLength={20} placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} />
          </div>
          <div className="grid grid-cols-[84px_1fr] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="wi-age">Age *</Label>
              <Input id="wi-age" type="number" inputMode="numeric" min={0} max={130} placeholder="Years" value={form.age} onChange={set("age")} />
            </div>
            <fieldset className="space-y-1.5">
              <legend className="mb-1.5 text-sm font-medium leading-none">Gender *</legend>
              <div role="radiogroup" aria-label="Gender" className="grid h-9 grid-cols-3 gap-1 rounded-md border border-input p-0.5">
                {GENDERS.map(([v, l]) => (
                  <button key={v} type="button" role="radio" aria-checked={form.gender === v} onClick={() => setForm({ ...form, gender: v })} className={cn("rounded text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/40", form.gender === v ? "bg-navy text-primary-foreground" : "text-navy hover:bg-surface-soft")}>{l}</button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="wi-doctor">Select doctor *</Label>
            <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v, time: active.find((d) => d.id === v)?.visiting_hours ?? "" })}>
              <SelectTrigger id="wi-doctor" aria-label="Select doctor"><SelectValue placeholder="Choose a doctor">{doctor ? `${doctor.name} · ${specName(doctor)}` : undefined}</SelectValue></SelectTrigger>
              <SelectContent>
                {active.map((d) => (
                  <SelectItem key={d.id} value={d.id} textValue={d.name}>
                    <span className="block font-medium text-navy">{d.name}</span>
                    <span className="block text-xs text-muted-foreground">{specName(d)} · {short(d.visiting_days)}</span>
                  </SelectItem>
                ))}
                {!active.length && <div className="px-3 py-2 text-sm text-muted-foreground">No active doctors yet.</div>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wi-date">Appointment date *</Label>
            <Input id="wi-date" type="date" min={today} value={form.date} onChange={set("date")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wi-time">Preferred time / visiting slot</Label>
            <Input id="wi-time" maxLength={80} placeholder={doctor ? "e.g. 5:00 PM" : "Choose a doctor first"} value={form.time} onChange={set("time")} />
          </div>
          {offDay && (
            <p className="-mt-1 rounded-md bg-surface-soft px-3 py-2 text-xs text-navy sm:col-span-2">
              {doctor.name} usually visits on {doctor.visiting_days.join(", ")}, not {weekdayOf(form.date)}. You can still book if this has been arranged.
            </p>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="wi-notes">Notes / symptoms</Label>
            <Input id="wi-notes" maxLength={500} placeholder="Optional" value={form.notes} onChange={set("notes")} />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" disabled={busy} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy} className="bg-navy hover:bg-navy/90">{busy ? <><Loader2 className="animate-spin" /> Booking…</> : "Book & confirm"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
