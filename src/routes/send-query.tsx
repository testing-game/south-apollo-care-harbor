import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, Loader2, Mail, MapPin, MessageSquare, Phone, Send, ShieldCheck, Siren, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHero, meta } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { MESSAGE_MAX, QUERY_CATEGORIES, querySchema, type QueryForm } from "@/lib/query-form";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/send-query")({
  head: () => meta("Send a Query", "Ask South Apollo Medical College Hospital about treatments, health check packages or doctor schedules — our patient care team will respond promptly."),
  component: SendQueryPage,
});

const EMPTY: QueryForm = { name: "", phone: "", email: "", category: "" as QueryForm["category"], message: "" };
const PHONE = "+880 1913-240139";
const EMAIL = "info@southapollomedicalcollegehospital.com";

const CONTACTS = [
  { icon: Phone, label: "Phone", value: PHONE, href: "tel:+8801913240139" },
  { icon: MapPin, label: "Location", value: "Jagua, Barishal Sadar, Barishal, Bangladesh" },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Clock, label: "Visiting / OPD Hours", value: "Saturday – Thursday: 8:00 AM – 9:00 PM (Emergency 24/7)" },
];

const fieldBase = "h-12 rounded-lg border-line-soft bg-background text-base shadow-none transition-colors focus-visible:border-navy focus-visible:ring-2 focus-visible:ring-navy/20 aria-[invalid=true]:border-destructive";

function SendQueryPage() {
  const reduced = useReducedMotion();
  return (
    <main className="bg-surface-soft">
      <PageHero crumb="Send Query" title="Get in Touch with Our Specialists">
        Have questions about our treatments, diagnostic packages, or doctor schedules? Submit your inquiry below and our patient care team will get back to you promptly.
      </PageHero>
      <section className="container-site py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.aside initial={{ opacity: 0, x: reduced ? 0 : -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }} className="lg:col-span-5">
            <ContactInfo />
          </motion.aside>
          <motion.div initial={{ opacity: 0, y: reduced ? 0 : 32 }} animate={{ opacity: 1, y: 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 20, delay: 0.12 }} className="lg:col-span-7">
            <InquiryForm />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-5">
      <a href="tel:+8801913240139" className="group flex items-center gap-4 rounded-2xl bg-navy p-5 text-primary-foreground shadow-xl transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive">
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/60 motion-reduce:hidden" />
          <Siren className="relative h-6 w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-sky">24/7 Emergency Hotline</span>
          <span className="mt-1 block text-xl font-bold">{PHONE}</span>
        </span>
      </a>

      <div className="rounded-2xl border border-line-soft bg-background p-6 shadow-card">
        <h2 className="text-lg font-bold text-navy">Contact the hospital directly</h2>
        <ul className="mt-4 space-y-2">
          {CONTACTS.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clinical-tint text-clinical-teal transition-colors group-hover:bg-navy group-hover:text-primary-foreground"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span><span className="block font-semibold [overflow-wrap:anywhere] text-navy">{value}</span></span>
              </>
            );
            const cls = "group flex items-start gap-3 rounded-xl p-3 transition-all duration-300 hover:translate-x-1 hover:bg-surface-soft motion-reduce:transform-none";
            return <li key={label}>{href ? <a href={href} className={cls}>{body}</a> : <div className={cls}>{body}</div>}</li>;
          })}
        </ul>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-clinical-teal/30 bg-clinical-tint p-5">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-clinical-teal" aria-hidden="true" />
        <div>
          <p className="font-bold text-navy">Our patient promise</p>
          <p className="mt-1 text-sm text-muted-foreground">100% Confidentiality &amp; Quick Response within 24 Hours</p>
        </div>
      </div>
    </div>
  );
}

