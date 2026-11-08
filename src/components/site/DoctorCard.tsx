import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/public-data.functions";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="flex flex-col border border-line-soft bg-background transition-shadow hover:shadow-card">
      <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
        {doctor.image_url ? <img src={doctor.image_url} alt={doctor.name} loading="lazy" className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center text-muted-foreground"><UserRound className="h-16 w-16" /></div>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-base font-bold text-navy">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.degrees}</p>
        <p className="text-sm font-medium text-navy">{doctor.designation}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-sky">{doctor.department_name}</p>
        {doctor.visiting_days.length > 0 && <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" />{doctor.visiting_days.join(", ")}</p>}
        {doctor.visiting_hours && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{doctor.visiting_hours}</p>}
        <Button asChild className="mt-auto rounded-none bg-navy pt-0 hover:bg-sky" size="sm">
          <Link to="/request-appointment" search={{ doctor: doctor.id }} className="mt-4">Book Appointment</Link>
        </Button>
      </div>
    </article>
  );
}
