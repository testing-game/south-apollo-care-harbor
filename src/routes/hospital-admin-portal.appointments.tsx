import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { adminDoctorsQuery, appointmentsQuery, STATUSES } from "@/lib/admin";
import { downloadManifest } from "@/lib/pdf";
import { todayInDhaka } from "@/lib/schedule";

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

  async function setRowStatus(id: string, s: string) {
    const { error } = await supabase.from("doctor_appointments").update({ status: s }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
  }
  function print() {
    const ids = doctor === "all" ? [...new Set(list.map((a) => a.doctor_id))] : [doctor];
    if (!ids.length) return toast.info("Nothing to print for this day");
    ids.forEach((id) => {
      const d = doctors.find((x) => x.id === id);
      const rows = list.filter((a) => a.doctor_id === id).map((a, i) => [String(i + 1), a.appointment_number, a.patient_name, `${a.patient_age} / ${a.patient_gender[0]!.toUpperCase()}`, a.patient_phone, a.status]);
      void downloadManifest(`OPD Schedule — ${d?.name ?? "Doctor"}${d?.room_number ? ` (Room ${d.room_number})` : ""}`, date, ["#", "Appt No.", "Patient", "Age/Sex", "Phone", "Status"], rows, `opd-${date}-${(d?.name ?? id).replace(/\W+/g, "-")}.pdf`);
    });
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
                <TableCell><StatusSelect value={a.status} onChange={(s) => setRowStatus(a.id, s)} /></TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{isLoading ? "Loading…" : "No appointments for these filters."}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function StatusSelect({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>;
}
