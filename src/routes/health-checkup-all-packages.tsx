import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/seo";
import { PackageCard } from "@/components/site/PackageCard";
import { packagesQuery } from "@/lib/public-queries";
import { filterPackages, homeCardImage, splitPackageTitle } from "@/lib/packages";
import { validateListingSearch } from "@/lib/site-search";

export const Route = createFileRoute("/health-checkup-all-packages")({
  staticData: { sitemap: true },
  validateSearch: validateListingSearch,
  head: () => pageHead({ path: "/health-checkup-all-packages", title: "Health Checkup Packages in Barishal | South Apollo Medical College Hospital", description: "Compare health checkup packages in Barishal at South Apollo Medical College Hospital. Search packages by test name and book your preventive check-up online.", keywords: ["Health checkup Barishal", "Full body checkup Barishal", "Medical checkup packages", "South Apollo health packages"], crumbs: [{name: "Health Check Packages", path: "/health-checkup-all-packages"}] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(packagesQuery),
  component: PackagesPage,
});

function PackagesPage() {
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const { search } = Route.useSearch();
  const [query, setQuery] = useState(search ?? "");
  useEffect(() => setQuery(search ?? ""), [search]);
  const reduced = useReducedMotion();
  const list = filterPackages(packages, query);
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.08 } } };
  const item: Variants = { hidden: { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] } } };
  return (
    <main className="bg-background">
      <PageHero crumb="Health Check Packages" title="Health Check Packages">Preventive check-ups designed for every age and need.</PageHero>
      <section className="specialities-directory pb-16 pt-10 md:pb-20 md:pt-14">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center md:gap-8">
          <h2 className="text-[28px] font-bold leading-tight text-speciality-active md:text-[39px]">All Packages</h2>
          <div role="search" className="speciality-search flex h-[50px] w-full shrink-0 items-center gap-2 border border-speciality-active bg-background px-[17px] text-speciality-active focus-within:ring-2 focus-within:ring-sky md:w-[300px] lg:w-[380px]">
            <input type="search" aria-label="Search Package or Test" placeholder="Search Package or Test..." value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-speciality-active [&::-webkit-search-cancel-button]:hidden" />
            {query ? <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear package search" onClick={() => setQuery("")}><X /></Button> : <Search aria-hidden="true" className="h-5 w-5 shrink-0" />}
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{list.length} packages found</div>
        {list.length ? (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => <motion.div key={p.id} variants={item} layout={!reduced} className="h-full"><PackageCard id={p.id} image={homeCardImage(p)} {...splitPackageTitle(p.title)} /></motion.div>)}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-72 flex-col items-center justify-center gap-2 border-y border-line-soft text-center text-muted-foreground">
            <Search className="h-8 w-8 text-sky" aria-hidden="true" />
            <p className="font-semibold text-navy">{packages.length ? "No packages or tests match your search" : "Packages will be listed here soon."}</p>
            {packages.length > 0 && <Button variant="link" className="text-sky" onClick={() => setQuery("")}>Show all packages</Button>}
          </motion.div>
        )}
      </section>
    </main>
  );
}
