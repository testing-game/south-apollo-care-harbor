import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecialityCard } from "@/components/specialities/SpecialityCard";
import { filterSpecialities, toSpeciality } from "@/lib/specialities";
import { specialityRowsQuery } from "@/lib/public-queries";
import { validateListingSearch } from "@/lib/site-search";
import campus from "@/assets/about-campus-illustration.jpg";

export const Route = createFileRoute("/specialities")({
  validateSearch: validateListingSearch,
  head: () => ({ meta: [
    { title: "Our All Specialities | South Apollo Medical College Hospital" },
    { name: "description", content: "Explore and search the medical specialities at South Apollo Medical College Hospital, from emergency and cardiac care to paediatrics and diagnostics." },
    { property: "og:title", content: "Our All Specialities | South Apollo Medical College Hospital" },
    { property: "og:description", content: "Browse the complete medical specialities directory and find the care you are looking for." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(specialityRowsQuery),
  component: SpecialitiesPage,
});

function SpecialitiesPage() {
  const { search } = Route.useSearch();
  const [query, setQuery] = useState(search ?? "");
  useEffect(() => setQuery(search ?? ""), [search]);
  const reducedMotion = useReducedMotion();
  const { data: rows } = useSuspenseQuery(specialityRowsQuery);
  const all = useMemo(() => rows.map(toSpeciality), [rows]);
  const specialities = filterSpecialities(all, query);
  const reveal: Variants = { hidden: { opacity: 0, y: reducedMotion ? 0 : 22 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.6 } } };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } } };
  return (
    <main className="bg-background">
      <section className="relative isolate overflow-hidden bg-navy-deep text-primary-foreground">
        <img src={campus} alt="" width={1440} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="bg-about-overlay absolute inset-0 -z-10" />
        <motion.div initial="hidden" animate="visible" variants={stagger} className="container-site py-9 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm">
            <Button asChild variant="link" className="h-auto p-0 font-normal text-primary-foreground"><Link to="/">Home</Link></Button><ChevronRight className="h-4 w-4 text-sky" /><span aria-current="page">Specialities</span>
          </nav>
          <motion.p variants={reveal} className="mb-4 text-sm font-semibold text-sky">South Apollo Medical College Hospital</motion.p>
          <motion.h1 variants={reveal} className="max-w-4xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">Specialised Healthcare &amp; Clinical Excellence</motion.h1>
          <motion.p variants={reveal} className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">Explore our multidisciplinary departments and specialized care units dedicated to providing comprehensive medical treatments across Barishal Division.</motion.p>
        </motion.div>
      </section>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="specialities-directory container-site pb-16 pt-10 md:pb-20 md:pt-14">
        <motion.div variants={reveal} className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-center md:gap-8">
          <h2 className="pb-4 text-[28px] font-bold leading-tight text-speciality-active md:text-[39px]">Our All Specialities</h2>
          <div role="search" className="speciality-search flex h-[50px] w-full shrink-0 items-center gap-2 border border-speciality-active bg-background px-[17px] text-speciality-active focus-within:ring-2 focus-within:ring-sky md:w-[300px] lg:w-[380px]">
            <input type="search" aria-label="Search Speciality" placeholder="Search Speciality" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-speciality-active [&::-webkit-search-cancel-button]:hidden" />
            {query ? <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear speciality search" onClick={() => setQuery("")}><X /></Button> : <Search aria-hidden="true" className="h-5 w-5 shrink-0" />}
          </div>
        </motion.div>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{specialities.length} specialities found</div>
        {specialities.length ? <div aria-label="All specialities" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {specialities.map((speciality) => <motion.div key={speciality.id} layout={!reducedMotion} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><SpecialityCard speciality={speciality} directory /></motion.div>)}
        </div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="flex min-h-72 items-center justify-center border-y border-line-soft text-muted-foreground"><p>No specialities found</p></motion.div>}
      </motion.div>
    </main>
  );
}
