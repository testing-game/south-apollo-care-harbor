import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorCard } from "@/components/site/DoctorCard";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { doctorsQuery, specialityRowsQuery } from "@/lib/public-queries";
import { validateListingSearch } from "@/lib/site-search";

export const Route = createFileRoute("/doctors/")({
  validateSearch: validateListingSearch,
  head: () => meta("Find a Doctor", "Search South Apollo's consultants by name or speciality and book an appointment."),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(doctorsQuery), context.queryClient.ensureQueryData(specialityRowsQuery)]),
  component: DoctorsPage,
});

function DoctorsPage() {
  const { data: doctors } = useSuspenseQuery(doctorsQuery);
  const { data: specialities } = useSuspenseQuery(specialityRowsQuery);
  const { search } = Route.useSearch();
  const [q, setQ] = useState(search ?? "");
  useEffect(() => setQ(search ?? ""), [search]);
  const [spec, setSpec] = useState("all");
  const used = specialities.filter((s) => doctors.some((d) => d.speciality_id === s.id));
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return doctors.filter((d) => (spec === "all" || d.speciality_id === spec) && (!n || `${d.name} ${d.degrees} ${d.department_name} ${d.designation}`.toLowerCase().includes(n)));
  }, [doctors, q, spec]);
  return (
    <main>
      <PageHero crumb="Find a Doctor" title="Our Esteemed Doctors">Search our consultants and book an appointment in a few steps.</PageHero>
      <section className="container-site py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search doctors" placeholder="Search by doctor name, degree or department" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 rounded-none pl-9" />
          </div>
          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger aria-label="Filter by speciality" className="h-11 rounded-none md:w-72"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialities</SelectItem>
              {used.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {list.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>
        ) : (
          <EmptyState>{doctors.length ? "No doctors match your search." : "Doctor profiles will appear here soon."}</EmptyState>
        )}
      </section>
    </main>
  );
}
