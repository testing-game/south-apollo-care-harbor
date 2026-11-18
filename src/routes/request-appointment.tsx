import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Download } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/seo";
import { doctorsQuery, specialityRowsQuery } from "@/lib/public-queries";
import { formatDate, todayInDhaka, upcomingVisitDates } from "@/lib/schedule";
import { downloadSlip } from "@/lib/pdf";
import { SAME_DAY_CUTOFF_MESSAGE, isPastSameDayCutoff, isPublicDateBookable } from "@/lib/booking-cutoff";
import { weekdayName } from "@/lib/pdf-model";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/request-appointment")({
  staticData: { sitemap: true },
  validateSearch: (s: Record<string, unknown>): { doctor?: string | undefined } => ({ doctor: typeof s["doctor"] === "string" ? s["doctor"] : undefined }),
  head: () => pageHead({ path: "/request-appointment", title: "Book Doctor Appointment Online | South Apollo Medical College Hospital, Barishal", description: "Book a doctor appointment online at South Apollo Medical College Hospital, Barishal. Choose a speciality, specialist doctor and visiting day, or call +8801885941937.", keywords: ["Doctor appointment Barishal", "Book doctor online Barishal", "Doctor serial Barishal", "South Apollo appointment"], crumbs: [{name: "Request an Appointment", path: "/request-appointment"}] }),
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
  const [bookedAt, setBookedAt] = useState(() => new Date());
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const withDoctors = specialities.filter((s) => doctors.some((d) => d.speciality_id === s.id));
  const specDoctors = doctors.filter((d) => d.speciality_id === spec);
  const doctor = doctors.find((d) => d.id === doctorId);
  const today = todayInDhaka(now);
  const pastCutoff = isPastSameDayCutoff(now);
  const dates = useMemo(() => (doctor ? upcomingVisitDates(doctor.visiting_days, today, 10) : []), [doctor, today]);
  const firstBookable = dates.find((d) => isPublicDateBookable(d, now)) ?? "";

  // If 9:00 PM passes while today is selected, move the choice to the next bookable visiting day.
  useEffect(() => {
    if (date && !isPublicDateBookable(date, now)) setDate(firstBookable);
  }, [date, now, firstBookable]);
  const step = !spec ? 1 : !doctor ? 2 : !date ? 3 : 4;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = patientSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]!.message); return; }
    const at = new Date();
    if (!isPublicDateBookable(date, at)) { setNow(at); toast.error(SAME_DAY_CUTOFF_MESSAGE); return; }
    setBusy(true);
    const p = parsed.data;
    const { data, error } = await supabase.rpc("book_appointment", { _doctor_id: doctorId, _date: date, _name: p.name, _phone: p.phone, _age: p.age, _gender: p.gender, _notes: p.notes ?? "" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setBookedAt(new Date());
    setDone(data as string);
  }

  function receipt() {
    if (!done || !doctor) return;
    const speciality = specialities.find((s) => s.id === doctor.speciality_id)?.name || doctor.department_name || "—";
    const details: [string, string][] = [
      ["Doctor", doctor.name],
      ["Degrees", doctor.degrees || "—"],
      ["Speciality", speciality],
      ["Visiting Day", weekdayName(date)],
      ["Time Slot", doctor.visiting_hours || "Confirmed by phone"],
      ...(doctor.room_number ? [["Room Number", doctor.room_number] as [string, string]] : []),
      ["Scheduled Date", formatDate(date)],
    ];
    downloadSlip({ kind: "appointment", number: done, status: "pending", bookedAt, patient: { name: form.name.trim(), phone: form.phone.trim(), age: form.age, gender: form.gender }, details, fileName: `${done}.pdf` })
      .catch(() => toast.error("The slip didn't download. Please try again."));
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
          <EmptyState>Online booking opens once doctor schedules are published. Please call +880 1885-941937.</EmptyState>
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
                  {dates.map((d) => {
                    const closed = !isPublicDateBookable(d, now);
                    return (
                      <Button key={d} type="button" disabled={closed} title={closed ? "Same-day online booking closed" : undefined} variant={d === date ? "default" : "outline"} className={`rounded-none ${d === date ? "bg-navy" : ""} ${closed ? "line-through" : ""}`} onClick={() => setDate(d)}>
                        {formatDate(d)}{closed ? " · Closed" : ""}
                      </Button>
                    );
                  })}
                </div>
                {pastCutoff && (
                  <p role="status" className="mt-3 flex items-start gap-2 border-l-4 border-clinical-teal bg-muted px-3 py-2 text-sm text-navy">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-clinical-teal" aria-hidden />
                    <span>{SAME_DAY_CUTOFF_MESSAGE}</span>
                  </p>
                )}
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
