import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CalendarClock, ClipboardList, GraduationCap, Mail, Search, Users, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHero, meta } from "@/components/site/PageHero";
import { jobCircularsQuery } from "@/lib/public-queries";
import type { JobCircular } from "@/lib/public-data.functions";
import { ALL_DEPARTMENTS, DEPARTMENTS, HR_EMAIL, applyMailto, deadlineBadge, departmentLabel, employmentLabel, filterCirculars, isDepartment, toBlocks, type Department } from "@/lib/careers";
import { todayInDhaka } from "@/lib/schedule";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career")({
  validateSearch: (search: Record<string, unknown>): { department?: Department } => (isDepartment(search["department"]) ? { department: search["department"] } : {}),
  head: () => meta("Career & Job Circulars", "Explore current job openings for doctors, nurses, diagnostics and support staff at South Apollo Medical College Hospital, Barishal, and apply online."),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobCircularsQuery),
  component: CareerPage,
  errorComponent: ({ error }) => <main className="container-site py-16 text-center text-muted-foreground">Job circulars could not be loaded. {error instanceof Error ? error.message : String(error)}</main>,
  notFoundComponent: () => <main className="container-site py-16 text-center text-muted-foreground">No job circulars found.</main>,
});

const TABS = [{ id: ALL_DEPARTMENTS, label: "All" }, ...DEPARTMENTS];

