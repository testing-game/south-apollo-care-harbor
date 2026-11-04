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
    <main className="specialities-directory bg-background pb-16 pt-8 md:pb-20">
      <div className="mb-10 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-center md:gap-8">
        <h1 className="pb-4 text-[28px] font-bold leading-tight text-speciality-active md:text-[39px]">Our All Specialities</h1>
        <div role="search" className="speciality-search flex h-[50px] w-full shrink-0 items-center gap-2 border border-speciality-active bg-background px-[17px] text-speciality-active focus-within:ring-2 focus-within:ring-sky md:w-[300px] lg:w-[380px]">
          <input type="search" aria-label="Search Speciality" placeholder="Search Speciality" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-speciality-active [&::-webkit-search-cancel-button]:hidden" />
          {query ? <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear speciality search" onClick={() => setQuery("")}><X /></Button> : <Search aria-hidden="true" className="h-5 w-5 shrink-0" />}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{specialities.length} specialities found</div>
      {specialities.length ? <div aria-label="All specialities" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {specialities.map((speciality) => <motion.div key={speciality.title} layout={!reducedMotion} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><SpecialityCard speciality={speciality} directory /></motion.div>)}
      </div> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="flex min-h-72 items-center justify-center border-y border-line-soft text-muted-foreground"><p>No specialities found</p></motion.div>}
    </main>
  );
}