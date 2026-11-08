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
import { adminPackagesQuery, bookingsQuery, STATUSES } from "@/lib/admin";
import { downloadManifest } from "@/lib/pdf";
import { todayInDhaka } from "@/lib/schedule";

export const Route = createFileRoute("/hospital-admin-portal/bookings")({ component: Bookings });

function Bookings() {
  const [date, setDate] = useState(todayInDhaka());
  const [pkg, setPkg] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(bookingsQuery(date));
  const packages = useQuery(adminPackagesQuery).data ?? [];
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return data.filter((b) => (pkg === "all" || b.package_id === pkg) && (status === "all" || b.status === status) && (!n || `${b.patient_name} ${b.patient_phone} ${b.booking_number}`.toLowerCase().includes(n)));
  }, [data, pkg, status, q]);
  async function setRowStatus(id: string, s: string) {
    const { error } = await supabase.from("test_bookings").update({ status: s }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
  }
  const print = () => downloadManifest("Daily Test Booking Sheet", date, ["#", "Booking No.", "Patient", "Phone", "Package", "Status"], list.map((b, i) => [String(i + 1), b.booking_number, b.patient_name, b.patient_phone, b.health_packages?.title ?? "", b.status]), `tests-${date}.pdf`);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-navy">Test Bookings</h1><Button onClick={print} className="bg-navy"><Printer /> Print daily sheet (PDF)</Button></div>
      <div className="grid gap-3 md:grid-cols-4">
        <Input type="date" aria-label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Select value={pkg} onValueChange={setPkg}><SelectTrigger aria-label="Package"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All packages</SelectItem>{packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
        <Input placeholder="Search name, phone or number" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
        <Table>
          <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Phone</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.booking_number}</TableCell>
                <TableCell>{b.patient_name}</TableCell>
                <TableCell>{b.patient_phone}</TableCell>
                <TableCell>{b.health_packages?.title}</TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(s) => setRowStatus(b.id, s)}><SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">{isLoading ? "Loading…" : "No bookings for these filters."}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
