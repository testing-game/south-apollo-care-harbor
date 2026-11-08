import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, meta } from "@/components/site/PageHero";

export const Route = createFileRoute("/patient-guide")({
  head: () => meta("Patient & Visitors Guide", "What to bring, visiting hours and hospital protocols for patients and visitors at South Apollo."),
  component: GuidePage,
});

// PLACEHOLDER copy — to be replaced with the hospital's official guide.
const SECTIONS: [string, string[]][] = [
  ["Before your visit", ["Bring a photo ID and any previous prescriptions, reports and imaging.", "Arrive 15 minutes before your appointment time to complete registration.", "Keep your appointment or booking number handy."]],
  ["Outpatient (OPD) visits", ["Register at the reception desk on arrival.", "Pay the consultation fee at the cash counter before seeing the doctor.", "Follow the room number shown on your slip."]],
  ["Admission (IPD)", ["Admission is arranged by your consultant or the emergency team.", "One attendant may stay with the patient, following ward rules."]],
  ["Visiting hours & rules", ["Visiting hours are set by each ward; please check with the nurses' station.", "Children under 12 and visitors with infections should avoid ward visits.", "Keep noise low and follow infection-control instructions."]],
  ["Emergency", ["The emergency department is open 24/7.", "For urgent help, call +880 1913-240139."]],
];

function GuidePage() {
  return (
    <main>
      <PageHero crumb="Patient & Visitors Guide" title="Patient & Visitors Guide">Helpful information to make your visit smooth and safe.</PageHero>
      <section className="container-site max-w-3xl py-12">
        <p className="mb-6 border-l-4 border-sky bg-surface-soft p-4 text-sm text-muted-foreground">This guide is provisional; the hospital's official protocols will be published here.</p>
        <Accordion type="multiple" defaultValue={["0"]}>
          {SECTIONS.map(([title, items], i) => (
            <AccordionItem key={title} value={String(i)}>
              <AccordionTrigger className="text-left text-base font-bold text-navy">{title}</AccordionTrigger>
              <AccordionContent><ul className="list-disc space-y-2 pl-5 text-muted-foreground">{items.map((t) => <li key={t}>{t}</li>)}</ul></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
