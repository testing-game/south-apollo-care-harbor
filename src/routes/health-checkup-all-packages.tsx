import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, CheckCircle2, Download } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { packagesQuery } from "@/lib/public-queries";
import type { HealthPackage } from "@/lib/public-data.functions";
import { formatDate, price, todayInDhaka } from "@/lib/schedule";
import { downloadReceipt } from "@/lib/pdf";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/health-checkup-all-packages")({
  head: () => meta("Health Check Packages", "Compare South Apollo health check packages, see the tests included and book online."),
  loader: ({ context }) => context.queryClient.ensureQueryData(packagesQuery),
  component: PackagesPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
});

function PackagesPage() {
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const [open, setOpen] = useState<HealthPackage | null>(null);
  return (
    <main>
      <PageHero crumb="Health Check Packages" title="Health Check Packages">Preventive check-ups designed for every age and need.</PageHero>
      <section className="container-site py-12">
        {packages.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <article key={p.id} className="flex flex-col border border-line-soft bg-background">
                {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-navy">{p.title}</h2>
                  <p className="mt-1 text-xl font-bold text-sky">{price(p.price)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                  {p.included_tests.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm">{p.included_tests.map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-clinical-teal" />{t}</li>)}</ul>
                  )}
                  <Button className="mt-auto rounded-none bg-navy hover:bg-sky" onClick={() => setOpen(p)}><span className="mt-0">Book Test</span></Button>
                </div>
              </article>
            ))}
          </div>
        ) : <EmptyState>Packages will be listed here soon.</EmptyState>}
      </section>
      <BookDialog pkg={open} onClose={() => setOpen(null)} />
    </main>
  );
}

function BookDialog({ pkg, onClose }: { pkg: HealthPackage | null; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const close = () => { setDone(null); setForm({ name: "", phone: "", date: "" }); onClose(); };
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success || !pkg) return toast.error(parsed.error?.issues[0]?.message ?? "Check the form");
    setBusy(true);
    const { data, error } = await supabase.rpc("book_test", { _package_id: pkg.id, _date: parsed.data.date, _name: parsed.data.name, _phone: parsed.data.phone });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(data as string);
  }
  return (
    <Dialog open={!!pkg} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{done ? "Booking received" : `Book: ${pkg?.title ?? ""}`}</DialogTitle></DialogHeader>
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-clinical-teal" />
            <p className="mt-2 text-sm text-muted-foreground">Your booking number</p>
            <p className="text-2xl font-bold text-navy">{done}</p>
            <Button className="mt-4 rounded-none bg-navy" onClick={() => pkg && downloadReceipt("Health Check Booking", [["Booking No.", done], ["Patient", form.name], ["Phone", form.phone], ["Package", pkg.title], ["Price", price(pkg.price)], ["Date", formatDate(form.date)]], `${done}.pdf`)}><Download /> Download PDF slip</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1"><Label htmlFor="bn">Patient name</Label><Input id="bn" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><Label htmlFor="bp">Phone</Label><Input id="bp" type="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-1"><Label htmlFor="bd">Preferred date</Label><Input id="bd" type="date" min={todayInDhaka()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <Button type="submit" disabled={busy} className="w-full rounded-none bg-navy hover:bg-sky">{busy ? "Booking…" : "Confirm booking"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
