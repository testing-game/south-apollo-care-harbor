import { useRef } from "react";
import { ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { asset } from "@/lib/asset";

const LOGOS = ["", "-2", "-3", "-4", "-5"].map((s) => `evercare-partner-logo${s}.png`);
const SOCIAL = ["variant72.png", "variant73.png", "variant74.png", "variant75.png", "variant76.png", "variant77.png"];
const LINKS = [
  "Find a Doctor", "Request an Appointment", "Online Report", "Career", "Contact Us", "Speciality", "Health Package",
  "News & Media", "Blogs", "About Us", "Patient Stories", "Pulse Magazine", "Tele Online", "Privacy Policy", "Patient & Visitor Guide",
];

export function Corporate() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * 200, behavior: "smooth" });
  return (
    <section className="container-site max-w-[1060px] py-16 text-center md:py-20">
      <h2 className="section-title">Corporate Services</h2>
      <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed text-navy md:text-base">
        <strong>One-Stop Service Desk:</strong> For the convenience of corporate clients, South Apollo Medical College Hospital operates a
        dedicated One-Stop Service Desk in the hospital atrium. This service desk ensures prompt assistance and streamlined experiences for
        referral patients, International patients and corporate patients. Our operating hours: 9:00 AM to 5:00 PM (except government
        holidays). We offer comprehensive healthcare management to address customized needs promptly and efficiently.
      </p>
      <div className="mt-10 flex items-center gap-3">
        <button onClick={() => scroll(-1)} aria-label="Previous" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-primary-foreground"><ChevronLeft className="h-4 w-4" /></button>
        <div ref={track} className="flex flex-1 snap-x gap-6 overflow-x-auto [scrollbar-width:none]">
          {LOGOS.map((l) => (
            <div key={l} className="grid h-28 min-w-[150px] flex-1 snap-start place-items-center">
              <img src={asset(l)} alt="Corporate partner logo" className="max-h-24 w-auto object-contain" />
            </div>
          ))}
        </div>
        <button onClick={() => scroll(1)} aria-label="Next" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-primary-foreground"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </section>
  );
}

export function MapSection() {
  return (
    <section className="h-[320px] w-full md:h-[440px]">
      <iframe
        title="Hospital location"
        className="h-full w-full border-0"
        loading="lazy"
        src="https://www.google.com/maps?q=Evercare+Hospital+Dhaka+Bashundhara&output=embed"
      />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-primary-foreground">
      <img src={asset("patient-care.png")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10" />
      <div className="container-site relative max-w-[1060px] pt-14">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          <div className="space-y-3 text-sm">
            <p className="font-bold">South Apollo Tele Online</p>
            <a href="mailto:info@southapollo.com" className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@southapollo.com</a>
            <a href="tel:10678" className="flex items-center gap-2 font-bold"><Phone className="h-4 w-4" /> 10678</a>
            <a href="#" className="block pt-3 text-xs underline">Privacy Policy</a>
            <div className="flex gap-3 pt-1">
              {SOCIAL.map((s) => (
                <a key={s} href="#" aria-label="Social link"><img src={asset(s)} alt="" className="h-5 w-5" /></a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img src={asset("evercare-hospital.png")} alt="South Apollo Medical College Hospital" className="h-24 w-auto" />
            <a href="#" className="rounded-full bg-sky px-8 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90">Send Query</a>
          </div>
          <div className="space-y-3 text-sm md:text-right">
            <p className="font-bold">Dhaka</p>
            <p className="leading-relaxed">Plot # 81, Block-E,<br />Bashundhara R/A, Dhaka 1229, Bangladesh.</p>
            <p className="text-xs opacity-80">© Copyright 2026 South Apollo. All rights reserved.</p>
          </div>
        </div>
        <nav className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs">
          {LINKS.map((l) => <a key={l} href="#" className="hover:text-sky">{l}</a>)}
        </nav>
        <p className="mt-10 select-none text-center text-[clamp(2.5rem,9vw,7.5rem)] font-black leading-none tracking-wide text-primary-foreground/10">
          Transforming Healthcare
        </p>
      </div>
    </footer>
  );
}
