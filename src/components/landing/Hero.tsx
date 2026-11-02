import { ChevronLeft, ChevronRight } from "lucide-react";
import { asset } from "@/lib/asset";

const QUICK = [
  { label: "FIND A DOCTOR", icon: "find-a-doctor.png" },
  { label: "REQUEST AN APPOINTMENT", icon: "request-an-appointment.png" },
  { label: "ONLINE REPORT", icon: "online-report.png" },
  { label: "TELE-ONLINE", icon: "tele-online.png" },
  { label: "PATIENT & VISITORS GUIDE", icon: "patient-visitors-guide.png" },
];

export function Hero() {
  return (
    <section>
      <div className="relative">
        <img src={asset("slider.png")} alt="Breast cancer awareness campaign" className="aspect-[1920/565] w-full object-cover" />
        {[["left-4", ChevronLeft], ["right-4", ChevronRight]].map(([pos, Icon]: any) => (
          <button key={pos} aria-label="Slide" className={`absolute top-1/2 ${pos} hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/60 text-navy sm:grid`}>
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div className="container-site relative z-10 grid grid-cols-1 gap-3 py-4 sm:grid-cols-2 lg:-mt-[70px] lg:grid-cols-5 lg:gap-4 lg:py-0">
        {QUICK.map((q) => (
          <a
            key={q.label}
            href="#"
            className="group flex items-center justify-between gap-3 border border-line-soft bg-background px-5 py-3 lg:py-5 transition-colors hover:bg-navy"
          >
            <span className="text-sm font-bold leading-tight text-navy group-hover:text-primary-foreground">{q.label}</span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy">
              <img src={asset(q.icon)} alt="" className="h-7 w-7" />
            </span>
          </a>
        ))}
      </div>
      <div className="bg-strip mt-0 h-1.5 lg:mt-4" />
    </section>
  );
}
