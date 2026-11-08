import { z } from "zod";

type PackageLike = { title: string; included_tests: string[]; is_featured: boolean };

/** Case-insensitive match on package title or any included test name. */
export function filterPackages<T extends PackageLike>(packages: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return packages;
  return packages.filter((p) => p.title.toLowerCase().includes(q) || p.included_tests.some((t) => t.toLowerCase().includes(q)));
}

/** "Comprehensive" for whole-body/executive or 10+ test packages; "Recommended" for featured ones when featuring actually singles them out. */
export function packageBadge(pkg: PackageLike, all: PackageLike[]): "Comprehensive" | "Recommended" | null {
  if (/whole body|executive/i.test(pkg.title) || pkg.included_tests.length >= 10) return "Comprehensive";
  if (pkg.is_featured && !all.every((p) => p.is_featured)) return "Recommended";
  return null;
}

export const GENDERS = ["Male", "Female", "Other"] as const;

export const testBookingSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's name").max(120),
  phone: z.string().trim().regex(/^[0-9+ -]{7,20}$/, "Enter a valid phone number"),
  age: z.coerce.number({ message: "Enter the patient's age" }).int("Enter a whole number").min(0, "Enter a valid age").max(120, "Enter a valid age"),
  gender: z.enum(GENDERS, { message: "Choose a gender" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
});
