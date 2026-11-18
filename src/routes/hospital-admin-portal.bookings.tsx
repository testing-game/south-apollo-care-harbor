import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/admin/Pagination";
import { supabase } from "@/integrations/supabase/client";
import { adminPackagesQuery, bookingsQuery, STATUSES } from "@/lib/admin";
import { downloadManifest } from "@/lib/pdf";
import { ageGenderLabel } from "@/lib/pdf-model";
import { paginate } from "@/lib/query-inbox";
import { todayInDhaka } from "@/lib/schedule";

const ageGender = (b: { patient_age: number | null; patient_gender: string | null }) => [b.patient_age ?? "", b.patient_gender ?? ""].filter((v) => v !== "").join(" / ") || "—";

export const Route = createFileRoute("/hospital-admin-portal/bookings")({ staticData: { sitemap: false }, component: Bookings });

function Bookings() {
  const [date, setDate] = useState(todayInDhaka());
  const [pkg, setPkg] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(bookingsQuery(date));
  const packages = useQuery(adminPackagesQuery).data ?? [];
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return data.filter((b) => (pkg === "all" || b.package_id === pkg) && (status === "all" || b.status === status) && (!n || `${b.patient_name} ${b.patient_phone} ${b.booking_number}`.toLowerCase().includes(n)));
  }, [data, pkg, status, q]);
  const view = paginate(list, page);
  // Any filter change starts again from page 1.
  const filterBy = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };
  async function setRowStatus(id: string, s: string) {
    const { error } = await supabase.from("test_bookings").update({ status: s }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
  }
  function print() {
    if (!list.length) { toast.info("Nothing to print for these filters"); return; }
    const p = pkg === "all" ? null : packages.find((x) => x.id === pkg);
    const rows = list.map((b) => ({ number: b.booking_number, name: b.patient_name, phone: b.patient_phone, ageGender: ageGenderLabel(b.patient_age, b.patient_gender), item: b.health_packages?.title ?? "", status: b.status }));
    downloadManifest({
      kind: "tests", date, rows,
      filter: p?.title ?? null,
      statusFilter: status === "all" ? null : status,
      search: q.trim() || null,
      fileName: `test-booking-manifest-${date}.pdf`,
    }).catch(() => toast.error("Couldn't create the PDF. Please try again."));
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-navy">Test Bookings</h1><Button onClick={print} className="bg-navy"><Printer /> Print manifest (PDF)</Button></div>
      <div className="grid gap-3 md:grid-cols-4">
        <Input type="date" aria-label="Date" value={date} onChange={(e) => filterBy(setDate)(e.target.value)} />
        <Select value={pkg} onValueChange={filterBy(setPkg)}><SelectTrigger aria-label="Package"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All packages</SelectItem>{packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={filterBy(setStatus)}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
        <Input placeholder="Search name, phone or number" value={q} onChange={(e) => filterBy(setQ)(e.target.value)} />
      </div>
      <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
        <Table>
          <TableHeader><TableRow><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Age / Gender</TableHead><TableHead>Phone</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {view.items.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.booking_number}</TableCell>
                <TableCell>{b.patient_name}{b.notes && <p className="mt-0.5 max-w-xs whitespace-pre-line text-xs text-muted-foreground"><span className="font-semibold">Note:</span> {b.notes}</p>}</TableCell>
                <TableCell>{ageGender(b)}</TableCell>
                <TableCell>{b.patient_phone}</TableCell>
                <TableCell>{b.health_packages?.title}</TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(s) => setRowStatus(b.id, s)}><SelectTrigger className="h-8 w-32 capitalize"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">{isLoading ? "Loading…" : "No bookings for these filters."}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Pagination view={view} onPage={setPage} noun={["booking", "bookings"]} />
      </div>
    </div>
  );
}
