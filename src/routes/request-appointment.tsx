import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Download } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { doctorsQuery, specialityRowsQuery } from "@/lib/public-queries";
import { formatDate, todayInDhaka, upcomingVisitDates } from "@/lib/schedule";
import { downloadReceipt } from "@/lib/pdf";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/request-appointment")({
  validateSearch: (s: Record<string, unknown>): { doctor?: string } => ({ doctor: typeof s.doctor === "string" ? s.doctor : undefined }),
  head: () => meta("Request an Appointment", "Book a consultation with a South Apollo doctor: choose a speciality, doctor and visiting day."),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(doctorsQuery), context.queryClient.ensureQueryData(specialityRowsQuery)]),
  component: AppointmentPage,
});

const patientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  age: z.coerce.number().int().min(0, "Enter a valid age").max(130, "Enter a valid age"),
  gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "Choose a gender" }) }),
  notes: z.string().max(1000).optional(),
});

function AppointmentPage() {
  const { doctor: preselect } = Route.useSearch();
  const { data: doctors } = useSuspenseQuery(doctorsQuery);
  const { data: specialities } = useSuspenseQuery(specialityRowsQuery);
  const initial = doctors.find((d) => d.id === preselect);
  const [spec, setSpec] = useState(initial?.speciality_id ?? "");
  const [doctorId, setDoctorId] = useState(initial?.id ?? "");
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const withDoctors = specialities.filter((s) => doctors.some((d) => d.speciality_id === s.id));
  const specDoctors = doctors.filter((d) => d.speciality_id === spec);
  const doctor = doctors.find((d) => d.id === doctorId);
  const dates = useMemo(() => (doctor ? upcomingVisitDates(doctor.visiting_days, todayInDhaka(), 10) : []), [doctor]);
  const step = !spec ? 1 : !doctor ? 2 : !date ? 3 : 4;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = patientSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]!.message);
    setBusy(true);
    const p = parsed.data;
    const { data, error } = await supabase.rpc("book_appointment", { _doctor_id: doctorId, _date: date, _name: p.name, _phone: p.phone, _age: p.age, _gender: p.gender, _notes: p.notes ?? "" });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(data as string);
  }

  function receipt() {
    if (!done || !doctor) return;
    void downloadReceipt("Appointment Request", [["Appointment No.", done], ["Patient", form.name], ["Phone", form.phone], ["Doctor", doctor.name], ["Department", doctor.department_name], ["Date", formatDate(date)], ["Visiting hours", doctor.visiting_hours || "—"], ["Room", doctor.room_number || "—"]], `${done}.pdf`);
  }

  return (
    <main>
      <PageHero crumb="Request an Appointment" title="Request an Appointment">Choose a speciality, a doctor and a visiting day, then tell us about the patient.</PageHero>
      <section className="container-site max-w-3xl py-12">
        {done ? (
          <div className="border border-line-soft p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-clinical-teal" />
            <h2 className="mt-4 text-2xl font-bold text-navy">Request received</h2>
            <p className="mt-2 text-muted-foreground">Your appointment number is</p>
            <p className="mt-1 text-3xl font-bold tracking-wider text-navy">{done}</p>
            <p className="mt-3 text-sm text-muted-foreground">{doctor?.name} · {formatDate(date)}. Our team may call {form.phone} to confirm.</p>
            <Button onClick={receipt} className="mt-6 rounded-none bg-navy hover:bg-sky"><Download /> Download PDF slip</Button>
          </div>
        ) : !doctors.length ? (
          <EmptyState>Online booking opens once doctor schedules are published. Please call +880 1913-240139.</EmptyState>
        ) : (
          <div className="space-y-8">
            <ol className="grid grid-cols-4 gap-2 text-xs font-semibold">
              {["Speciality", "Doctor", "Day", "Patient"].map((l, i) => <li key={l} className={`border-t-4 pt-2 ${i + 1 <= step ? "border-navy text-navy" : "border-line-soft text-muted-foreground"}`}>{i + 1}. {l}</li>)}
            </ol>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Speciality</Label>
                <Select value={spec} onValueChange={(v) => { setSpec(v); setDoctorId(""); setDate(""); }}>
                  <SelectTrigger className="rounded-none"><SelectValue placeholder="Choose a speciality" /></SelectTrigger>
                  <SelectContent>{withDoctors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={doctorId} onValueChange={(v) => { setDoctorId(v); setDate(""); }} disabled={!spec}>
                  <SelectTrigger className="rounded-none"><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
                  <SelectContent>{specDoctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {doctor && (
              <div>
                <Label>Visiting day</Label>
                <p className="mb-3 text-xs text-muted-foreground">{doctor.visiting_hours || "Hours confirmed by phone"}{doctor.room_number ? ` · Room ${doctor.room_number}` : ""}</p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((d) => <Button key={d} type="button" variant={d === date ? "default" : "outline"} className={`rounded-none ${d === date ? "bg-navy" : ""}`} onClick={() => setDate(d)}>{formatDate(d)}</Button>)}
                </div>
              </div>
            )}
            {date && (
              <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Patient name</Label><Input id="name" className="rounded-none" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" className="rounded-none" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="age">Age</Label><Input id="age" type="number" min={0} max={130} className="rounded-none" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue placeholder="Choose" /></SelectTrigger>
                    <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2"><Label htmlFor="notes">Notes (optional)</Label><Textarea id="notes" className="rounded-none" maxLength={1000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <Button type="submit" disabled={busy} className="rounded-none bg-navy hover:bg-sky md:col-span-2">{busy ? "Submitting…" : "Submit request"}</Button>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
