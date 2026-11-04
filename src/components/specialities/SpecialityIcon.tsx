import { asset } from "@/lib/asset";
import type { Speciality } from "@/lib/specialities";

/** Render the Figma export's original artwork and composite-layer positioning. */
export function SpecialityIcon({ speciality }: { speciality: Speciality }) {
  return (
    <span aria-hidden="true" className="speciality-icon relative block h-10 w-10 shrink-0">
      <img src={asset(speciality.image)} alt="" width={40} height={40} className={`absolute object-contain ${speciality.artwork === "neurology" ? "left-0 top-0.5 h-9 w-10" : speciality.artwork === "orthopaedics" ? "left-0.5 top-0.5 h-9 w-9" : speciality.artwork === "lungs" ? "left-px top-px h-[38px] w-[38px]" : speciality.artwork === "rheumatology" ? "left-2 top-0.5 h-9 w-5" : speciality.artwork === "thoracic" ? "left-0.5 top-0.5 h-9 w-9" : "inset-0 h-10 w-10"}`} />
      {speciality.overlay && <img src={asset(speciality.overlay)} alt="" className="absolute left-2 top-[13px] h-3.5 w-[23px] object-contain" />}
    </span>
  );
}