import { Stethoscope } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Speciality } from "@/lib/specialities";

export function SpecialityCard({ speciality }: { speciality: Speciality }) {
  const Icon = speciality.icon ?? Stethoscope;
  return (
    <article tabIndex={0} className="speciality-card group flex h-full min-h-36 flex-col items-center justify-center gap-4 rounded-lg border border-line-soft bg-background px-3 py-5 text-center text-navy outline-none transition-all duration-300 hover:-translate-y-1 hover:border-speciality-active hover:bg-speciality-active hover:text-primary-foreground hover:shadow-card focus-visible:-translate-y-1 focus-visible:border-speciality-active focus-visible:bg-speciality-active focus-visible:text-primary-foreground focus-visible:ring-2 focus-visible:ring-sky motion-reduce:transform-none motion-reduce:transition-none">
      {speciality.image ? <img src={asset(speciality.image)} alt="" className="speciality-icon h-10 w-10 object-contain" /> : <Icon aria-hidden="true" className="h-10 w-10 shrink-0" strokeWidth={1.6} />}
      <h3 className="text-xs font-medium leading-snug">{speciality.title}</h3>
    </article>
  );
}