import { ArrowLeft, ArrowRight } from "lucide-react";
import { asset } from "@/lib/asset";

export const SPECIALITIES = [
  ["Accident & Emergency", "variant6.png"],
  ["Anesthesia and Pain Medicine", "variant10.png"],
  ["Cancer Care Centre", "variant14.png"],
  ["Cardiology Care Centre", "variant18.png"],
  ["Cardiothoracic & Vascular Surgery", "variant22.png"],
  ["Cardiothoracic Anaesthesia", "variant26.png"],
  ["Child Development Centre", "variant30.png"],
  ["Counselling Centre", "variant34.png"],
  ["Critical Care Units", "variant38.png"],
  ["Dental & Maxillofacial Surgery", "dentish-chair.png"],
  ["Dermatology & Venereology", "variant46.png"],
  ["Diabetology & Endocrinology", "variant50.png"],
  ["Diagnostic & Interventional Radiology", "variant54.png"],
  ["Dietetics & Nutrition", "variant58.png"],
  ["ENT & Head Neck Surgery", "variant62.png"],
] as const;

export function WhyChoose() {
  return (
    <section className="container-site py-14 text-center md:py-20">
      <h2 className="section-title">Why Choose South Apollo Medical College Hospital</h2>
      <p className="mx-auto mt-6 max-w-5xl text-sm font-medium leading-[1.8] text-navy md:text-base">
        South Apollo Medical College Hospital is a 425-bed multidisciplinary super-specialty tertiary care hospital and the first in
        Bangladesh to receive JCI accreditation. The Joint Commission International (JCI) is a U.S.-based accreditation body dedicated
        to improving healthcare quality and safety worldwide. South Apollo Medical College Hospital is renowned for its world-class
        patient care, combining advanced medical technology with compassionate service. The hospital is equipped with state-of-the-art
        facilities, cutting-edge diagnostic services, and modern surgical techniques and staffed by a team of world-class physicians,
        highly trained nurses, and skilled technicians across various medical disciplines.
      </p>
    </section>
  );
}

export function Specialities() {
  return (
    <section className="container-site grid gap-8 pb-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-6">
      <img src={asset("evercarebd-specialities.png")} alt="Doctor with patient" className="h-full max-h-[480px] w-full rounded-sm object-cover" />
      <div>
        <h2 className="section-title">Our Specialities</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {SPECIALITIES.map(([name, icon]) => (
            <a key={name} href="#" className="flex flex-col items-center justify-center gap-3 rounded-sm border border-line-soft bg-background px-3 py-5 text-center transition-shadow hover:shadow-card">
              <img src={asset(icon)} alt="" className="h-10 w-10" />
              <span className="text-xs leading-snug text-navy">{name}</span>
            </a>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {[ArrowLeft, ArrowRight].map((I, i) => (
              <button key={i} aria-label={i ? "Next" : "Previous"} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-lime text-lime ${i ? "" : "opacity-50"}`}>
                <I className="h-4 w-4" />
              </button>
            ))}
          </div>
          <a href="#" className="bg-violet px-6 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">View All Specialities</a>
        </div>
      </div>
    </section>
  );
}
