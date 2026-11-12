import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Cookie, FileText, Info, Lock, Mail, MapPin, Phone, Share2, ShieldCheck, UserCheck } from "lucide-react";
import type { ReactNode } from "react";
import { PageHero, meta } from "@/components/site/PageHero";
import { Callout, CheckList, DocLayout, type DocSection } from "@/components/site/DocLayout";

export const Route = createFileRoute("/privacy-policy")({
  head: () => meta("Privacy Policy & Patient Confidentiality", "How South Apollo Medical College Hospital collects, uses and protects patient and visitor information on this website."),
  component: PrivacyPage,
});

const UPDATED = "12 November 2026";
const EMAIL = "info@southapollomedicalcollegehospital.com";

const SECTIONS: DocSection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: FileText,
    lead: "South Apollo Medical College Hospital (Jagua, Kalijira, Barishal Sadar, Barishal) collects only the information you choose to send us through this website.",
    body: (
      <>
        <CheckList
          title="Personal identification"
          items={["Patient name, age and gender.", "Mobile phone number.", "Email address (optional, on the query form)."]}
        />
        <CheckList
          title="Appointment and booking details"
          items={[
            <><strong>Doctor appointments:</strong> chosen doctor, preferred date and any notes you add.</>,
            <><strong>Health check-up bookings:</strong> chosen package and preferred date.</>,
            <><strong>Queries:</strong> inquiry category and your message.</>,
          ]}
        />
        <Callout icon={Info}>Please do not type detailed medical history into website forms. Your full medical records are created and kept at the hospital as part of your care, not through this website.</Callout>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    icon: ClipboardCheck,
    body: (
      <CheckList
        items={[
          "Scheduling and confirming doctor consultations.",
          "Processing diagnostic and health check-up bookings, and preparing daily lists for our clinical and front-desk teams.",
          "Delivering lab reports, including through our separate online report portal.",
          "Contacting you by phone or email about your request or query.",
          "Improving our patient care services and meeting our legal and regulatory obligations.",
        ]}
      />
    ),
  },
  {
    id: "confidentiality",
    title: "Medical Confidentiality & Data Security",
    icon: Lock,
    body: (
      <>
        <p>All patient information is treated as strictly confidential under doctor–patient confidentiality. Only authorised hospital staff who need it to deliver or organise your care can see it.</p>
        <CheckList
          items={[
            "Connections to this website are encrypted, and form submissions are stored in an encrypted cloud database.",
            "Staff access requires individual sign-in and role-based permissions; members of the public can never see other patients' bookings or messages.",
            "Images uploaded by staff are kept in private storage.",
            "We keep appointment, booking and query records only as long as needed to provide care, respond to you and meet medical record-keeping and legal requirements, then delete or anonymise them.",
          ]}
        />
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    icon: Share2,
    body: (
      <>
        <p><strong>We never sell your personal information or share it with third-party marketers.</strong> We only disclose it when it is needed for your clinical care, when required by law or regulators in Bangladesh, to protect someone's life in an emergency, or with your consent.</p>
        <CheckList
          title="Services that load on this website"
          items={[
            <><strong>Google Fonts:</strong> our Bengali typeface is loaded from Google's servers, which receive your IP address and browser details when the page loads.</>,
            <><strong>Google Maps:</strong> the map in our website footer is provided by Google. When it loads, Google may receive your IP address and may set its own cookies.</>,
            <><strong>YouTube:</strong> patient story videos use YouTube's privacy-enhanced mode. YouTube receives your IP address when a video is shown and may store information on your device once you play it.</>,
            <><strong>External links:</strong> the Online Report portal and our social media pages are separate services with their own privacy policies.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Website Analytics",
    icon: Cookie,
    body: (
      <>
        <p>Our own pages, including the online booking and query forms, work without cookies for patients and visitors. Google Maps and YouTube, described above, may set their own cookies when they load. Hospital staff who sign in to the staff portal have their sign-in session kept in their browser's storage until they sign out.</p>
        <p>We use Lovable's built-in visitor analytics to understand how our website is used. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and doesn't identify visitors. Lovable collects this data for us. <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">Lovable's privacy policy</a> explains how it handles it.</p>
        <p>On this site it records the pages visited, where visitors came from, their country, browser, operating system and device type, how long they stay, how fast pages load, errors, and which buttons and links are clicked. This is recorded for every visitor, without cookies and without identifying anyone. Detailed data is kept for 90 days and daily summaries for a year.</p>
      </>
    ),
  },
  {
    id: "rights-contact",
    title: "Patient Rights & Contact Information",
    icon: UserCheck,
    body: (
      <>
        <p>You may ask us to show, update, correct or delete the personal information you submitted through this website, or tell us you no longer wish to be contacted. Appointments for children should be made by a parent or guardian. We may update this policy from time to time; the latest version and its date are always shown on this page.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <ContactTile icon={MapPin} label="Visit us">South Apollo Medical College Hospital, Jagua, Kalijira, Barishal Sadar, Barishal</ContactTile>
          <ContactTile icon={Phone} label="Call us"><a href="tel:+8801913240139">+880 1913-240139</a></ContactTile>
          <ContactTile icon={Mail} label="Email us"><a href={`mailto:${EMAIL}`} className="[overflow-wrap:anywhere]">{EMAIL}</a></ContactTile>
        </div>
        <p>You can also send a request through our <Link to="/send-query">Send Query</Link> page, and we will respond as soon as possible.</p>
      </>
    ),
  },
];

function ContactTile({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line-soft bg-surface-soft p-4 text-sm">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky"><Icon className="h-4 w-4" />{label}</p>
      <div className="mt-1.5 font-semibold text-navy">{children}</div>
    </div>
  );
}

function TrustCard() {
  return (
    <div className="rounded-2xl bg-navy p-6 text-primary-foreground shadow-sm">
      <ShieldCheck className="h-8 w-8 text-sky" />
      <p className="mt-3 font-bold">Your health information is private.</p>
      <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">We collect only what is needed to arrange your care, and only authorised hospital staff can access it.</p>
      <p className="mt-4 text-xs text-primary-foreground/70">Last updated: {UPDATED}</p>
    </div>
  );
}

function PrivacyPage() {
  return (
    <main className="bg-surface-soft">
      <PageHero crumb="Privacy Policy" title="Privacy Policy & Patient Data Confidentiality">How we collect, use and protect the information you share with us through this website.</PageHero>
      <DocLayout label="Privacy policy sections" sections={SECTIONS} asideExtra={<TrustCard />} />
    </main>
  );
}
