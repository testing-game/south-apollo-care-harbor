import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarDays, Check, Download, Loader2, Phone, Search, Sparkles, Stethoscope, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero, meta } from "@/components/site/PageHero";
import { packagesQuery } from "@/lib/public-queries";
import type { HealthPackage } from "@/lib/public-data.functions";
import { formatDate, price, todayInDhaka } from "@/lib/schedule";
import { GENDERS, filterPackages, packageBadge, testBookingSchema } from "@/lib/packages";
import { downloadReceipt } from "@/lib/pdf";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health-checkup-all-packages")({
  head: () => meta("Health Check Packages", "Compare South Apollo health check packages, search by test name and book your check-up online."),
  loader: ({ context }) => context.queryClient.ensureQueryData(packagesQuery),
  component: PackagesPage,
});

function PackagesPage() {
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<HealthPackage | null>(null);
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
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <motion.div key={p.id} variants={item} layout={!reduced} className="h-full"><PackageCard pkg={p} badge={packageBadge(p, packages)} onBook={() => setOpen(p)} /></motion.div>)}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-72 flex-col items-center justify-center gap-2 border-y border-line-soft text-center text-muted-foreground">
            <Search className="h-8 w-8 text-sky" aria-hidden="true" />
            <p className="font-semibold text-navy">{packages.length ? "No packages or tests match your search" : "Packages will be listed here soon."}</p>
            {packages.length > 0 && <Button variant="link" className="text-sky" onClick={() => setQuery("")}>Show all packages</Button>}
          </motion.div>
        )}
      </section>
      <BookDialog pkg={open} onClose={() => setOpen(null)} />
    </main>
  );
}

