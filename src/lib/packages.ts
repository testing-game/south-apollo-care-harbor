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
  home: { ratio: "29:32", width: 1160, height: 1280, label: "Homepage Card Banner" },
  page: { ratio: "16:10", width: 1600, height: 1000, label: "All Packages Page Banner" },
} as const;

/** Homepage cards use their own portrait banner, falling back to the page banner. */
export function homeCardImage(pkg: { home_image_url?: string | null; image_url: string }): string {
  return pkg.home_image_url?.trim() ? pkg.home_image_url : pkg.image_url;
}

export const GENDERS = ["Male", "Female", "Other"] as const;

export const testBookingSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  age: z.coerce.number({ message: "Enter the patient's age" }).int("Enter a whole number").min(0, "Enter a valid age").max(120, "Enter a valid age"),
  gender: z.enum(GENDERS, { message: "Choose a gender" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
});
