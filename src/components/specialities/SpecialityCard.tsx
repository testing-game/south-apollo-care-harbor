import { SpecialityIcon } from "./SpecialityIcon";
import type { Speciality } from "@/lib/specialities";

export function SpecialityCard({ speciality, directory = false }: { speciality: Speciality; directory?: boolean }) {
  return (
    <article tabIndex={0} className={`speciality-card group flex flex-col items-center rounded-[12px] border border-speciality-border bg-speciality-surface px-3 text-center text-speciality-label outline-none transition-all duration-300 hover:-translate-y-1 hover:border-speciality-active hover:bg-speciality-active hover:text-speciality-on-active hover:shadow-card focus-visible:-translate-y-1 focus-visible:border-speciality-active focus-visible:bg-speciality-active focus-visible:text-speciality-on-active focus-visible:ring-2 focus-visible:ring-sky motion-reduce:transform-none motion-reduce:transition-none ${directory ? "h-[150px] justify-start gap-[19px] pt-[29px] pb-3" : "h-full min-h-36 justify-center gap-4 py-5"}`}>
      <SpecialityIcon speciality={speciality} />
      <h3 className={directory ? "w-full text-sm font-normal leading-[1.43]" : "text-xs font-medium leading-snug"}>{speciality.title}</h3>
    </article>
  );
}