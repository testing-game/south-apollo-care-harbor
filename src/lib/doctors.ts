import { DAYS } from "@/lib/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Doctor profile URLs use the row id; anything else is treated as not found. */
export function isDoctorId(id: string): boolean {
  return UUID.test(id);
}

/** Visiting days in hospital week order (Saturday first), whatever order staff ticked them. */
export function orderedVisitingDays(days: readonly string[]): string[] {
  return DAYS.filter((d) => days.includes(d));
}

/** Biography split into paragraphs on blank lines; empty when staff left it blank. */
export function bioParagraphs(bio: string | null | undefined): string[] {
  return (bio ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
