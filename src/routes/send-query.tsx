import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero, meta } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/send-query")({
  head: () => meta("Send a Query", "Ask South Apollo Medical College Hospital a question and our team will get back to you."),
  component: SendQueryPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email").max(255)]),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  subject: z.string().trim().min(2, "Enter a subject").max(200),
  message: z.string().trim().min(2, "Enter your message").max(3000),
});

function SendQueryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse(form);
    if (!p.success) return toast.error(p.error.issues[0]!.message);
    setBusy(true);
    const { error } = await supabase.rpc("send_query", { _name: p.data.name, _email: p.data.email, _phone: p.data.phone, _subject: p.data.subject, _message: p.data.message });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }
  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }) });
  return (
    <main>
      <PageHero crumb="Send Query" title="Ask South Apollo">Looking for world-class care? Send us your question and we will get back to you.</PageHero>
      <section className="container-site max-w-2xl py-12">
        {sent ? (
          <div className="border border-line-soft p-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-clinical-teal" /><h2 className="mt-3 text-xl font-bold text-navy">Thank you — your query was sent.</h2><p className="mt-2 text-muted-foreground">Our team will contact you soon.</p></div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="qn">Name</Label><Input id="qn" maxLength={120} {...f("name")} /></div>
            <div className="space-y-2"><Label htmlFor="qp">Phone</Label><Input id="qp" type="tel" maxLength={20} {...f("phone")} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="qe">Email (optional)</Label><Input id="qe" type="email" maxLength={255} {...f("email")} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="qs">Subject</Label><Input id="qs" maxLength={200} {...f("subject")} /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="qm">Message</Label><Textarea id="qm" rows={6} maxLength={3000} {...f("message")} /></div>
            <Button type="submit" disabled={busy} className="rounded-none bg-navy hover:bg-sky md:col-span-2">{busy ? "Sending…" : "Send Query"}</Button>
          </form>
        )}
      </section>
    </main>
  );
}
