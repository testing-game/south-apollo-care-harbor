import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { BriefcaseMedical, FileText, GraduationCap, HeartHandshake, Mail, Microscope, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, meta } from "@/components/site/PageHero";

export const Route = createFileRoute("/career")({
  head: () => meta("Career & Recruitment", "Build your career in medicine, nursing and hospital services at South Apollo Medical College Hospital, Barishal."),
  component: CareerPage,
});

const CAREER_EMAIL = "info@southapollomedicalcollegehospital.com";

const AREAS = [
  { icon: Stethoscope, title: "Doctors & Consultants", text: "Consultants, medical officers and residents across our clinical departments." },
  { icon: HeartHandshake, title: "Nursing", text: "Registered nurses and nursing staff for wards, ICU, OT and emergency care." },
  { icon: Microscope, title: "Diagnostics & Allied Health", text: "Laboratory, imaging, pharmacy, physiotherapy and technical roles." },
  { icon: GraduationCap, title: "Medical College Faculty", text: "Teaching and academic positions with South Apollo Medical College." },
  { icon: Users, title: "Administration & Support", text: "Patient services, finance, IT, front desk and facility management." },
  { icon: BriefcaseMedical, title: "Internships", text: "Clinical internships and training placements for graduates." },
];

const STEPS = [
  "Prepare an up-to-date CV with your qualifications, registration (BMDC/BNMC where applicable) and experience.",
  "Email it with the position or department you are interested in as the subject line.",
  "Our HR team reviews every application and contacts shortlisted candidates for interview.",
];

function CareerPage() {
  const reduced = useReducedMotion();
  const fade = (i: number) => ({ initial: { opacity: 0, y: reduced ? 0 : 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.06 } });
  return (
    <main>
      <PageHero crumb="Career" title="Career & Recruitment">Join a team dedicated to bringing advanced, compassionate healthcare and medical education to Barishal Division.</PageHero>

      <section className="container-site py-14">
        <h2 className="section-title">Where you can make a difference</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(({ icon: Icon, title, text }, i) => (
            <motion.div key={title} {...fade(i)} className="rounded-xl border border-line-soft bg-background p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-primary-foreground"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface-soft py-14">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Open positions</h2>
            <div className="mt-6 rounded-xl border border-dashed border-line-soft bg-background p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-sky" />
              <p className="mt-3 font-bold text-navy">No positions are listed right now</p>
              <p className="mt-2 text-sm text-muted-foreground">New openings will be posted here. You can still send your CV and we'll keep it on file for future roles.</p>
            </div>
          </div>
          <div>
            <h2 className="section-title">Submit your CV</h2>
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky text-sm font-bold text-primary-foreground">{i + 1}</span><p className="pt-1 text-sm leading-relaxed text-navy">{s}</p></li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-navy px-6 hover:bg-sky"><a href={`mailto:${CAREER_EMAIL}?subject=${encodeURIComponent("Job Application – ")}`}><Mail /> Email your CV</a></Button>
              <Button asChild variant="outline" className="rounded-full px-6"><Link to="/send-query">Ask HR a question</Link></Button>
            </div>
            <p className="mt-3 break-all text-xs text-muted-foreground">{CAREER_EMAIL}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
