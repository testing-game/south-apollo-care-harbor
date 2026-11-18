import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, Cross, Dna, ExternalLink, HeartPulse, Mail, MapPin, Phone, Stethoscope, type LucideIcon } from "lucide-react";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/button";
import { SOCIAL_ICONS } from "@/components/site/SocialIcon";
import { socialLinksQuery } from "@/lib/public-queries";
import { SOCIAL_LABELS, visibleSocialLinks, type SocialPlatform } from "@/lib/social-links";

type FooterLink = { label: string; to?: FooterRoute; href?: string; external?: boolean };
type FooterRoute = "/doctors" | "/request-appointment" | "/career" | "/send-query" | "/specialities" | "/health-checkup-all-packages" | "/news" | "/blogs" | "/about" | "/stories" | "/health-magazine" | "/privacy-policy" | "/patient-guide";

export const FOOTER_LINKS: FooterLink[] = [
  { label: "Find a Doctor", to: "/doctors" },
  { label: "Request an Appointment", to: "/request-appointment" },
  { label: "Online Report", href: "https://report.southapollomedicalcollegehospital.com/", external: true },
  { label: "Career", to: "/career" },
  { label: "Contact Us", to: "/send-query" },
  { label: "Speciality", to: "/specialities" },
  { label: "Health Package", to: "/health-checkup-all-packages" },
  { label: "News & Media", to: "/news" },
  { label: "Blogs", to: "/blogs" },
  { label: "About Us", to: "/about" },
  { label: "Patient Stories", to: "/stories" },
  { label: "Health Magazine", to: "/health-magazine" },
  { label: "Tele Online", href: "tel:+8801885941937" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Patient & Visitor Guide", to: "/patient-guide" },
];

const MotionLink = motion.create(Link);

/** Faint medical line icons that drift slowly behind the footer content. */
const FLOATERS: { Icon: LucideIcon; className: string; dx: number; dy: number; rot: number; duration: number }[] = [
  { Icon: Activity, className: "left-[4%] top-[12%] h-24 w-24", dx: 18, dy: -14, rot: 4, duration: 19 },
  { Icon: Stethoscope, className: "left-[30%] top-[58%] h-20 w-20", dx: -14, dy: 16, rot: -6, duration: 23 },
  { Icon: Cross, className: "right-[30%] top-[8%] h-14 w-14", dx: 12, dy: 18, rot: 8, duration: 17 },
  { Icon: Dna, className: "right-[5%] top-[40%] h-24 w-24", dx: -16, dy: -12, rot: -5, duration: 25 },
  { Icon: HeartPulse, className: "left-[56%] bottom-[8%] h-16 w-16", dx: 14, dy: -16, rot: 5, duration: 21 },
  { Icon: Activity, className: "right-[14%] bottom-[14%] h-16 w-28", dx: -18, dy: 10, rot: -3, duration: 18 },
  { Icon: Cross, className: "left-[16%] bottom-[22%] h-10 w-10", dx: 10, dy: -12, rot: -8, duration: 16 },
];

function FooterAmbient({ still }: { still: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-primary-foreground">
      {FLOATERS.map(({ Icon, className, dx, dy, rot, duration }, i) => (
        <motion.div
          key={i}
          className={`absolute opacity-[0.06] ${className}`}
          {...(still ? {} : { animate: { x: [0, dx, 0], y: [0, dy, 0], rotate: [0, rot, 0] } })}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * 1.3 }}
        >
          <Icon className="h-full w-full" strokeWidth={1.1} />
        </motion.div>
      ))}
    </div>
  );
}

export function Corporate() {
  return (
    <section className="container-site py-16 text-center md:py-20">
      <h2 className="section-title">Corporate Services</h2>
      <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed text-navy md:text-base">
        <strong>One-Stop Service Desk:</strong> For the convenience of corporate clients, South Apollo Medical College Hospital operates a
        dedicated One-Stop Service Desk in the hospital atrium. This service desk ensures prompt assistance and streamlined experiences for
        referral patients, International patients and corporate patients. Our operating hours: 9:00 AM to 5:00 PM (except government
        holidays). We offer comprehensive healthcare management to address customized needs promptly and efficiently.
      </p>
    </section>
  );
}

const MAPS_URL = "https://maps.app.goo.gl/9GDeAGMpzTN1on5z8";

