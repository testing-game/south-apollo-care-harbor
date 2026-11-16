import { z } from "zod";

type PackageLike = { title: string; included_tests: string[]; is_featured: boolean };

/** Case-insensitive match on package title or any included test name. */
export function filterPackages<T extends PackageLike>(packages: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return packages;
  return packages.filter((p) => p.title.toLowerCase().includes(q) || p.included_tests.some((t) => t.toLowerCase().includes(q)));
}

/**
 * Banner shapes the package cards crop to. Sizes are 2x the widest the card is ever shown
 * (single-column phone layout) so images stay sharp on high-density screens.
 */
export const PACKAGE_IMAGE_SIZES = {
  home: { ratio: "29:32", width: 1160, height: 1280, label: "Card Banner (Homepage & All Packages)" },
  page: { ratio: "16:10", width: 1600, height: 1000, label: "Package Details Page Banner" },
} as const;

/** Package cards (homepage and All Packages) use the portrait card banner, falling back to the details banner. */
export function homeCardImage(pkg: { home_image_url?: string | null; image_url: string }): string {
  return pkg.home_image_url?.trim() ? pkg.home_image_url : pkg.image_url;
}

/** The details page shows the wide banner, falling back to the card banner. */
export function detailsBannerImage(pkg: { home_image_url?: string | null; image_url: string }): string {
  return pkg.image_url?.trim() ? pkg.image_url : (pkg.home_image_url ?? "");
}

/** Splits "Whole Body Check (For Men)" into the name and its bracketed target group. */
export function splitPackageTitle(title: string): { name: string; subtitle: string } {
  const m = title.trim().match(/^(.*?)\s*\(([^()]*)\)$/);
  return m?.[1] ? { name: m[1], subtitle: (m[2] ?? "").trim() } : { name: title.trim(), subtitle: "" };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isPackageId = (id: string) => UUID.test(id);

export const BOOKING_NOTES_MAX = 500;

export const GENDERS = ["Male", "Female", "Other"] as const;

export const testBookingSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  age: z.coerce.number({ message: "Enter the patient's age" }).int("Enter a whole number").min(0, "Enter a valid age").max(120, "Enter a valid age"),
  gender: z.enum(GENDERS, { message: "Choose a gender" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  notes: z.string().trim().max(BOOKING_NOTES_MAX, `Notes must be ${BOOKING_NOTES_MAX} characters or fewer`).optional().default(""),
});
