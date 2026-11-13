/** Pure helpers shared by the PDF slips and staff manifests (no browser APIs, so they can be tested). */

export const PDF_BRAND = {
  hospital: "South Apollo Medical College Hospital",
  address: "Jagua, Kalijira, Barishal Sadar, Barishal",
  helpline: "+880 1885-941937",
  navy: [11, 37, 69] as const, // #0b2545
  teal: [14, 165, 233] as const, // #0ea5e9
  tealSoft: [56, 189, 248] as const, // #38bdf8
  slateFill: [248, 250, 252] as const, // #f8fafc
  border: [226, 232, 240] as const, // #e2e8f0
  muted: [100, 116, 139] as const, // slate-500
  ink: [15, 23, 42] as const, // slate-900
};

export type ManifestKind = "appointments" | "tests";

/** True when a string contains characters outside Latin script (e.g. Bengali or ৳) that the embedded Latin font can't draw. */
export function needsShaping(text: string): boolean {
  return /[^\u0000-\u024F\u2000-\u206F\u20AC\u2122]/.test(text);
}

export function manifestTitle(kind: ManifestKind): string {
  return kind === "appointments" ? "Daily Doctor Appointment Manifest" : "Daily Diagnostic Test Booking Manifest";
}

export function manifestFilterLabel(kind: ManifestKind, selected?: string | null): string {
  return selected?.trim() || (kind === "appointments" ? "All Doctors" : "All Packages");
}

export function manifestColumns(kind: ManifestKind): string[] {
  return ["SL", "Booking No.", "Patient Name", "Phone", "Age/Gender", kind === "appointments" ? "Doctor" : "Package", "Status", "Remarks / Signature"];
}

export function ageGenderLabel(age: number | string | null | undefined, gender: string | null | undefined): string {
  const g = gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : "";
  const parts = [age === null || age === undefined || age === "" ? "" : String(age), g].filter(Boolean);
  return parts.join(" / ") || "—";
}

export function statusLabel(status: string): string {
  const s = status.toLowerCase();
  return s === "confirmed" || s === "completed" || s === "cancelled" ? s.toUpperCase() : "PENDING";
}

/** e.g. "12 Nov 2026, 1:59 PM" in Bangladesh time. */
export function dhakaTimestamp(at: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
    .format(at)
    .replace(/\b(am|pm)\b/, (m) => m.toUpperCase());
}

export function weekdayName(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
}

export function pageLabel(page: number, total: number): string {
  return `Page ${page} of ${total}`;
}