export function MapSection() {
  return (
    <section className="w-full">
      <iframe
        title="South Apollo Medical College Hospital, Barishal location map"
        className="h-[320px] w-full border-0 md:h-[440px]"
        loading="lazy"
        src="https://www.google.com/maps?q=South+Apollo+Medical+College+%26+Hospital+Barishal&output=embed"
      />
      <div className="container-site flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky" />
          <div>
            <p className="text-sm font-bold text-navy">South Apollo Medical College Hospital</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Jagua, Kalijira, Barishal Sadar, Barishal, Bangladesh</p>
          </div>
        </div>
        <Button asChild className="shrink-0 rounded-full bg-navy px-6 text-primary-foreground transition-colors duration-300 hover:bg-sky hover:text-primary-foreground">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </section>
  );
}

export function Footer() {
  const reducedMotion = !!useReducedMotion();
  const { data: social = [] } = useQuery(socialLinksQuery);
  const links = visibleSocialLinks(social);
  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } },
  };
  const reveal: Variants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger} className="hospital-footer relative overflow-hidden bg-navy-deep text-primary-foreground">
      <img src={asset("patient-care.png")} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10" />
      <FooterAmbient still={reducedMotion} />
      <div className="container-site relative max-w-[1060px] pt-14">
        <motion.div variants={stagger} className="grid gap-10 md:grid-cols-3 md:items-start">
          <motion.div variants={stagger} className="footer-contact space-y-3 text-sm">
            <motion.p variants={reveal} className="font-bold">South Apollo Tele Online</motion.p>
            <motion.div variants={reveal}><a href="mailto:info@southapollomedicalcollegehospital.com" className="footer-contact-link flex w-fit max-w-full items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><span className="min-w-0 [overflow-wrap:anywhere]">info@<wbr />southapollomedicalcollegehospital.com</span></a></motion.div>
            <motion.div variants={reveal}><a href="tel:+8801885941937" className="footer-contact-link flex w-fit items-center gap-2 font-bold"><Phone className="h-4 w-4 shrink-0" /> Appointment: +880 1885-941937</a></motion.div>
            <motion.div variants={reveal}><a href="tel:+8801324165631" className="footer-contact-link flex w-fit items-center gap-2 font-bold"><Phone className="h-4 w-4 shrink-0" /> Helpline: +880 1324-165631</a></motion.div>
            {links.length > 0 && (
              <motion.div variants={stagger} className="flex flex-wrap gap-3 pt-1">
                {links.map((l) => {
                  const platform = l.platform as SocialPlatform;
                  const Icon = SOCIAL_ICONS[platform];
                  return (
                    <motion.a variants={reveal} key={platform} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`South Apollo on ${SOCIAL_LABELS[platform]}`} className="footer-social grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/25"><Icon className="h-4 w-4" /></motion.a>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
          <motion.div variants={stagger} className="footer-brand flex flex-col items-center gap-4">
            <motion.div variants={reveal} className="grid h-36 w-36 place-items-center rounded-full bg-primary-foreground p-2 shadow-lg">
              <img src={asset("logoo.png")} alt="South Apollo Medical College Hospital, Barishal logo" className="h-full w-full object-contain" />
            </motion.div>
            <motion.div variants={reveal}>
              <Button asChild className="footer-query-btn rounded-full bg-sky px-8 text-primary-foreground shadow-md transition-all duration-300 hover:scale-105 hover:bg-sky hover:text-primary-foreground hover:shadow-lg hover:brightness-110">
                <Link to="/send-query">Send Query</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={stagger} className="footer-address space-y-3 text-sm md:text-right">
            <motion.p variants={reveal} className="font-bold">Barishal</motion.p>
            <motion.p variants={reveal} className="leading-relaxed">South Apollo Medical College Hospital, Jagua, Kalijira, Barishal Sadar, Barishal</motion.p>
            <motion.p variants={reveal} className="text-xs opacity-80">© Copyright 2026 South Apollo. All rights reserved.</motion.p>
          </motion.div>
        </motion.div>
        <motion.nav aria-label="Footer" variants={stagger} className="footer-navigation mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs">
          {FOOTER_LINKS.map((l) =>
            l.to ? (
              <MotionLink variants={reveal} key={l.label} to={l.to} className="footer-link footer-nav-link">{l.label}</MotionLink>
            ) : (
              <motion.a variants={reveal} key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="footer-link footer-nav-link">{l.label}</motion.a>
            ),
          )}
        </motion.nav>
        <motion.div variants={reveal} className="footer-statement mx-auto mt-12 max-w-5xl pb-10 text-center">
          <p className="footer-premium-text text-xl font-bold leading-relaxed sm:whitespace-nowrap sm:text-sm md:text-base lg:text-2xl">Only Private Medical College and Hospital in Barishal Division</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
