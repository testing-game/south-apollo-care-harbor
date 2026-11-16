import { asset } from "@/lib/asset";
import type { Speciality } from "@/lib/specialities";

type IconProps = Pick<Speciality, "iconUrl" | "artwork" | "overlay">;

/** Built-in Figma artwork keeps its composite-layer positioning; uploaded icons fill the 40×40 box. */
export function SpecialityIcon({ speciality }: { speciality: IconProps }) {
  const geometry = speciality.artwork === "neurology" ? "left-0 top-0.5 h-9 w-10" : speciality.artwork === "orthopaedics" ? "left-0.5 top-0.5 h-9 w-9" : speciality.artwork === "lungs" ? "left-px top-px h-[38px] w-[38px]" : speciality.artwork === "rheumatology" ? "left-2 top-0.5 h-9 w-5" : speciality.artwork === "thoracic" ? "left-0.5 top-0.5 h-9 w-9" : "inset-0 h-10 w-10";
  return (
    <span aria-hidden="true" className="speciality-icon relative block h-10 w-10 shrink-0">
      {speciality.iconUrl && <img src={speciality.iconUrl} alt="" width={40} height={40} className={`absolute object-contain ${geometry}`} />}
      {speciality.overlay && <img src={asset(speciality.overlay)} alt="" className="absolute left-2 top-[13px] h-3.5 w-[23px] object-contain" />}
    </span>
  );
}
