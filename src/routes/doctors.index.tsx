import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorCard } from "@/components/site/DoctorCard";
import { EmptyState, PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/seo";
import { doctorsQuery, specialityRowsQuery } from "@/lib/public-queries";
import { findSpecialityByParam } from "@/lib/specialities";
import { validateDoctorSearch, withSpeciality } from "@/lib/site-search";

export const Route = createFileRoute("/doctors/")({
  staticData: { sitemap: true },
  validateSearch: validateDoctorSearch,
  head: () => pageHead({ path: "/doctors", title: "Find a Doctor | Specialist Doctors in Barishal | South Apollo Medical College Hospital", description: "Search specialist doctors in Barishal by name or department at South Apollo Medical College Hospital, see their consultation days and book an appointment online.", keywords: ["Find a doctor Barishal", "Best doctors in Barishal", "Consultant doctors Barishal", "South Apollo doctors"], crumbs: [{name: "Find a Doctor", path: "/doctors"}] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(doctorsQuery), context.queryClient.ensureQueryData(specialityRowsQuery)]),
  component: DoctorsPage,
});

function DoctorsPage() {
  const { data: doctors } = useSuspenseQuery(doctorsQuery);
  const { data: specialities } = useSuspenseQuery(specialityRowsQuery);
  const { search: searchParam, speciality: specialityParam } = Route.useSearch();
  const [q, setQ] = useState(searchParam ?? "");
  useEffect(() => setQ(searchParam ?? ""), [searchParam]);
  const navigate = useNavigate();
  const used = useMemo(() => specialities.filter((s) => doctors.some((d) => d.speciality_id === s.id)), [specialities, doctors]);
  // ?speciality=<name> from a speciality card selects the same filter the dropdown offers.
  const matched = useMemo(() => findSpecialityByParam(specialities, specialityParam), [specialities, specialityParam]);
  const options = useMemo(() => (matched && !used.some((s) => s.id === matched.id) ? [...used, matched] : used), [used, matched]);
  // A ?speciality= value that names nothing must not stay in the address bar.
  useEffect(() => {
    if (specialityParam && !matched) void navigate({ to: "/doctors", search: (prev) => withSpeciality(prev, null), replace: true });
  }, [specialityParam, matched, navigate]);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return doctors.filter((d) => (!matched || d.speciality_id === matched.id) && (!n || `${d.name} ${d.degrees} ${d.department_name} ${d.designation}`.toLowerCase().includes(n)));
  }, [doctors, q, matched]);
  function chooseSpeciality(value: string) {
    void navigate({ to: "/doctors", search: (prev) => withSpeciality(prev, value === "all" ? null : value) });
  }
  return (
    <main>
      <PageHero crumb="Find a Doctor" title="Our Esteemed Doctors">Search our consultants and book an appointment in a few steps.</PageHero>
      <section className="container-site py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search doctors" placeholder="Search by doctor name, degree or department" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 rounded-none pl-9" />
          </div>
          <Select value={matched?.name ?? "all"} onValueChange={chooseSpeciality}>
            <SelectTrigger aria-label="Filter by speciality" className="h-11 rounded-none md:w-72"><SelectValue>{matched?.name ?? "All specialities"}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialities</SelectItem>
              {options.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {list.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>
        ) : (
          <EmptyState>{matched ? `No doctors are listed under ${matched.name} yet.` : doctors.length ? "No doctors match your search." : "Doctor profiles will appear here soon."}</EmptyState>
        )}
      </section>
    </main>
  );
}
