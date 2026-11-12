import { createFileRoute, Link } from "@tanstack/react-router";
import { Ambulance, BedDouble, CalendarClock, Car, Clock, Coffee, ExternalLink, FlaskConical, HeartHandshake, Info, Phone, Pill, Siren, Users } from "lucide-react";
import { PageHero, meta } from "@/components/site/PageHero";
import { Callout, CheckList, DocLayout, InfoTiles, Steps, type DocSection } from "@/components/site/DocLayout";

export const Route = createFileRoute("/patient-guide")({
  head: () => meta("Patient & Visitors Guide", "OPD hours, admission and discharge, visiting rules, report collection, patient rights and facilities at South Apollo Medical College Hospital, Barishal."),
  component: GuidePage,
});

const HOTLINE = "+880 1913-240139";
const HOTLINE_TEL = "tel:+8801913240139";
const REPORT_URL = "https://report.southapollomedicalcollegehospital.com";

const SECTIONS: DocSection[] = [
  {
    id: "opd-hours",
    title: "OPD & Consultation Hours",
    icon: Clock,
    lead: "Our outpatient department (OPD) runs six days a week, and the Emergency & Trauma Unit never closes.",
    body: (
      <>
        <InfoTiles
          items={[
            { label: "OPD & consultations", value: "Saturday – Thursday", note: "8:00 AM – 9:00 PM", icon: CalendarClock },
            { label: "Emergency & Trauma Unit", value: "Open 24/7", note: "Including Fridays and public holidays", icon: Siren },
          ]}
        />
        <CheckList
          title="Before your appointment"
          items={[
            "Please arrive at least 15 minutes before your scheduled time to complete registration at the reception desk.",
            "Keep your appointment number, NID or birth certificate, and any previous prescriptions, reports and X-ray/scan films with you.",
            "Pay the consultation fee at the cash counter, then wait near the doctor's room number shown on your slip.",
            <>You can book in advance through our <Link to="/request-appointment">online appointment form</Link> or by calling <a href={HOTLINE_TEL}>{HOTLINE}</a>.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: "admission",
    title: "Admission & Discharge Process",
    icon: BedDouble,
    lead: "Admission is arranged on the advice of your consultant or the emergency doctor on duty.",
    body: (
      <>
        <CheckList
          title="Documents required for admission"
          items={[
            "National ID (NID) of the patient or attendant, or birth certificate for children.",
            "Previous medical records: prescriptions, discharge summaries, test reports and imaging.",
            "The doctor's admission note or referral letter.",
          ]}
        />
        <Steps
          title="Admission steps"
          items={[
            "Take the doctor's admission note to the Admission Desk.",
            "Complete the admission form and consent with the patient's and attendant's details.",
            "Pay the admission deposit and receive your bed, ward or cabin allocation.",
            "A ward nurse will receive the patient, record vital signs and explain the ward rules.",
          ]}
        />
        <Steps
          title="Discharge steps"
          items={[
            "Your consultant confirms the discharge during the ward round.",
            "The ward prepares your discharge summary with diagnosis, treatment given and medicines to continue.",
            "Collect the final bill from the Billing Counter and clear all dues.",
            "Receive the discharge summary, reports and follow-up date from the nurses' station before leaving.",
          ]}
        />
      </>
    ),
  },
  {
    id: "visiting",
    title: "Visiting Hours & Ward Etiquette",
    icon: Users,
    lead: "Rest and infection control are part of every patient's recovery. Please help us protect them.",
    body: (
      <>
        <InfoTiles
          items={[
            { label: "General ward & cabin", value: "4:00 PM – 7:00 PM", note: "Every day", icon: Clock },
            { label: "ICU / CCU", value: "Restricted access", note: "Only with permission from the unit in charge", icon: HeartHandshake },
          ]}
        />
        <CheckList
          title="Ward rules"
          items={[
            <><strong>Maximum 2 visitors</strong> per patient at a time. One registered attendant may stay with the patient outside visiting hours.</>,
            "ICU and CCU visits are short, one person at a time, and only after washing hands and following staff instructions.",
            "Children under 12 and anyone with a cough, fever or infection should not visit wards.",
            "Keep your voice and phone volume low, and do not smoke anywhere on the hospital campus.",
            "Use the hand sanitiser at the ward entrance and do not sit on patients' beds.",
            "Outside food for patients only with the nurse's or doctor's approval.",
          ]}
        />
      </>
    ),
  },
  {
    id: "reports",
    title: "Diagnostic & Online Report Collection",
    icon: FlaskConical,
    lead: "Our pathology laboratory and Digital Radiography unit support both outpatients and admitted patients.",
    body: (
      <>
        <CheckList
          title="Preparing for tests"
          items={[
            <>For <strong>fasting blood sugar, lipid profile</strong> and some other tests, do not eat for 8–12 hours before the sample. Plain water is allowed.</>,
            "Take your regular medicines unless your doctor tells you otherwise, and tell the lab staff which ones you take.",
            "Morning urine or stool samples should be collected in the container provided by the laboratory.",
            "Samples are collected during OPD hours (Saturday – Thursday, 8:00 AM – 9:00 PM). Emergency samples are taken 24/7.",
          ]}
        />
        <Steps
          title="Getting your report online"
          items={[
            "Keep the money receipt or slip given at sample collection.",
            <>Visit <a href={REPORT_URL} target="_blank" rel="noopener noreferrer">report.southapollomedicalcollegehospital.com</a>.</>,
            "Enter the details printed on your slip to view and download your report.",
            "Printed reports can also be collected from the Report Delivery Counter.",
          ]}
        />
      </>
    ),
  },
  {
    id: "rights",
    title: "Patient Rights & Responsibilities",
    icon: HeartHandshake,
    body: (
      <div className="grid gap-6 md:grid-cols-2">
        <CheckList
          title="Your rights"
          items={[
            "Respectful, dignified care without discrimination.",
            "Privacy and confidentiality of your medical information.",
            "Clear information about your diagnosis, treatment, risks and costs.",
            "Informed consent before any procedure or operation.",
            "A second opinion and access to your own medical records.",
            "To raise a concern or complaint and have it addressed.",
          ]}
        />
        <CheckList
          title="Your responsibilities"
          items={[
            "Give accurate and complete medical history, medicines and allergies.",
            "Follow the treatment plan and tell us if you cannot.",
            "Respect hospital staff, other patients and hospital property.",
            "Follow safety, hygiene and no-smoking rules.",
            "Clear bills on time and keep your receipts.",
          ]}
        />
      </div>
    ),
  },
  {
    id: "facilities",
    title: "Hospital Facilities & Emergency Contact",
    icon: Info,
    body: (
      <>
        <InfoTiles
          items={[
            { label: "Pharmacy", value: "Open 24/7", icon: Pill },
            { label: "Ambulance service", value: "Available on call", icon: Ambulance },
            { label: "Cafeteria", value: "Food & refreshments", icon: Coffee },
            { label: "Prayer room", value: "For patients & visitors", icon: HeartHandshake },
            { label: "Parking", value: "On-campus parking", icon: Car },
            { label: "24/7 Helpline", value: <a href={HOTLINE_TEL} className="!no-underline">{HOTLINE}</a>, icon: Phone },
          ]}
        />
        <Callout icon={Siren}>In a medical emergency, come straight to the Emergency & Trauma Unit or call <a href={HOTLINE_TEL}><strong>{HOTLINE}</strong></a> at any time of day or night.</Callout>
      </>
    ),
  },
];

function HelpCard() {
  return (
    <div className="rounded-2xl bg-navy p-6 text-primary-foreground shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-sky">24/7 Helpline</p>
      <a href={HOTLINE_TEL} className="mt-2 flex items-center gap-2 text-xl font-bold transition-colors hover:text-sky"><Phone className="h-5 w-5" />{HOTLINE}</a>
      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Jagua, Kalijira, Barishal Sadar, Barishal</p>
      <a href={REPORT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky hover:underline">Online reports <ExternalLink className="h-4 w-4" /></a>
    </div>
  );
}

function GuidePage() {
  return (
    <main className="bg-surface-soft">
      <PageHero crumb="Patient & Visitors Guide" title="Patient & Visitors Guide">Everything you need to know before visiting South Apollo Medical College Hospital — hours, admission, visiting rules, reports and facilities.</PageHero>
      <DocLayout label="Patient guide sections" sections={SECTIONS} asideExtra={<HelpCard />} />
    </main>
  );
}
