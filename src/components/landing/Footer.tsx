import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/button";

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
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className={`hospital-footer relative overflow-hidden bg-navy-deep text-primary-foreground ${isVisible ? "footer-visible" : ""}`}>
      <img src={asset("patient-care.png")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10" />
      <div className="container-site relative max-w-[1060px] pt-14">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          <div className="footer-reveal footer-contact space-y-3 text-sm">
            <p className="footer-reveal font-bold">South Apollo Tele Online</p>
            <a href="mailto:info@southapollo.com" className="footer-reveal footer-link flex w-fit items-center gap-2"><Mail className="h-4 w-4" /> info@southapollo.com</a>
            <a href="tel:+8801913240139" className="footer-reveal footer-link flex w-fit items-center gap-2 font-bold"><Phone className="h-4 w-4" /> +880 1913-240139</a>
            <div className="footer-reveal flex flex-wrap gap-3 pt-1">
              {SOCIAL.map((s) => (
                <a key={s} href="#" aria-label="Social link" className="footer-link footer-social grid h-8 w-8 place-items-center rounded-full"><img src={asset(s)} alt="" className="h-5 w-5" /></a>
              ))}
            </div>
          </div>
          <div className="footer-reveal footer-brand flex flex-col items-center gap-4">
            <img src={asset("south-apollo-footer-logo.png")} alt="South Apollo Medical College Hospital" className="footer-reveal h-40 w-40 object-contain" />
            <Button asChild className="footer-reveal footer-link rounded-full bg-sky px-8 text-primary-foreground hover:bg-sky/90"><a href="#">Send Query</a></Button>
          </div>
          <div className="footer-reveal footer-address space-y-3 text-sm md:text-right">
            <p className="footer-reveal font-bold">Barishal</p>
            <p className="footer-reveal leading-relaxed">South Apollo Medical College Hospital, Jagua, Kalijira, Barishal Sadar, Barishal</p>
            <p className="footer-reveal text-xs opacity-80">© Copyright 2026 South Apollo. All rights reserved.</p>
          </div>
        </div>
        <nav className="footer-reveal footer-navigation mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs">
          {LINKS.map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
        </nav>
        <div className="footer-reveal footer-statement mx-auto mt-12 max-w-5xl pb-10 text-center">
          <p className="footer-premium-text text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Only Private Medical College and Hospital in Barishal Division</p>
        </div>
      </div>
    </footer>
  );
}
