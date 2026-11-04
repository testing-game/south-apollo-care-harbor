import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Activity, BedDouble, CalendarDays, ChevronRight, GraduationCap, HeartPulse, MapPin, ScanLine, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import campus from "@/assets/about-campus-illustration.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Us | South Apollo Medical College Hospital" },
    { name: "description", content: "Discover South Apollo Medical College Hospital in Jagua, Barishal Sadar: 250-bed healthcare, 24/7 emergency services and medical education since 2018." },
    { property: "og:title", content: "About South Apollo Medical College Hospital" },
    { property: "og:description", content: "Pioneering healthcare and medical education in Southern Bangladesh since 2018." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});

const capabilities = [
  { icon: Activity, title: "24/7 Emergency & Trauma Care", description: "Always operational round-the-clock to manage critical emergencies and urgent medical needs." },
  { icon: Stethoscope, title: "Outpatient & Inpatient Services (OPD & IPD)", description: "Specialized specialist consultations in the outpatient department alongside comfortable, well-equipped 250-bed inpatient care." },
  { icon: ScanLine, title: "Modern Diagnostic Wing", description: "Precision diagnostics featuring high-resolution Digital Radiography (X-ray) and modern pathological laboratory setups." },
  { icon: HeartPulse, title: "Specialized Packages & Maternal Health", description: "Targeted healthcare packages, maternal and infant care, and cutting-edge medical technologies." },
  { icon: GraduationCap, title: "Medical Education & Internship Training", description: "An active practical training environment shaping the next generation of healthcare professionals and interns." },
];

function AboutPage() {
  const reducedMotion = useReducedMotion();
  const reveal: Variants = { hidden: { opacity: 0, y: reducedMotion ? 0 : 22 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.6 } } };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } } };
  return (
    <main className="bg-background">
      <section className="relative isolate overflow-hidden bg-navy-deep text-primary-foreground">
        <img src={campus} alt="" width={1440} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="bg-about-overlay absolute inset-0 -z-10" />
        <motion.div initial="hidden" animate="visible" variants={stagger} className="container-site py-9 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm">
            <Button asChild variant="link" className="h-auto p-0 font-normal text-primary-foreground"><Link to="/">Home</Link></Button><ChevronRight className="h-4 w-4 text-sky" /><span aria-current="page">About Us</span>
          </nav>
          <motion.p variants={reveal} className="mb-4 text-sm font-semibold text-sky">South Apollo Medical College Hospital</motion.p>
          <motion.h1 variants={reveal} className="max-w-4xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">Pioneering Healthcare &amp; Medical Education in Southern Bangladesh</motion.h1>
          <motion.p variants={reveal} className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">The only private medical college and 250-bed multi-specialty hospital serving the people of Barishal Division since 2018.</motion.p>
        </motion.div>
      </section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="container-site grid items-center gap-9 py-14 md:py-20 lg:grid-cols-2 lg:gap-14">
        <motion.figure variants={reveal}>
          <img src={campus} alt="Illustrative medical campus with hospital buildings, landscaped grounds and healthcare professionals" loading="lazy" width={1440} height={1024} className="aspect-[4/3] w-full rounded-lg border border-line-soft object-cover" />
          <figcaption className="mt-3 text-xs text-muted-foreground">Illustrative campus concept · Not a photograph of the hospital</figcaption>
        </motion.figure>
        <motion.div variants={reveal}>
          <p className="mb-3 text-sm font-semibold text-clinical-teal">Our foundation</p>
          <h2 className="section-title">Rooted in Barishal.<br />Dedicated to its people.</h2>
          <div className="mt-7 space-y-7 text-sm leading-[1.85] text-muted-foreground md:text-base">
            <div><h3 className="mb-2 text-lg font-semibold text-navy">Location &amp; Establishment</h3><p>Established in Jagua, Barishal Sadar, with the primary vision of delivering accessible, high-standard healthcare directly to the people of the southern region while fostering clinical education.</p></div>
            <div><h3 className="mb-2 text-lg font-semibold text-navy">Development &amp; Expansion</h3><p>Continuous phased development since 2018, expanding infrastructure and institutional capacity to serve both as a major treatment center and a premier medical training facility.</p></div>
          </div>
        </motion.div>
      </motion.section>

      <section className="bg-surface-soft py-14 md:py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger} className="container-site">
          <motion.div variants={reveal} className="mb-8"><p className="mb-3 text-sm font-semibold text-clinical-teal">Care, expertise &amp; education</p><h2 className="section-title">Clinical Services &amp; Core Capabilities</h2></motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => <motion.article key={title} variants={reveal} className="rounded-lg border border-line-soft bg-card p-6 transition-shadow duration-300 hover:shadow-card"><div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-clinical-tint text-clinical-teal"><Icon className="h-6 w-6" strokeWidth={1.6} /></div><h3 className="text-lg font-semibold leading-snug text-card-foreground">{title}</h3><p className="mt-3 text-sm leading-[1.8] text-muted-foreground">{description}</p></motion.article>)}
          </div>
        </motion.div>
      </section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger} className="container-site py-14 md:py-20">
        <motion.h2 variants={reveal} className="section-title mb-8">Institutional Overview</motion.h2>
        <div className="grid gap-7 border-y border-line-soft py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[{ icon: BedDouble, value: "250 Beds", label: "Inpatient capacity" }, { icon: CalendarDays, value: "2018", label: "Year founded" }, { icon: MapPin, value: "Jagua", label: "Barishal Sadar" }, { icon: ShieldCheck, value: "DGHS Approved", label: "Directorate General of Health Services" }].map(({ icon: Icon, value, label }) => <motion.div key={value} variants={reveal}><Icon className="mb-4 h-6 w-6 text-clinical-teal" /><p className="text-2xl font-bold text-navy">{value}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{label}</p></motion.div>)}
        </div>
      </motion.section>
    </main>
  );
}