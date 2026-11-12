export const PATIENT_SEARCH_PER_PAGE = 10;
export type SearchTab = "appointments" | "tests";

/** Strip characters that would break or widen the database filter (wildcards, quotes, backslashes). */
export function cleanSearchTerm(raw: string): string {
  return raw.replace(/[%*_"\\]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Filter matching patient name, phone or booking number (case-insensitive, anywhere in the text).
 * Values are quoted so commas, brackets and dots in the search never break it. Typing a phone in
 * +880 / 880 form also finds numbers saved in the local 0… form. Empty search → no filter.
 */
export function patientSearchFilter(raw: string, numberColumn: "appointment_number" | "booking_number"): string | null {
  const term = cleanSearchTerm(raw);
  if (!term) return null;
  const like = (col: string, v: string) => `${col}.ilike."%${v}%"`;
  const parts = [like("patient_name", term), like("patient_phone", term), like(numberColumn, term)];
  const intl = term.replace(/[\s-]/g, "").match(/^\+?880(\d{4,})$/);
  if (intl) parts.push(like("patient_phone", `0${intl[1]}`));
  return parts.join(",");
}

/** Row range (inclusive, zero-based) the database should return for a page. */
export function pageRange(page: number, perPage = PATIENT_SEARCH_PER_PAGE) {
  const p = Math.max(1, Math.floor(page));
  return { from: (p - 1) * perPage, to: p * perPage - 1 };
}

/** Summary for the pagination bar when only one page of rows has been loaded. */
export function serverPageView(page: number, total: number, perPage = PATIENT_SEARCH_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = total ? (current - 1) * perPage + 1 : 0;
  return { current, totalPages, from, to: Math.min(current * perPage, total), total };
}

export type StatusTone = "pending" | "confirmed" | "completed" | "cancelled";
export const statusTone = (status: string): StatusTone =>
  status === "confirmed" || status === "completed" || status === "cancelled" ? status : "pending";
