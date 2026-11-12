import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { PageHero, meta } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy-policy")({
  head: () => meta("Privacy Policy & Patient Confidentiality", "How South Apollo Medical College Hospital collects, uses and protects patient and visitor information on this website."),
  component: PrivacyPage,
});

const UPDATED = "12 November 2026";
const EMAIL = "info@southapollomedicalcollegehospital.com";

type Section = { id: string; title: string; body: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "who-we-are",
    title: "1. Who we are",
    body: <p>This website is operated by South Apollo Medical College Hospital, Jagua, Kalijira, Barishal Sadar, Barishal, Bangladesh. This policy explains what information we collect through the website, why we collect it and how we protect it.</p>,
  },
  {
    id: "what-we-collect",
    title: "2. Information you give us",
    body: (
      <>
        <p>We only collect personal information that you choose to send us through our online forms:</p>
        <ul>
          <li><strong>Doctor appointment requests:</strong> patient name, mobile number, age, gender, chosen doctor, preferred date and any notes you add.</li>
          <li><strong>Health check-up bookings:</strong> patient name, mobile number, age, gender, chosen package and preferred date.</li>
          <li><strong>Queries:</strong> your name, mobile number, email address (optional), inquiry category and message.</li>
        </ul>
        <p>Please do not include detailed medical history in website forms. Your full medical records are created and kept at the hospital as part of your care, not through this website.</p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How we use your information",
    body: (
      <ul>
        <li>To confirm, schedule and manage your appointment or test booking.</li>
        <li>To contact you by phone or email about your request or query.</li>
        <li>To prepare daily appointment and booking lists for our clinical and front-desk teams.</li>
        <li>To improve our services and meet our legal and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    id: "confidentiality",
    title: "4. Patient confidentiality",
    body: (
      <>
        <p>All patient information is treated as strictly confidential. Only authorised hospital staff who need the information to deliver or organise your care can see it. Staff access is protected by individual sign-in and role-based permissions.</p>
        <p>We never sell your personal information or share it for advertising. We only share it when required by law, to protect someone's life in an emergency, or with your consent.</p>
      </>
    ),
  },
  {
    id: "storage",
    title: "5. How we store and protect information",
    body: <p>Form submissions are stored in a secure cloud database provided by our website platform. Connections to this website are encrypted, and access rules ensure members of the public can never see other patients' bookings or messages. Uploaded website images are kept in private storage.</p>,
  },
  {
    id: "analytics",
    title: "6. Website visitor analytics",
    body: (
      <>
        <p>We use Lovable's built-in visitor analytics to understand how our website is used. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and doesn't identify visitors. Lovable collects this data for us. <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">Lovable's privacy policy</a> explains how it handles it.</p>
        <p>On this site it records: the pages visited, where visitors came from, their country, browser, operating system and device type, how long they stay, how fast pages load, errors, and which buttons and links are clicked. This is recorded for every visitor, without cookies and without identifying anyone. Detailed data is kept for 90 days and daily summaries for a year.</p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "7. Other services used on this website",
    body: (
      <ul>
        <li><strong>Google Fonts:</strong> our Bengali typeface is loaded from Google's servers, which receive your IP address and browser details when the page loads.</li>
        <li><strong>Google Maps:</strong> the map on our homepage is provided by Google. When it loads, Google may receive your IP address and may set its own cookies under Google's privacy policy.</li>
        <li><strong>YouTube videos:</strong> patient story videos are embedded in YouTube's privacy-enhanced mode. YouTube receives your IP address when a video is shown and may store information on your device once you play it.</li>
        <li><strong>External links:</strong> the Online Report portal and our social media pages are separate services with their own privacy policies.</li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookies and browser storage",
    body: <p>Our own website pages do not set cookies for patients or visitors. The third-party services above (Google Maps and YouTube) may set their own cookies when they load. Hospital staff who sign in to the staff portal have their sign-in session kept in their browser's storage until they sign out.</p>,
  },
  {
    id: "retention",
    title: "9. How long we keep information",
    body: <p>We keep appointment, booking and query records for as long as they are needed to provide care, respond to you and meet medical record-keeping and legal requirements, and then delete or anonymise them.</p>,
  },
  {
    id: "rights",
    title: "10. Your choices and rights",
    body: <p>You may ask us to show, correct or delete the personal information you submitted through this website, or tell us you no longer wish to be contacted. Email us or send a request through the <Link to="/send-query">Send Query</Link> page, and we will respond as soon as possible.</p>,
  },
  {
    id: "children",
    title: "11. Children",
    body: <p>Appointments and bookings for children should be made by a parent or guardian, who provides the child's details on their behalf.</p>,
  },
  {
    id: "changes",
    title: "12. Changes to this policy",
    body: <p>We may update this policy from time to time. The latest version will always be published on this page with its updated date.</p>,
  },
  {
    id: "contact",
    title: "13. Contact us",
    body: (
      <p>
        South Apollo Medical College Hospital, Jagua, Kalijira, Barishal Sadar, Barishal<br />
        Phone: <a href="tel:+8801913240139">+880 1913-240139</a><br />
        Email: <a href={`mailto:${EMAIL}`} className="break-all">{EMAIL}</a>
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <main>
      <PageHero crumb="Privacy Policy" title="Privacy Policy & Patient Data Confidentiality">How we collect, use and protect the information you share with us through this website.</PageHero>
      <section className="container-site grid gap-10 py-14 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-line-soft bg-surface-soft p-5">
            <p className="flex items-center gap-2 font-bold text-navy"><ShieldCheck className="h-5 w-5 text-sky" /> On this page</p>
            <nav aria-label="Privacy policy sections" className="mt-3 flex flex-col gap-1.5 text-sm">
              {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-navy">{s.title}</a>)}
            </nav>
          </div>
        </aside>
        <article className="min-w-0">
          <div className="mb-8 flex items-start gap-3 rounded-xl border-l-4 border-sky bg-surface-soft p-5">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
            <p className="text-sm leading-relaxed text-navy">Your health information is private. We collect only what is needed to arrange your care, and only authorised hospital staff can access it.</p>
          </div>
          <p className="text-sm text-muted-foreground">Last updated: {UPDATED}</p>
          <div className="mt-6 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-xl font-bold text-navy md:text-2xl">{s.title}</h2>
                <div className="legal-copy mt-3 space-y-3 leading-relaxed text-muted-foreground">{s.body}</div>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
