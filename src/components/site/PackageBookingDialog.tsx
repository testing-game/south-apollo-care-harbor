import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Download, Loader2, Phone, Stethoscope, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HealthPackage } from "@/lib/public-data.functions";
import { formatDate, price, todayInDhaka } from "@/lib/schedule";
import { BOOKING_NOTES_MAX, GENDERS, testBookingSchema } from "@/lib/packages";
import { downloadSlip, type SlipInput } from "@/lib/pdf";
import { weekdayName } from "@/lib/pdf-model";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/** Book Test modal: saves through the book_test function and offers the PDF slip. */
const EMPTY = { name: "", phone: "", age: "", gender: "", date: "", notes: "" };
const field = "h-11 rounded-md border-line-soft focus-visible:border-sky focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-0";

export function PackageBookingDialog({ pkg, onClose }: { pkg: HealthPackage | null; onClose: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [slip, setSlip] = useState<SlipInput | null>(null);
  const reduced = useReducedMotion();
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const close = () => { setDone(null); setSlip(null); setForm(EMPTY); onClose(); };
  const download = (input: SlipInput | null) => (input ? downloadSlip(input) : Promise.resolve());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;
    const parsed = testBookingSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check the form"); return; }
    const d = parsed.data;
    setBusy(true);
    const { data, error } = await supabase.rpc("book_test", { _package_id: pkg.id, _date: d.date, _name: d.name, _phone: d.phone, _age: d.age, _gender: d.gender, _notes: d.notes });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const num = data as string;
    const input: SlipInput = {
      kind: "test", number: num, status: "pending", bookedAt: new Date(),
      patient: { name: d.name, phone: d.phone, age: d.age, gender: d.gender },
      details: [["Package", pkg.title], ["Price", price(pkg.price)], ["Visiting Day", weekdayName(d.date)], ["Scheduled Date", formatDate(d.date)]],
      fileName: `${num}.pdf`,
    };
    setSlip(input);
    setDone(num);
    download(input).catch(() => toast.error("Your booking is saved, but the slip didn't download. Use the button to try again."));
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
                <Button className="mt-5 h-11 w-full rounded-md bg-navy hover:bg-sky" onClick={() => download(slip).catch(() => toast.error("The slip didn't download. Please try again."))}><Download /> Download PDF slip</Button>
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
                <div className="space-y-1.5">
                  <Label htmlFor="bnotes">Notes <span className="font-normal text-muted-foreground">(optional)</span></Label>
                  <Textarea id="bnotes" rows={3} maxLength={BOOKING_NOTES_MAX} placeholder="Anything we should know — health conditions, preferred time, questions…" value={form.notes} onChange={set("notes")} className="resize-none rounded-md border-line-soft focus-visible:border-sky focus-visible:ring-2 focus-visible:ring-sky/40 focus-visible:ring-offset-0" />
                </div>
                <motion.div whileHover={{ scale: reduced || busy ? 1 : 1.02 }} whileTap={{ scale: reduced || busy ? 1 : 0.98 }}>
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
