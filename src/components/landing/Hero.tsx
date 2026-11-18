import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Banner } from "@/lib/public-data.functions";

const LABEL = "text-sm font-bold leading-tight text-navy transition-colors duration-300 ease-in-out group-hover:text-primary-foreground";
const CARD = "group relative flex items-center justify-between gap-3 border border-line-soft bg-background px-5 py-3 outline-none ring-0 transition-all duration-300 ease-in-out hover:z-10 hover:scale-[1.03] hover:border-navy hover:bg-navy focus-visible:outline-none lg:py-3.5";

function Icon({ src }: { src: string }) {
  return <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy transition-colors duration-300 ease-in-out group-hover:bg-sky"><img src={asset(src)} alt="" className="h-6 w-6" /></span>;
}

export function Hero({ banners }: { banners: Banner[] }) {
  const slides = banners.length ? banners : [{ id: "default", title: "Breast cancer awareness campaign", image_url: asset("slider.png"), cta_link: null, media_type: "image", video_url: "" }];
  const n = slides.length;
  // pos runs 0..n; pos === n shows the cloned first slide for a seamless forward loop.
  const [pos, setPos] = useState(0);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const resume = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const snap = (target: number, then?: number) => {
    setAnim(false);
    setPos(target);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnim(true);
        if (then !== undefined) setPos(then);
      }),
    );
  };

  const pauseBriefly = () => {
    setPaused(true);
    if (resume.current) clearTimeout(resume.current);
    resume.current = setTimeout(() => setPaused(false), 8000);
  };

  const next = () => {
    if (n < 2) return;
    pauseBriefly();
    setPos((p) => (p >= n ? p : p + 1));
  };
  const prev = () => {
    if (n < 2) return;
    pauseBriefly();
    if (pos === 0) snap(n, n - 1);
    else setPos((p) => p - 1);
  };
  const jump = (d: number) => {
    if (n < 2 || d === pos % n) return;
    pauseBriefly();
    setPos(d);
  };

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => setPos((p) => (p >= n ? p : p + 1)), 5000);
    return () => clearInterval(t);
  }, [n, paused]);

  useEffect(() => () => { if (resume.current) clearTimeout(resume.current); }, []);

  // Only the slide in view plays; others pause once the slide-out finishes. Reduced-motion visitors see the poster.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const active = videos.current[pos];
    if (active) {
      active.muted = true;
      if (reduce) active.pause();
      else active.play().catch(() => {});
    }
    const t = setTimeout(() => videos.current.forEach((v, idx) => { if (v && idx !== pos) v.pause(); }), 2000);
    return () => clearTimeout(t);
  }, [pos, n]);

  const onEnd = () => {
    if (pos === n) snap(0);
  };

  const current = pos % n;

  return (
    <section>
      <div
        className="relative aspect-[1920/565] w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`flex h-full will-change-transform${anim ? " transition-transform duration-[1900ms] ease-[cubic-bezier(0.08,0.96,0.18,1)]" : ""}`}
          style={{ transform: `translate3d(-${pos * 100}%, 0, 0)`, willChange: "transform" }}
          onTransitionEnd={onEnd}
        >
          {(n > 1 && slides[0] ? [...slides, slides[0]] : slides).map((s, idx) => {
            const img =
              s.media_type === "video" && s.video_url ? (
                <video
                  ref={(el) => { videos.current[idx] = el; }}
                  autoPlay={idx === 0}
                  muted
                  loop
                  playsInline
                  preload={idx === 0 ? "auto" : "metadata"}
                  poster={s.image_url || undefined}
                  aria-label={s.title ? `${s.title} — South Apollo Medical College Hospital, Barishal` : "South Apollo Medical College Hospital, Barishal"}
                  className="h-full w-full object-cover"
                >
                  <source src={s.video_url} type={/\.webm(\?|$)/i.test(s.video_url) ? "video/webm" : "video/mp4"} />
                </video>
              ) : (
                <img src={s.image_url} alt={s.title ? `${s.title} — South Apollo Medical College Hospital, Barishal` : "South Apollo Medical College Hospital, Barishal"} className="h-full w-full object-cover" />
              );
            return (
              <div key={`${s.id}-${idx}`} aria-hidden={idx !== pos} className="h-full w-full shrink-0">
                {s.cta_link ? <a href={s.cta_link} tabIndex={idx === pos ? 0 : -1}>{img}</a> : img}
              </div>
            );
          })}
        </div>
        {n > 1 && ([["left-4", ChevronLeft, prev, "Previous slide"], ["right-4", ChevronRight, next, "Next slide"]] as const).map(([p, I, fn, label]) => (
          <button key={p} onClick={fn} aria-label={label} className={`absolute top-1/2 ${p} hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/60 text-navy transition-colors hover:bg-background sm:grid`}>
            <I className="h-4 w-4" />
          </button>
        ))}
        {n > 1 && (
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2 lg:hidden">
            {slides.map((s, d) => (
              <button
                key={s.id}
                onClick={() => jump(d)}
                aria-label={`Go to slide ${d + 1}`}
                aria-current={d === current}
                className={`h-2 rounded-full transition-all duration-300 ${d === current ? "w-6 bg-sky" : "w-2 bg-background/70 hover:bg-background"}`}
              />
            ))}
          </div>
        )}
        <div className="container-site absolute inset-x-0 bottom-3 z-10 hidden grid-cols-5 gap-4 lg:grid">
          <Link to="/doctors" className={CARD}><span className={LABEL}>FIND A DOCTOR</span><Icon src="find-a-doctor.png" /></Link>
          <Link to="/request-appointment" className={CARD}><span className={LABEL}>REQUEST AN APPOINTMENT</span><Icon src="request-an-appointment.png" /></Link>
          <a href="https://report.southapollomedicalcollegehospital.com/" target="_blank" rel="noopener noreferrer" className={CARD}><span className={LABEL}>ONLINE REPORT</span><Icon src="online-report.png" /></a>
          <a href="tel:+8801885941937" className={CARD}><span className={LABEL}>TELE-ONLINE</span><Icon src="tele-online.png" /></a>
          <Link to="/patient-guide" className={CARD}><span className={LABEL}>PATIENT &amp; VISITORS GUIDE</span><Icon src="patient-visitors-guide.png" /></Link>
        </div>
        <div className="bg-strip absolute inset-x-0 bottom-0 h-1.5" />
      </div>
      <div className="container-site grid grid-cols-1 gap-3 py-4 sm:grid-cols-2 lg:hidden">
        <Link to="/doctors" className={CARD}><span className={LABEL}>FIND A DOCTOR</span><Icon src="find-a-doctor.png" /></Link>
        <Link to="/request-appointment" className={CARD}><span className={LABEL}>REQUEST AN APPOINTMENT</span><Icon src="request-an-appointment.png" /></Link>
        <a href="https://report.southapollomedicalcollegehospital.com/" target="_blank" rel="noopener noreferrer" className={CARD}><span className={LABEL}>ONLINE REPORT</span><Icon src="online-report.png" /></a>
        <a href="tel:+8801885941937" className={CARD}><span className={LABEL}>TELE-ONLINE</span><Icon src="tele-online.png" /></a>
        <Link to="/patient-guide" className={CARD}><span className={LABEL}>PATIENT &amp; VISITORS GUIDE</span><Icon src="patient-visitors-guide.png" /></Link>
      </div>
      <div className="bg-strip h-1.5 lg:hidden" />
    </section>
  );
}
