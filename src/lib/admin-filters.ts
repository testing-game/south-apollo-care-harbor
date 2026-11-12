type DoctorLike = { name: string; degrees: string | null; department_name: string | null; room_number: string | null; speciality_id: string | null };
type PackageLike = { title: string; price: number | null; included_tests: string[] };

export const ALL_SPECIALITIES = "all";

/** Case-insensitive match on name, degrees, speciality/department or room; optional exact speciality filter. */
export function filterAdminDoctors<T extends DoctorLike>(list: T[], search: string, specialityId: string = ALL_SPECIALITIES, specialityNames: Record<string, string> = {}): T[] {
  const n = search.trim().toLowerCase();
  return list.filter((d) => {
    if (specialityId !== ALL_SPECIALITIES && d.speciality_id !== specialityId) return false;
    if (!n) return true;
    const spec = d.speciality_id ? specialityNames[d.speciality_id] ?? "" : "";
    return `${d.name} ${d.degrees ?? ""} ${d.department_name ?? ""} ${spec} ${d.room_number ?? ""}`.toLowerCase().includes(n);
  });
}

/** Case-insensitive match on title or included tests; digits match the price whether typed as 2500, 2,500 or ৳2500. */
export function filterAdminPackages<T extends PackageLike>(list: T[], search: string): T[] {
  const n = search.trim().toLowerCase();
  if (!n) return list;
  const digits = n.replace(/[৳,\s]/g, "");
  const priceQuery = /^\d+$/.test(digits) ? digits : null;
  return list.filter((p) => p.title.toLowerCase().includes(n) || p.included_tests.some((t) => t.toLowerCase().includes(n)) || (priceQuery !== null && p.price != null && String(p.price).includes(priceQuery)));
}
