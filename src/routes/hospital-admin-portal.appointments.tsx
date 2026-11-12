import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageSquareText, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { adminDoctorsQuery, appointmentsQuery, STATUSES } from "@/lib/admin";
import { downloadManifest } from "@/lib/pdf";
import { ageGenderLabel } from "@/lib/pdf-model";
import { todayInDhaka } from "@/lib/schedule";
import { sendAppointmentSms } from "@/lib/sms.functions";

export const Route = createFileRoute("/hospital-admin-portal/appointments")({ component: Appointments });

function Appointments() {
  const [date, setDate] = useState(todayInDhaka());
  const [doctor, setDoctor] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(appointmentsQuery(date));
  const doctors = useQuery(adminDoctorsQuery).data ?? [];
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return data.filter((a) => (doctor === "all" || a.doctor_id === doctor) && (status === "all" || a.status === status) && (!n || `${a.patient_name} ${a.patient_phone} ${a.appointment_number}`.toLowerCase().includes(n)));
  }, [data, doctor, status, q]);

  const sendSmsFn = useServerFn(sendAppointmentSms);
  const [sending, setSending] = useState<Set<string>>(new Set());

  async function sendSms(id: string, name: string) {
    setSending((prev) => new Set(prev).add(id));
    try {
      const res = await sendSmsFn({ data: { appointmentId: id } });
      if (res.success) toast.success(`Confirmation SMS sent to ${name}`);
      else toast.error(`SMS not sent: ${res.message}`, { description: "The appointment is still confirmed. You can use Resend SMS." });
    } catch {
      toast.error("SMS not sent: the SMS service could not be reached.", { description: "The appointment is still confirmed. You can use Resend SMS." });
    } finally {
      setSending((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
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
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-navy">Doctor Appointments</h1><Button onClick={print} className="bg-navy"><Printer /> Print manifest (PDF)</Button></div>
      <div className="grid gap-3 md:grid-cols-4">
        <Input type="date" aria-label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Select value={doctor} onValueChange={setDoctor}><SelectTrigger aria-label="Doctor"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All doctors</SelectItem>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
        <Input placeholder="Search name, phone or number" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
        <Table>
          <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Phone</TableHead><TableHead>Age/Sex</TableHead><TableHead>Doctor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono text-xs">{a.appointment_number}</TableCell>
                <TableCell>{a.patient_name}{a.notes && <p className="text-xs text-muted-foreground">{a.notes}</p>}</TableCell>
                <TableCell>{a.patient_phone}</TableCell>
                <TableCell>{a.patient_age} / {a.patient_gender}</TableCell>
                <TableCell>{a.doctors?.name}</TableCell>
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
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>;
}
