import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SpecialityCard } from "@/components/specialities/SpecialityCard";
import { specialityBatch, specialityPageCount, type Speciality } from "@/lib/specialities";
import specialitiesDoctorPatient from "@/assets/specialities-doctor-patient.jpg";

export function WhyChoose() {
  return (
    <section className="container-site py-14 text-center md:py-20">
      <h2 className="section-title">Why Choose South Apollo Medical College Hospital</h2>
      <div className="mx-auto mt-6 max-w-4xl space-y-5 text-sm leading-[1.85] text-navy md:text-base">
        <p>Established in 2018 in Jagua, Barishal Sadar, South Apollo Medical College &amp; Hospital is dedicated to delivering world-class, accessible healthcare and advancing medical education across the Barishal Division.</p>
        <p>With a comprehensive 250-bed modern facility, advanced diagnostic technology including Digital Radiography (X-ray), and round-the-clock 24/7 emergency response, our hospital stands as a premier center of clinical excellence and medical training in the southern region.</p>
      </div>
    </section>
  );
}

export function Specialities({ specialities }: { specialities: Speciality[] }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const lastPage = specialityPageCount(specialities) - 1;
  function changePage(next: number) {
    setDirection(next > page ? 1 : -1);
    setPage(Math.max(0, Math.min(lastPage, next)));
  }
  return (
    <section aria-label="Our Specialities" className="container-site grid gap-8 pb-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-8">
      <img src={specialitiesDoctorPatient} alt="Doctor consulting with a patient" loading="lazy" width={960} height={1200} className="aspect-[4/3] w-full rounded-xl object-cover lg:aspect-auto lg:h-full lg:max-h-[440px]" />
      <div className="min-w-0">
        <h2 className="section-title">Our Specialities</h2>
        <div className="mt-6 overflow-hidden p-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={page} initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : direction * 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -direction * 20 }} transition={{ duration: reducedMotion ? 0 : 0.18 }} aria-label="Specialities batch" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specialityBatch(specialities, page).map((speciality) => <SpecialityCard key={speciality.id} speciality={speciality} />)}
            </motion.div>
          </AnimatePresence>
          {!specialities.length && <p className="py-10 text-center text-sm text-muted-foreground">Our specialities will appear here soon.</p>}
        </div>
        <p className="sr-only" aria-live="polite">Specialities page {page + 1} of {lastPage + 1}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" disabled={page === 0} onClick={() => changePage(page - 1)} aria-label="Previous specialities" className="h-8 w-8 rounded-full border-2 border-lime text-lime"><ArrowLeft /></Button>
            <Button variant="outline" size="icon" disabled={page === lastPage} onClick={() => changePage(page + 1)} aria-label="Next specialities" className="h-8 w-8 rounded-full border-2 border-lime text-lime"><ArrowRight /></Button>
          </div>
          <Button asChild className="rounded-none bg-violet px-4 text-xs font-semibold text-primary-foreground hover:bg-violet/90 sm:px-6"><Link to="/specialities">View All Specialities</Link></Button>
        </div>
      </div>
    </section>
  );
}
