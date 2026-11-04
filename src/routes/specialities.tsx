import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecialityCard } from "@/components/specialities/SpecialityCard";
import { filterSpecialities } from "@/lib/specialities";

export const Route = createFileRoute("/specialities")({
  head: () => ({ meta: [
    { title: "Our All Specialities | South Apollo Medical College Hospital" },
    { name: "description", content: "Explore and search the medical specialities at South Apollo Medical College Hospital, from emergency and cardiac care to paediatrics and diagnostics." },
    { property: "og:title", content: "Our All Specialities | South Apollo Medical College Hospital" },
    { property: "og:description", content: "Browse the complete medical specialities directory and find the care you are looking for." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SpecialitiesPage,
});

function SpecialitiesPage() {
  const [query, setQuery] = useState("");
  const reducedMotion = useReducedMotion();
  const specialities = filterSpecialities(query);
  return (
    <main className="container-site bg-background pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-center">
        <h1 className="section-title">Our All Specialities</h1>
        <div role="search" className="flex h-11 w-full items-center gap-2 border border-navy/60 bg-background px-3 text-navy shadow-sm focus-within:ring-2 focus-within:ring-sky md:w-80">
          <input type="search" aria-label="Search Speciality" placeholder="Search Speciality" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-navy [&::-webkit-search-cancel-button]:hidden" />
          {query ? <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear speciality search" onClick={() => setQuery("")}><X /></Button> : <Search aria-hidden="true" className="h-4 w-4 shrink-0" />}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{specialities.length} specialities found</div>
      {specialities.length ? <div aria-label="All specialities" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {specialities.map((speciality) => <motion.div key={speciality.title} layout={!reducedMotion} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><SpecialityCard speciality={speciality} /></motion.div>)}
      </div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="flex min-h-72 items-center justify-center border-y border-line-soft text-muted-foreground"><p>No specialities found</p></motion.div>}
    </main>
  );
}