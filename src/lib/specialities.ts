import { Activity, Baby, Bone, Brain, CircleDot, Dna, Droplets, Eye, FlaskConical, HeartPulse, Microscope, PersonStanding, Pill, Radiation, ScanLine, Scissors, Stethoscope, Syringe, TestTube, Venus, Wind, type LucideIcon } from "lucide-react";

export type Speciality = { title: string; image?: string; icon?: LucideIcon };
export const SPECIALITIES: Speciality[] = [
  { title: "Accident & Emergency", image: "variant6.png" },
  { title: "Anesthesia and Pain Medicine", image: "variant10.png" },
  { title: "Cancer Care Centre", image: "variant14.png" },
  { title: "Cardiology Care Centre", image: "variant18.png" },
  { title: "Cardiothoracic & Vascular Surgery", image: "variant22.png" },
  { title: "Cardiothoracic Anaesthesia", image: "variant26.png" },
  { title: "Child Development Centre", image: "variant30.png" },
  { title: "Counselling Centre", image: "variant34.png" },
  { title: "Critical Care Units", image: "variant38.png" },
  { title: "Dental & Maxillofacial Surgery", image: "dentish-chair.png" },
  { title: "Dermatology & Venereology", image: "variant46.png" },
  { title: "Diabetology & Endocrinology", image: "variant50.png" },
  { title: "Diagnostic & Interventional Radiology", image: "variant54.png" },
  { title: "Dietetics & Nutrition", image: "variant58.png" },
  { title: "ENT & Head Neck Surgery", image: "variant62.png" },
  { title: "Fertility Centre", icon: Dna },
  { title: "Gastroenterology & Hepatology", icon: Activity },
  { title: "General & Laparoscopic Surgery", icon: Scissors },
  { title: "Hematology & Stem Cell Transplant", icon: Droplets },
  { title: "Hepatobiliary, Pancreatic and Liver Transplant", icon: ScanLine },
  { title: "Internal Medicine", icon: Stethoscope },
  { title: "Joint Care & Wellness Centre", icon: Bone },
  { title: "Kidney Transplant Program", icon: Activity },
  { title: "Lab Medicine", icon: Microscope },
  { title: "Lithotripsy", icon: CircleDot },
  { title: "Neonatology", icon: Baby },
  { title: "Nephrology", icon: Droplets },
  { title: "Neurology", icon: Brain },
  { title: "Neurosurgery", icon: Brain },
  { title: "Nuclear Medicine", icon: Radiation },
  { title: "Obstetrics and Gynaecology", icon: Venus },
  { title: "Ophthalmology", icon: Eye },
  { title: "Orthopaedics", icon: Bone },
  { title: "Paediatric Cardiology", icon: HeartPulse },
  { title: "Paediatric Surgery & Paediatric Urology", icon: Baby },
  { title: "Paediatrics", icon: Baby },
  { title: "Physical Medicine & Rehabilitation", icon: PersonStanding },
  { title: "Plastic, Reconstructive & Cosmetic Surgery", icon: Scissors },
  { title: "Psychiatry", icon: Brain },
  { title: "Respiratory Medicine", icon: Wind },
  { title: "Rheumatology", icon: Pill },
  { title: "Thoracic Surgery", icon: Stethoscope },
  { title: "Transfusion Medicine", icon: Syringe },
  { title: "Urology", icon: TestTube },
];

export const SPECIALITIES_PAGE_SIZE = 8;
export function specialityBatch(page: number) {
  const lastPage = Math.ceil(SPECIALITIES.length / SPECIALITIES_PAGE_SIZE) - 1;
  const safePage = Math.max(0, Math.min(lastPage, page));
  // Keep every view full, including the final batch, without duplicating cards within a view.
  const start = Math.min(safePage * SPECIALITIES_PAGE_SIZE, SPECIALITIES.length - SPECIALITIES_PAGE_SIZE);
  return SPECIALITIES.slice(start, start + SPECIALITIES_PAGE_SIZE);
}
export function filterSpecialities(query: string) {
  const normalized = query.trim().toLowerCase();
  return SPECIALITIES.filter(({ title }) => title.toLowerCase().includes(normalized));
}