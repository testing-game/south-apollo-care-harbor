import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Search, UserSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/admin/Pagination";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { ageGenderLabel } from "@/lib/pdf-model";
import { pageRange, patientSearchFilter, serverPageView, type SearchTab } from "@/lib/patient-search";
import { formatDate } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hospital-admin-portal/patients")({ staticData: { sitemap: false }, component: PatientSearch });

type Row = { id: string; number: string; name: string; phone: string; ageSex: string; item: string; date: string; time: string | null; status: string };
type PageResult = { rows: Row[]; total: number };

const TABS: { id: SearchTab; label: string }[] = [
  { id: "appointments", label: "Doctor Appointments" },
  { id: "tests", label: "Test Bookings" },
];

/** Asking past the last row makes the database refuse the page; report the real total so the page can be corrected. */
const OUT_OF_RANGE = "PGRST103";

async function fetchAppointments(term: string, page: number): Promise<PageResult> {
  const { from, to } = pageRange(page);
  const build = () => {
    let q = supabase.from("doctor_appointments").select("id, appointment_number, patient_name, patient_phone, patient_age, patient_gender, appointment_date, appointment_time, status, doctors(name)", { count: "exact" });
    const f = patientSearchFilter(term, "appointment_number");
    if (f) q = q.or(f);
    return q;
  };
  const { data, count, error } = await build().order("created_at", { ascending: false }).range(from, to);
  if (error?.code === OUT_OF_RANGE) return { rows: [], total: (await build().range(0, 0)).count ?? 0 };
  if (error) throw error;
  return {
    total: count ?? 0,
    rows: (data ?? []).map((a) => ({ id: a.id, number: a.appointment_number, name: a.patient_name, phone: a.patient_phone, ageSex: ageGenderLabel(a.patient_age, a.patient_gender), item: a.doctors?.name ?? "—", date: a.appointment_date, time: a.appointment_time, status: a.status })),
  };
}

async function fetchTests(term: string, page: number): Promise<PageResult> {
  const { from, to } = pageRange(page);
  const build = () => {
    let q = supabase.from("test_bookings").select("id, booking_number, patient_name, patient_phone, patient_age, patient_gender, booking_date, status, health_packages(title)", { count: "exact" });
    const f = patientSearchFilter(term, "booking_number");
    if (f) q = q.or(f);
    return q;
  };
  const { data, count, error } = await build().order("created_at", { ascending: false }).range(from, to);
  if (error?.code === OUT_OF_RANGE) return { rows: [], total: (await build().range(0, 0)).count ?? 0 };
  if (error) throw error;
  return {
    total: count ?? 0,
    rows: (data ?? []).map((b) => ({ id: b.id, number: b.booking_number, name: b.patient_name, phone: b.patient_phone, ageSex: ageGenderLabel(b.patient_age, b.patient_gender), item: b.health_packages?.title ?? "—", date: b.booking_date, time: null, status: b.status })),
  };
}

function PatientSearch() {
  const [tab, setTab] = useState<SearchTab>("appointments");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);

  // Wait for a short pause in typing before asking the database.
  useEffect(() => {
    const t = setTimeout(() => { setTerm(search.trim()); setPage(1); }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const appts = useQuery({ queryKey: ["admin", "patient-search", "appointments", term, tab === "appointments" ? page : 1], queryFn: () => fetchAppointments(term, tab === "appointments" ? page : 1), placeholderData: keepPreviousData });
  const tests = useQuery({ queryKey: ["admin", "patient-search", "tests", term, tab === "tests" ? page : 1], queryFn: () => fetchTests(term, tab === "tests" ? page : 1), placeholderData: keepPreviousData });
  const counts: Record<SearchTab, number | undefined> = { appointments: appts.data?.total, tests: tests.data?.total };
  const active = tab === "appointments" ? appts : tests;
  const rows = active.data?.rows ?? [];
  const view = serverPageView(page, active.data?.total ?? 0);

  // If records were removed and this page no longer exists, step back to the last page.
  useEffect(() => {
    if (active.data && page > view.totalPages) setPage(view.totalPages);
  }, [active.data, page, view.totalPages]);

  const switchTab = (t: SearchTab) => { setTab(t); setPage(1); };
  const isTests = tab === "tests";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Patient Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">Complete booking history, newest first. Search by patient name, phone or booking number (SA-A-… / SA-T-…).</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Record type" className="inline-flex w-full rounded-lg border border-line-soft bg-surface-soft p-1 md:w-auto">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => switchTab(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 md:flex-none",
                  on ? "bg-navy text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background hover:text-navy",
                )}
              >
                {t.label}
                <span className={cn("min-w-6 rounded-full px-1.5 py-0.5 text-xs tabular-nums", on ? "bg-primary-foreground/20 text-primary-foreground" : "bg-line-soft text-navy")}>{counts[t.id] ?? "…"}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 pr-9" aria-label="Search patients" placeholder="Name, phone or booking number..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {(active.isFetching || search.trim() !== term) && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-line-soft bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking No.</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Age/Sex</TableHead>
                <TableHead>{isTests ? "Package" : "Doctor"}</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn(active.isPlaceholderData && "opacity-60 transition-opacity")}>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{r.number}</TableCell>
                  <TableCell className="font-medium text-navy">{r.name}</TableCell>
                  <TableCell className="whitespace-nowrap"><a href={`tel:${r.phone}`} className="hover:underline">{r.phone}</a></TableCell>
                  <TableCell className="whitespace-nowrap">{r.ageSex}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(r.date)}{r.time && <p className="text-xs text-muted-foreground">{r.time}</p>}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    {active.isLoading ? "Loading…" : active.isError ? "Couldn't load records. Please refresh and try again." : (
                      <span className="inline-flex flex-col items-center gap-2"><UserSearch className="h-8 w-8 text-sky" />{term ? `No ${isTests ? "test bookings" : "appointments"} match “${term}”.` : `No ${isTests ? "test bookings" : "appointments"} yet.`}</span>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination view={view} onPage={setPage} noun={isTests ? ["booking", "bookings"] : ["appointment", "appointments"]} />
      </div>
    </div>
  );
}
