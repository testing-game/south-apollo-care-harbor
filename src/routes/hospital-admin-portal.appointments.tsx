import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageSquareText, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Pagination } from "@/components/admin/Pagination";
import { BookAppointmentDialog, type WalkInBooking } from "@/components/admin/BookAppointmentDialog";
import { adminDoctorsQuery, adminSpecialitiesQuery, appointmentsQuery, STATUSES } from "@/lib/admin";
import { downloadManifest, downloadSlip } from "@/lib/pdf";
import { ageGenderLabel, weekdayName } from "@/lib/pdf-model";
import { paginate } from "@/lib/query-inbox";
import { formatDate, todayInDhaka } from "@/lib/schedule";
import { sendAppointmentSms } from "@/lib/sms.functions";
import type { SmsResult } from "@/lib/sms";
import { walkInResultMessage } from "@/lib/walk-in";

export const Route = createFileRoute("/hospital-admin-portal/appointments")({ staticData: { sitemap: false }, component: Appointments });

function Appointments() {
  const [date, setDate] = useState(todayInDhaka());
  const [doctor, setDoctor] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(appointmentsQuery(date));
  const doctors = useQuery(adminDoctorsQuery).data ?? [];
  const specialities = useQuery(adminSpecialitiesQuery).data ?? [];
  const [booking, setBooking] = useState(false);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return data.filter((a) => (doctor === "all" || a.doctor_id === doctor) && (status === "all" || a.status === status) && (!n || `${a.patient_name} ${a.patient_phone} ${a.appointment_number}`.toLowerCase().includes(n)));
  }, [data, doctor, status, q]);
  const view = paginate(list, page);
  // Any filter change starts again from page 1.
  const filterBy = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };

  const sendSmsFn = useServerFn(sendAppointmentSms);
  const [sending, setSending] = useState<Set<string>>(new Set());

  async function runSms(id: string): Promise<SmsResult> {
    setSending((prev) => new Set(prev).add(id));
    try {
      return await sendSmsFn({ data: { appointmentId: id } });
    } catch {
      return { success: false, message: "The SMS service could not be reached." };
    } finally {
      setSending((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
  }

  async function sendSms(id: string, name: string) {
    const res = await runSms(id);
    if (res.success) toast.success(`Confirmation SMS sent to ${name}`);
    else toast.error(`SMS not sent: ${res.message}`, { description: "The appointment is still confirmed. You can use Resend SMS." });
  }

  function walkInSlip(b: WalkInBooking) {
    const details: [string, string][] = [
      ["Doctor", b.doctor.name],
      ["Degrees", b.doctor.degrees || "—"],
      ["Speciality", b.speciality],
      ["Visiting Day", weekdayName(b.date)],
      ["Time Slot", b.time || "At visiting hours"],
      ...(b.doctor.room_number ? [["Room Number", b.doctor.room_number] as [string, string]] : []),
      ["Scheduled Date", formatDate(b.date)],
    ];
    downloadSlip({ kind: "appointment", number: b.number, status: "confirmed", bookedAt: b.bookedAt, patient: b.patient, details, fileName: `${b.number}.pdf` })
      .catch(() => toast.error("The slip didn't download. Please try again."));
  }

  async function onBooked(b: WalkInBooking) {
    // Show the new row: jump to its date and clear filters that could hide it.
    setDate(b.date); setDoctor("all"); setStatus("all"); setQ("");
    setPage(Number.MAX_SAFE_INTEGER); // newest booking is the last row; paginate() clamps to the last page
    await qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    const id = toast.loading(`Appointment ${b.number} confirmed. Sending SMS…`);
    const m = walkInResultMessage(b.patient.phone, await runSms(b.id));
    const action = { label: "Download Slip (PDF)", onClick: () => walkInSlip(b) };
    if (m.ok) toast.success(m.title, { id, description: `${b.number} · ${b.patient.name}`, action, duration: 15000 });
    else toast.warning(m.title, { id, description: m.description, action, duration: 20000 });
  }

  async function setRowStatus(id: string, s: string, prev: string, name: string) {
    const { error } = await supabase.from("doctor_appointments").update({ status: s }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    if (s === "confirmed" && prev !== "confirmed") void sendSms(id, name);
  }
  function print() {
    if (!list.length) { toast.info("Nothing to print for these filters"); return; }
    const d = doctor === "all" ? null : doctors.find((x) => x.id === doctor);
    const rows = list.map((a) => ({ number: a.appointment_number, name: a.patient_name, phone: a.patient_phone, ageGender: ageGenderLabel(a.patient_age, a.patient_gender), item: a.doctors?.name ?? "", status: a.status }));
    downloadManifest({
      kind: "appointments", date, rows,
      filter: d ? `${d.name}${d.room_number ? ` (Room ${d.room_number})` : ""}` : null,
      statusFilter: status === "all" ? null : status,
      search: q.trim() || null,
      fileName: `appointment-manifest-${date}${d ? `-${d.name.replace(/\W+/g, "-")}` : ""}.pdf`,
    }).catch(() => toast.error("Couldn't create the PDF. Please try again."));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Doctor Appointments</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={print} className="bg-navy"><Printer /> Print manifest (PDF)</Button>
          <Button onClick={() => setBooking(true)} className="bg-sky font-semibold text-navy-deep shadow-sm hover:bg-sky/85"><Plus /> Book Appointment</Button>
        </div>
      </div>
      <BookAppointmentDialog open={booking} onOpenChange={setBooking} defaultDate={date} doctors={doctors} specialities={specialities} onBooked={(b) => void onBooked(b)} />
      <div className="grid gap-3 md:grid-cols-4">
        <Input type="date" aria-label="Date" value={date} onChange={(e) => filterBy(setDate)(e.target.value)} />
        <Select value={doctor} onValueChange={filterBy(setDoctor)}><SelectTrigger aria-label="Doctor"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All doctors</SelectItem>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={filterBy(setStatus)}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
        <Input placeholder="Search name, phone or number" value={q} onChange={(e) => filterBy(setQ)(e.target.value)} />
      </div>
      <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
        <Table>
          <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Phone</TableHead><TableHead>Age/Sex</TableHead><TableHead>Doctor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {view.items.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-xs">{a.appointment_number}</TableCell>
                <TableCell>{a.patient_name}{a.notes && <p className="text-xs text-muted-foreground">{a.notes}</p>}</TableCell>
                <TableCell>{a.patient_phone}</TableCell>
                <TableCell>{a.patient_age} / {a.patient_gender}</TableCell>
                <TableCell>{a.doctors?.name}{a.appointment_time && <p className="text-xs text-muted-foreground">{a.appointment_time}</p>}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusSelect value={a.status} onChange={(s) => setRowStatus(a.id, s, a.status, a.patient_name)} />
                    {a.status === "confirmed" && (
                      <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5 px-2.5 text-xs" disabled={sending.has(a.id)} onClick={() => sendSms(a.id, a.patient_name)} aria-label={`Resend SMS to ${a.patient_name}`}>
                        {sending.has(a.id) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquareText className="h-3.5 w-3.5" />}
                        {sending.has(a.id) ? "Sending…" : "Resend SMS"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{isLoading ? "Loading…" : "No appointments for these filters."}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Pagination view={view} onPage={setPage} noun={["appointment", "appointments"]} />
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>;
}
