import { Link } from "@tanstack/react-router";
import { BriefcaseMedical, UserRound } from "lucide-react";
import type { Doctor } from "@/lib/public-data.functions";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to="/doctors/$id"
      params={{ id: doctor.id }}
      aria-label={`View profile of ${doctor.name}`}
      className="group flex cursor-pointer flex-col border border-line-soft bg-background transition-all duration-200 hover:-translate-y-1 hover:border-sky hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
        {doctor.image_url ? (
          <img src={doctor.image_url} alt={`${doctor.name}${doctor.designation ? `, ${doctor.designation}` : ""} — South Apollo Medical College Hospital, Barishal`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground"><UserRound className="h-16 w-16" /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-base font-bold text-navy">{doctor.name}</h3>
        {doctor.degrees && <p className="text-sm text-muted-foreground">{doctor.degrees}</p>}
        {doctor.designation && <p className="text-sm font-medium text-navy">{doctor.designation}</p>}
        {doctor.institution && <p className="text-sm text-muted-foreground">{doctor.institution}</p>}
        {doctor.department_name && <p className="text-xs font-semibold uppercase tracking-wide text-sky">{doctor.department_name}</p>}
        {doctor.experience && (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><BriefcaseMedical className="h-3.5 w-3.5 shrink-0 text-clinical-teal" />{doctor.experience}</p>
        )}
      </div>
    </Link>
  );
}