function InquiryForm() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<QueryForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof QueryForm, string>>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = <K extends keyof QueryForm>(k: K, v: QueryForm[K]) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = querySchema.safeParse(form);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) { const k = issue.path[0] as keyof QueryForm; next[k] ??= issue.message; }
      setErrors(next);
      return;
    }
    const d = parsed.data;
    setBusy(true);
    const { error } = await supabase.rpc("send_query", { _name: d.name, _phone: d.phone, _email: d.email, _subject: d.category, _message: d.message });
    setBusy(false);
    if (error) { toast.error("We couldn't send your query. Please try again or call us."); return; }
    setForm(EMPTY);
    setErrors({});
    setSent(true);
  }

  const err = (k: keyof QueryForm) => errors[k] ? <p id={`${k}-error`} className="text-sm text-destructive">{errors[k]}</p> : null;
  const a11y = (k: keyof QueryForm) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <div className="rounded-2xl border border-line-soft bg-background p-6 shadow-xl sm:p-10">
      <h2 className="text-2xl font-bold text-navy">Send us your inquiry</h2>
      <p className="mt-1 text-sm text-muted-foreground">Fields marked * are required.</p>

      <AnimatePresence>
        {sent && (
          <motion.div role="status" initial={{ opacity: 0, y: -8, scale: reduced ? 1 : 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }} className="mt-6 flex items-start gap-4 rounded-xl border border-clinical-teal/40 bg-clinical-tint p-4">
            <SuccessCheck reduced={!!reduced} />
            <p className="flex-1 text-sm font-medium text-navy">Thank you! Your query has been received. Our support desk will contact you via phone or email shortly.</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Dismiss message" onClick={() => setSent(false)}><X /></Button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="qn">Full name *</Label>
          <div className="relative"><User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="qn" autoComplete="name" maxLength={120} placeholder="Your full name" value={form.name} onChange={(e) => set("name", e.target.value)} className={cn(fieldBase, "pl-10")} {...a11y("name")} /></div>
          {err("name")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qp">Phone number *</Label>
          <div className="relative"><Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="qp" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={cn(fieldBase, "pl-10")} {...a11y("phone")} /></div>
          {err("phone")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qe">Email address <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="qe" type="email" autoComplete="email" maxLength={255} placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={cn(fieldBase, "pl-10")} {...a11y("email")} /></div>
          {err("email")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="qc">Inquiry category *</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v as QueryForm["category"])}>
            <SelectTrigger id="qc" className={cn(fieldBase, "px-3.5")} {...a11y("category")}><SelectValue placeholder="Choose a category" /></SelectTrigger>
            <SelectContent>{QUERY_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          {err("category")}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-end justify-between"><Label htmlFor="qm">Your message *</Label><span className={cn("text-xs tabular-nums", form.message.length > MESSAGE_MAX * 0.9 ? "text-destructive" : "text-muted-foreground")}>{form.message.length} / {MESSAGE_MAX}</span></div>
          <div className="relative"><MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" /><Textarea id="qm" maxLength={MESSAGE_MAX} placeholder="Tell us how we can help…" value={form.message} onChange={(e) => set("message", e.target.value)} className={cn(fieldBase, "h-auto min-h-40 resize-y py-3 pl-10")} {...a11y("message")} /></div>
          {err("message")}
        </div>
        <motion.div className="sm:col-span-2" whileHover={{ scale: reduced || busy ? 1 : 1.015 }} whileTap={{ scale: reduced || busy ? 1 : 0.98 }}>
          <Button type="submit" disabled={busy} className="booking-cta h-13 w-full rounded-lg py-3.5 text-base font-semibold">
            {busy ? <><Loader2 className="animate-spin" /> Submitting…</> : <><Send /> Submit Inquiry</>}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

function SuccessCheck({ reduced }: { reduced: boolean }) {
  return (
    <motion.svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" initial={{ scale: reduced ? 1 : 0.4 }} animate={{ scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 14 }} aria-hidden="true">
      <circle cx="20" cy="20" r="19" className="fill-clinical-teal" />
      <motion.path d="M12 20.5 L17.5 26 L28.5 14.5" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-foreground" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: reduced ? 0 : 0.2, duration: reduced ? 0 : 0.4 }} />
    </motion.svg>
  );
}
