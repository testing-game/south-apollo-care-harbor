import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Banner } from "@/lib/public-data.functions";

const LABEL = "text-sm font-bold leading-tight text-navy transition-colors duration-300 ease-in-out group-hover:text-primary-foreground";
const CARD = "group relative flex items-center justify-between gap-3 border border-line-soft bg-background px-5 py-3 outline-none ring-0 transition-all duration-300 ease-in-out hover:z-10 hover:scale-[1.03] hover:border-navy hover:bg-navy focus-visible:outline-none lg:py-5";

function Icon({ src }: { src: string }) {
  return <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy transition-colors duration-300 ease-in-out group-hover:bg-sky"><img src={asset(src)} alt="" className="h-7 w-7" /></span>;
}

export function Hero({ banners }: { banners: Banner[] }) {
  const slides = banners.length ? banners : [{ id: "default", title: "Breast cancer awareness campaign", image_url: asset("slider.png"), cta_link: null }];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides.length]);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  return (
    <section>
      <div className="relative aspect-[1920/565] w-full overflow-hidden">
        {slides.map((s, n) => {
          const img = <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" />;
          return (
            <div key={s.id} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-700 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              {s.cta_link ? <a href={s.cta_link}>{img}</a> : img}
            </div>
          );
        })}
        {slides.length > 1 && ([["left-4", ChevronLeft, -1], ["right-4", ChevronRight, 1]] as const).map(([pos, I, d]) => (
          <button key={pos} onClick={() => go(d)} aria-label={d < 0 ? "Previous slide" : "Next slide"} className={`absolute top-1/2 ${pos} hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/60 text-navy sm:grid`}>
            <I className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div className="container-site relative z-10 grid grid-cols-1 gap-3 py-4 sm:grid-cols-2 lg:-mt-[70px] lg:grid-cols-5 lg:gap-4 lg:py-0">
        <Link to="/doctors" className={CARD}><span className={LABEL}>FIND A DOCTOR</span><Icon src="find-a-doctor.png" /></Link>
        <Link to="/request-appointment" className={CARD}><span className={LABEL}>REQUEST AN APPOINTMENT</span><Icon src="request-an-appointment.png" /></Link>
        <a href="https://report.southapollomedicalcollegehospital.com/" target="_blank" rel="noopener noreferrer" className={CARD}><span className={LABEL}>ONLINE REPORT</span><Icon src="online-report.png" /></a>
        <a href="tel:+8801913240139" className={CARD}><span className={LABEL}>TELE-ONLINE</span><Icon src="tele-online.png" /></a>
        <Link to="/patient-guide" className={CARD}><span className={LABEL}>PATIENT &amp; VISITORS GUIDE</span><Icon src="patient-visitors-guide.png" /></Link>
      </div>
      <div className="bg-strip mt-0 h-1.5 lg:mt-4" />
    </section>
  );
}
