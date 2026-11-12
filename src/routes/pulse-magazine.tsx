import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Apple, BookOpenText, HeartPulse, Newspaper, Stethoscope, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, meta } from "@/components/site/PageHero";

export const Route = createFileRoute("/pulse-magazine")({
  head: () => meta("South Apollo Pulse Magazine", "South Apollo Pulse — the hospital's health magazine with doctor insights, wellness tips, patient journeys and hospital news."),
  component: PulsePage,
});

const SECTIONS = [
  { icon: Stethoscope, title: "Doctor's Corner", text: "Our consultants explain conditions, treatments and when to seek care." },
  { icon: Apple, title: "Healthy Living", text: "Practical nutrition, fitness and prevention tips for every age." },
  { icon: UsersRound, title: "Patient Journeys", text: "Real recovery stories from patients and families we have cared for." },
  { icon: HeartPulse, title: "Clinical Advances", text: "New services, equipment and techniques arriving at South Apollo." },
  { icon: Newspaper, title: "Hospital Life", text: "Events, health camps, academic news and milestones from campus." },
  { icon: BookOpenText, title: "Medical College", text: "Updates from South Apollo Medical College students and faculty." },
];

function PulsePage() {
  const reduced = useReducedMotion();
  return (
    <main>
      <PageHero crumb="Pulse Magazine" title="South Apollo Pulse Magazine">Our health magazine — trusted medical insight, wellness guidance and stories from the people of South Apollo.</PageHero>

      <section className="container-site grid items-center gap-10 py-14 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky">About the publication</p>
          <h2 className="section-title mt-2">Health knowledge, made for our community</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Pulse brings together the expertise of our doctors, nurses and educators in a clear, readable format — helping patients and families across Barishal Division understand their health and make confident decisions.</p>
        </div>
        <motion.div initial={{ opacity: 0, rotate: reduced ? 0 : -4, y: reduced ? 0 : 20 }} whileInView={{ opacity: 1, rotate: reduced ? 0 : -2, y: 0 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : 0.7 }} className="mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg bg-navy p-6 text-primary-foreground shadow-2xl">
          <div className="flex h-full flex-col justify-between border border-primary-foreground/20 p-4">
            <div><p className="text-xs uppercase tracking-[0.3em] text-sky">South Apollo</p><p className="mt-1 text-5xl font-bold">Pulse</p></div>
            <HeartPulse className="h-16 w-16 text-sky" strokeWidth={1.2} />
            <p className="text-sm leading-snug text-primary-foreground/85">Health · Care · Community</p>
          </div>
        </motion.div>
      </section>

      <section className="bg-surface-soft py-14">
        <div className="container-site">
          <h2 className="section-title">Inside every issue</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map(({ icon: Icon, title, text }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: reduced ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : i * 0.06 }} className="rounded-xl border border-line-soft bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Icon className="h-7 w-7 text-sky" />
                <h3 className="mt-3 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-14 text-center">
        <h2 className="section-title">Issues</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Published issues will be available to read and download here. Until then, catch up on our latest articles and announcements.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full bg-navy px-6 hover:bg-sky"><Link to="/blogs">Read our blogs</Link></Button>
          <Button asChild variant="outline" className="rounded-full px-6"><Link to="/news">News & Media</Link></Button>
        </div>
      </section>
    </main>
  );
}