function CareerPage() {
  const { data: circulars } = useSuspenseQuery(jobCircularsQuery);
  const { department = ALL_DEPARTMENTS } = Route.useSearch();
  const navigate = useNavigate({ from: "/career" });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<JobCircular | null>(null);
  const reduced = useReducedMotion();
  const today = todayInDhaka();
  const list = filterCirculars(circulars, query, department);
  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, filterCirculars(circulars, query, t.id).length])), [circulars, query]);
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.07 } } };
  const item: Variants = { hidden: { opacity: 0, y: reduced ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] } } };
  const setDepartment = (id: string) => navigate({ search: isDepartment(id) ? { department: id } : {}, replace: true, resetScroll: false });

  return (
    <main className="bg-background">
      <PageHero crumb="Career" title="Build Your Healthcare Career with South Apollo">Explore current job openings and join our dedicated team of doctors, nurses, and medical professionals in Barishal.</PageHero>

      <section className="container-site py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[28px] font-bold leading-tight text-navy md:text-[36px]">Current Job Circulars</h2>
            <p className="mt-2 text-sm text-muted-foreground">{circulars.length ? `${circulars.length} open position${circulars.length === 1 ? "" : "s"} accepting applications` : "New openings are posted here as soon as they are announced."}</p>
          </div>
          <div role="search" className="flex h-12 w-full shrink-0 items-center gap-2 rounded-full border border-line-soft bg-background px-5 text-navy shadow-sm focus-within:ring-2 focus-within:ring-sky md:w-[340px]">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input type="search" aria-label="Search job circulars" placeholder="Search job title or qualification…" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden" />
            {query && <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear search" onClick={() => setQuery("")}><X /></Button>}
          </div>
        </div>

        <div role="tablist" aria-label="Departments" className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {TABS.map((t) => {
            const active = department === t.id;
            return (
              <button key={t.id} role="tab" aria-selected={active} onClick={() => setDepartment(t.id)} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200", active ? "border-navy bg-navy text-primary-foreground" : "border-line-soft bg-background text-navy hover:border-sky hover:text-sky")}>
                {t.label}
                <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-sky text-primary-foreground" : "bg-surface-soft text-muted-foreground")}>{counts[t.id]}</span>
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="sr-only">{list.length} job circulars shown</div>
        {list.length ? (
          <motion.div key={department} initial="hidden" animate="visible" variants={stagger} className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => <motion.div key={c.id} variants={item} className="h-full"><JobCard job={c} today={today} onOpen={() => setOpen(c)} /></motion.div>)}
          </motion.div>
        ) : (
          <div className="mt-8 flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-soft bg-surface-soft/50 p-8 text-center">
            <BriefcaseBusiness className="h-9 w-9 text-sky" aria-hidden="true" />
            {circulars.length ? (
              <>
                <p className="font-semibold text-navy">No circulars match your search in this department.</p>
                <Button variant="link" className="text-sky" onClick={() => { setQuery(""); setDepartment(ALL_DEPARTMENTS); }}>Show all openings</Button>
              </>
            ) : (
              <>
                <p className="max-w-lg font-semibold text-navy">No active job circulars at the moment. Please check back later or send your CV to our HR desk.</p>
                <Button asChild className="mt-1 rounded-full bg-navy px-6 hover:bg-sky"><a href={`mailto:${HR_EMAIL}?subject=${encodeURIComponent("CV for future openings")}`}><Mail /> Send your CV</a></Button>
              </>
            )}
          </div>
        )}
      </section>

      <section className="bg-navy py-12 text-primary-foreground">
        <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Don't see the right role?</h2>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">Email your CV with the department you're interested in. Our HR team keeps every application on file and contacts suitable candidates when a position opens.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-sky px-6 text-primary-foreground hover:bg-background hover:text-navy"><a href={`mailto:${HR_EMAIL}?subject=${encodeURIComponent("CV for future openings")}`}><Mail /> Email HR</a></Button>
            <Button asChild variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/send-query">Ask a question</Link></Button>
          </div>
        </div>
      </section>

      <JobDialog job={open} today={today} onClose={() => setOpen(null)} />
    </main>
  );
}

function DeadlineBadge({ deadline, today }: { deadline: string | null; today: string }) {
  const b = deadlineBadge(deadline, today);
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", b.urgent ? "bg-status-cancelled-tint text-status-cancelled" : "bg-surface-soft text-navy")}><CalendarClock className="h-3.5 w-3.5" />{b.label}</span>;
}

function JobCard({ job, today, onOpen }: { job: JobCircular; today: string; onOpen: () => void }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line-soft bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky/40 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky/15 px-3 py-1 text-xs font-semibold text-navy">{departmentLabel(job.department)}</span>
        <span className="rounded-full border border-line-soft px-3 py-1 text-xs font-medium text-muted-foreground">{employmentLabel(job.employment_type)}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold leading-snug text-navy">{job.title}</h3>
      <dl className="mt-4 space-y-2.5 text-sm">
        <Meta icon={Users} label="Vacancies">{job.vacancies} {job.vacancies === 1 ? "post" : "posts"}</Meta>
        {job.qualifications && <Meta icon={GraduationCap} label="Qualification"><span className="line-clamp-2">{job.qualifications.replace(/^[-*•]\s*/gm, "").replace(/\n+/g, " · ")}</span></Meta>}
        <Meta icon={Wallet} label="Salary">{job.salary || "Negotiable"}</Meta>
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <DeadlineBadge deadline={job.deadline} today={today} />
        <Button onClick={onOpen} className="rounded-full bg-navy px-5 hover:bg-sky">View Details & Apply <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" /></Button>
      </div>
    </article>
  );
}

function Meta({ icon: Icon, label, children }: { icon: typeof Users; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd className="min-w-0 text-navy/85">{children}</dd>
    </div>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-navy/85">
      {toBlocks(text).map((b, i) => b.kind === "p" ? <p key={i}>{b.text}</p> : <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-sky">{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>)}
    </div>
  );
}

function JobDialog({ job, today, onClose }: { job: JobCircular | null; today: string; onClose: () => void }) {
  return (
    <Dialog open={!!job} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {job && (
            <div className="flex max-h-[92vh] flex-col">
              <DialogHeader className="space-y-3 bg-navy px-6 pb-6 pt-7 text-left text-primary-foreground">
                <div className="flex flex-wrap gap-2 pr-8">
                  <span className="rounded-full bg-sky px-3 py-1 text-xs font-semibold text-primary-foreground">{departmentLabel(job.department)}</span>
                  <span className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs font-medium">{employmentLabel(job.employment_type)}</span>
                </div>
                <DialogTitle className="text-2xl font-bold leading-snug">{job.title}</DialogTitle>
                <DialogDescription className="text-primary-foreground/80">South Apollo Medical College Hospital, Barishal</DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: Users, label: "Vacancies", value: String(job.vacancies) },
                    { icon: BriefcaseBusiness, label: "Job type", value: employmentLabel(job.employment_type) },
                    { icon: Wallet, label: "Salary", value: job.salary || "Negotiable" },
                    { icon: CalendarClock, label: "Deadline", value: deadlineBadge(job.deadline, today).label.replace(/^Apply by /, "") },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl border border-line-soft bg-surface-soft/60 p-3">
                      <Icon className="h-4 w-4 text-sky" aria-hidden="true" />
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className="mt-0.5 text-sm font-bold text-navy">{value}</p>
                    </div>
                  ))}
                </div>
                <Section icon={ClipboardList} title="Job Description & Responsibilities"><RichText text={job.description} /></Section>
                {job.qualifications && <Section icon={GraduationCap} title="Requirements & Qualifications"><RichText text={job.qualifications} /></Section>}
                <Section icon={Mail} title="How to Apply">
                  {job.apply_instructions ? <RichText text={job.apply_instructions} /> : <p className="text-sm leading-relaxed text-navy/85">Email your updated CV, a recent photograph and copies of your certificates, with the job title as the subject line.</p>}
                  <p className="mt-3 break-all text-sm text-muted-foreground">Send to <span className="font-semibold text-navy">{job.apply_email || HR_EMAIL}</span></p>
                </Section>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-line-soft px-6 py-4 sm:flex-row sm:justify-end">
                <Button variant="outline" className="rounded-full" onClick={onClose}>Close</Button>
                <Button asChild className="rounded-full bg-navy px-6 hover:bg-sky"><a href={applyMailto(job)}><Mail /> Apply by Email</a></Button>
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Users; title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-navy"><span className="grid h-7 w-7 place-items-center rounded-full bg-sky/15"><Icon className="h-3.5 w-3.5 text-navy" /></span>{title}</h3>
      {children}
    </section>
  );
}
