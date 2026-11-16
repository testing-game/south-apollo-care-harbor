export type Artwork = "neurology" | "orthopaedics" | "lungs" | "rheumatology" | "thoracic";

/** Built-in Figma artwork: original filename plus composite-layer geometry for the few icons that need it. */
export type BuiltInArtwork = { title: string; image: string; artwork?: Artwork; overlay?: string };

/** What the speciality cards render — built from a database row. */
export type Speciality = { id: string; title: string; iconUrl: string; description: string; artwork?: Artwork; overlay?: string };

// Original ordering and artwork mapping from the supplied Figma Section export (seeded into the database).
export const SPECIALITIES: BuiltInArtwork[] = [
  {"title": "Accident & Emergency", "image": "speciality-variant8.png"} ,
  {"title": "Anesthesia and Pain Medicine", "image": "speciality-variant12.png"} ,
  {"title": "Cancer Care Centre", "image": "speciality-variant16.png"} ,
  {"title": "Cardiology Care Centre", "image": "speciality-variant20.png"} ,
  {"title": "Cardiothoracic & Vascular Surgery", "image": "speciality-variant24.png"} ,
  {"title": "Cardiothoracic Anaesthesia", "image": "speciality-variant28.png"} ,
  {"title": "Child Development Centre", "image": "speciality-variant32.png"} ,
  {"title": "Counselling Centre", "image": "speciality-variant36.png"} ,
  {"title": "Critical Care Units", "image": "speciality-variant40.png"} ,
  {"title": "Dental & Maxillofacial Surgery", "image": "speciality-dentish-chair.png"} ,
  {"title": "Dermatology & Venereology", "image": "speciality-variant48.png"} ,
  {"title": "Diabetology & Endocrinology", "image": "speciality-variant52.png"} ,
  {"title": "Diagnostic & Interventional Radiology", "image": "speciality-variant56.png"} ,
  {"title": "Dietetics & Nutrition", "image": "speciality-variant60.png"} ,
  {"title": "ENT & Head Neck Surgery", "image": "speciality-variant64.png"} ,
  {"title": "Fertility Centre", "image": "speciality-variant68.png"} ,
  {"title": "Gastroenterology & Hepatology", "image": "speciality-variant72.png"} ,
  {"title": "General & Laparoscopic Surgery", "image": "speciality-variant76.png"} ,
  {"title": "Hematology & Stem Cell Transplant", "image": "speciality-variant80.png"} ,
  {"title": "Hepatobiliary, Pancreatic and Liver Transplant", "image": "speciality-variant84.png"} ,
  {"title": "Internal Medicine", "image": "speciality-variant88.png"} ,
  {"title": "Joint Care & Wellness Centre", "image": "speciality-variant92.png"} ,
  {"title": "Kidney Transplant Program", "image": "speciality-variant96.png"} ,
  {"title": "Lab Medicine", "image": "speciality-variant100.png"} ,
  {"title": "Lithotripsy", "image": "speciality-variant104.png"} ,
  {"title": "Neonatology", "image": "speciality-variant108.png"} ,
  {"title": "Nephrology", "image": "speciality-variant112.png"} ,
  {"title": "Neurology", "image": "speciality-210539896.png", "artwork": "neurology"} ,
  {"title": "Neurosurgery", "image": "speciality-variant120.png"} ,
  {"title": "Nuclear Medicine", "image": "speciality-variant124.png"} ,
  {"title": "Obstetrics and Gynaecology", "image": "speciality-variant128.png"} ,
  {"title": "Ophthalmology", "image": "speciality-variant132.png"} ,
  {"title": "Orthopaedics", "image": "speciality-x367.png", "artwork": "orthopaedics"} ,
  {"title": "Paediatric Cardiology", "image": "speciality-variant140.png"} ,
  {"title": "Paediatric Surgery & Paediatric Urology", "image": "speciality-variant144.png"} ,
  {"title": "Paediatrics", "image": "speciality-variant148.png"} ,
  {"title": "Physical Medicine & Rehabilitation", "image": "speciality-variant152.png"} ,
  {"title": "Plastic, Reconstructive & Cosmetic Surgery", "image": "speciality-variant156.png"} ,
  {"title": "Psychiatry", "image": "speciality-variant160.png"} ,
  {"title": "Respiratory Medicine", "image": "speciality-lungs.png", "artwork": "lungs"} ,
  {"title": "Rheumatology", "image": "speciality-group.png", "artwork": "rheumatology", "overlay": "speciality-vector.svg"} ,
  {"title": "Thoracic Surgery", "image": "speciality-variant170.png", "artwork": "thoracic"} ,
  {"title": "Transfusion Medicine", "image": "speciality-variant174.png"} ,
  {"title": "Urology", "image": "speciality-variant178.png"} ,
];

const BY_FILE = new Map(SPECIALITIES.map((s) => [s.image, s]));

/** Last path segment of an icon URL, ignoring any query string (signed URLs carry a token). */
export function iconFileOf(url: string): string {
  return url.split("?")[0]?.split("/").pop() ?? "";
}

type SpecialityRowLike = { id: string; name: string; icon_url: string; description: string | null };

/** Database row → card data. Built-in Figma icons keep their composite geometry; uploaded icons render as-is. */
export function toSpeciality(row: SpecialityRowLike): Speciality {
  const built = BY_FILE.get(iconFileOf(row.icon_url));
  return {
    id: row.id, title: row.name, iconUrl: row.icon_url, description: (row.description ?? "").trim(),
    ...(built?.artwork ? { artwork: built.artwork } : {}),
    ...(built?.overlay ? { overlay: built.overlay } : {}),
  };
}

export const SPECIALITIES_PAGE_SIZE = 8;
export function specialityPageCount(list: readonly unknown[]) {
  return Math.max(1, Math.ceil(list.length / SPECIALITIES_PAGE_SIZE));
}
export function specialityBatch<T>(list: readonly T[], page: number): T[] {
  const lastPage = specialityPageCount(list) - 1;
  const safePage = Math.max(0, Math.min(lastPage, page));
  // Keep every view full, including the final batch, without duplicating cards within a view.
  const start = Math.max(0, Math.min(safePage * SPECIALITIES_PAGE_SIZE, list.length - SPECIALITIES_PAGE_SIZE));
  return list.slice(start, start + SPECIALITIES_PAGE_SIZE);
}
export function filterSpecialities<T extends { title: string }>(list: readonly T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  return list.filter(({ title }) => title.toLowerCase().includes(normalized));
}