function PackageCard({ pkg, badge, onBook }: { pkg: HealthPackage; badge: ReturnType<typeof packageBadge>; onBook: () => void }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line-soft bg-background transition-all duration-300 hover:-translate-y-1.5 hover:border-clinical-teal/60 hover:shadow-xl hover:ring-4 hover:ring-clinical-teal/10 motion-reduce:transform-none">
      {pkg.image_url && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={pkg.image_url} alt={pkg.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {badge && (
            <span className={cn("absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-md", badge === "Comprehensive" ? "bg-navy text-primary-foreground" : "bg-clinical-teal text-primary-foreground")}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />{badge}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-navy">{pkg.title}</h3>
        <p className="mt-2 inline-flex w-fit rounded-full bg-clinical-tint px-3 py-1 text-sm font-bold text-clinical-teal">{price(pkg.price)}</p>
        {pkg.description && <p className="mt-3 text-sm text-muted-foreground">{pkg.description}</p>}
        {pkg.included_tests.length > 0 && (
          <ul aria-label="Included tests" className="mt-4 flex max-h-36 flex-wrap gap-2 overflow-y-auto pr-1">
            {pkg.included_tests.map((t) => (
              <li key={t} className="inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface-soft px-2.5 py-1 text-xs font-medium text-navy">
                <Check className="h-3.5 w-3.5 shrink-0 text-clinical-teal" aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6"><Button className="w-full rounded-none bg-navy transition-colors hover:bg-sky" onClick={onBook}>Book Test</Button></div>
      </div>
    </article>
  );
}

const EMPTY = { name: "", phone: "", age: "", gender: "", date: "" };
const field = "h-11 rounded-md border-line-soft focus-visible:border-sky focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-0";

function BookDialog({ pkg, onClose }: { pkg: HealthPackage | null; onClose: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [slip, setSlip] = useState<[string, string][]>([]);
  const reduced = useReducedMotion();
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const close = () => { setDone(null); setSlip([]); setForm(EMPTY); onClose(); };
  const download = (num: string, rows: [string, string][]) => downloadReceipt("Health Check Booking", rows, `${num}.pdf`);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;
    const parsed = testBookingSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check the form"); return; }
    const d = parsed.data;
    setBusy(true);
    const { data, error } = await supabase.rpc("book_test", { _package_id: pkg.id, _date: d.date, _name: d.name, _phone: d.phone, _age: d.age, _gender: d.gender });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const num = data as string;
    const rows: [string, string][] = [["Booking No.", num], ["Patient", d.name], ["Age", String(d.age)], ["Gender", d.gender], ["Phone", d.phone], ["Package", pkg.title], ["Price", price(pkg.price)], ["Date", formatDate(d.date)]];
    setSlip(rows);
    setDone(num);
    download(num, rows).catch(() => toast.error("Your booking is saved, but the slip didn't download. Use the button to try again."));
  }

  return (
    <Dialog open={!!pkg} onOpenChange={(o) => !o && close()}>
      <DialogContent overlayClassName="bg-navy-deep/60 backdrop-blur-sm" className="max-h-[92vh] overflow-y-auto rounded-xl p-0 sm:max-w-md sm:rounded-xl">
        <motion.div initial={{ opacity: 0, scale: reduced ? 1 : 0.92, y: reduced ? 0 : 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 26 }}>
          <DialogHeader className="space-y-3 rounded-t-xl bg-navy px-6 pb-5 pt-6 text-left text-primary-foreground">
            <div className="flex items-center gap-3 pr-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-sky"><Stethoscope className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-bold leading-snug">{done ? "Booking confirmed" : pkg?.title}</DialogTitle>
                <DialogDescription className="text-primary-foreground/75">{done ? pkg?.title : "Book your health check"}</DialogDescription>
              </div>
            </div>
            {pkg && <span className="inline-flex w-fit rounded-full bg-sky px-3 py-1 text-sm font-bold text-navy-deep">{price(pkg.price)}</span>}
          </DialogHeader>

          <div className="px-6 pb-6 pt-5">
            {done ? (
              <div className="text-center">
                <SuccessCheck reduced={!!reduced} />
                <p className="mt-3 text-sm text-muted-foreground">Your booking reference</p>
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.5 }} className="mt-1 font-mono text-2xl font-bold tracking-wide text-navy">{done}</motion.p>
                <p className="mt-2 text-xs text-muted-foreground">Please bring the slip and arrive 15 minutes early. Our team may call to confirm.</p>
                <Button className="mt-5 h-11 w-full rounded-md bg-navy hover:bg-sky" onClick={() => download(done, slip)}><Download /> Download PDF slip</Button>
                <Button variant="ghost" className="mt-2 w-full" onClick={close}>Close</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="bn">Patient name</Label>
                  <div className="relative"><User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="bn" autoComplete="name" maxLength={120} placeholder="Full name" value={form.name} onChange={set("name")} className={cn(field, "pl-9")} /></div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bp">Phone number</Label>
                  <div className="relative"><Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="bp" type="tel" autoComplete="tel" maxLength={20} placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} className={cn(field, "pl-9")} /></div>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ba">Age</Label>
                    <Input id="ba" type="number" inputMode="numeric" min={0} max={120} placeholder="Years" value={form.age} onChange={set("age")} className={field} />
                  </div>
                  <fieldset className="space-y-1.5">
                    <legend className="mb-1.5 text-sm font-medium leading-none">Gender</legend>
                    <div role="radiogroup" aria-label="Gender" className="grid h-11 grid-cols-3 gap-1 rounded-md border border-line-soft p-1">
                      {GENDERS.map((g) => (
                        <button key={g} type="button" role="radio" aria-checked={form.gender === g} onClick={() => setForm({ ...form, gender: g })} className={cn("rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/40", form.gender === g ? "bg-navy text-primary-foreground" : "text-navy hover:bg-surface-soft")}>{g}</button>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bd">Preferred date</Label>
                  <div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="bd" type="date" min={todayInDhaka()} value={form.date} onChange={set("date")} className={cn(field, "pl-9")} /></div>
                </div>
                <motion.div whileHover={reduced || busy ? undefined : { scale: 1.02 }} whileTap={reduced || busy ? undefined : { scale: 0.98 }}>
                  <Button type="submit" disabled={busy} className="booking-cta h-12 w-full rounded-md text-base font-semibold">
                    {busy ? <><Loader2 className="animate-spin" /> Booking…</> : <><Download /> Confirm &amp; Download Slip</>}
                  </Button>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function SuccessCheck({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative mx-auto h-20 w-20">
      {!reduced && <motion.span className="absolute inset-0 rounded-full bg-clinical-teal/25" initial={{ scale: 0.6, opacity: 1 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut", repeat: 1 }} />}
      <motion.svg viewBox="0 0 80 80" className="relative h-20 w-20" initial={{ scale: reduced ? 1 : 0.5 }} animate={{ scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 14 }} aria-hidden="true">
        <circle cx="40" cy="40" r="38" className="fill-clinical-teal" />
        <motion.path d="M24 41 L35 52 L57 29" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-foreground" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduced ? 0 : 0.25, duration: reduced ? 0 : 0.45, ease: "easeOut" }} />
      </motion.svg>
    </div>
  );
}
