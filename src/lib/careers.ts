import { z } from "zod";

export const DEPARTMENTS = [
  { id: "medical", label: "Medical / Doctors" },
  { id: "nursing", label: "Nursing" },
  { id: "diagnostics", label: "Diagnostics & Lab" },
  { id: "administration", label: "Administration & Support" },
] as const;
export type Department = (typeof DEPARTMENTS)[number]["id"];
export const ALL_DEPARTMENTS = "all";

export const EMPLOYMENT_TYPES = [
  { id: "full_time", label: "Full-Time" },
  { id: "part_time", label: "Part-Time" },
  { id: "contractual", label: "Contractual" },
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]["id"];

/** Where CVs go when a circular has no email of its own. */
export const HR_EMAIL = "info@southapollomedicalcollegehospital.com";
export const CIRCULARS_PER_PAGE = 10;

type CircularLike = { title: string; department: string; employment_type: string; qualifications: string; description: string; deadline: string | null; is_active: boolean };

export const departmentLabel = (id: string) => DEPARTMENTS.find((d) => d.id === id)?.label ?? id;
export const employmentLabel = (id: string) => EMPLOYMENT_TYPES.find((t) => t.id === id)?.label ?? id;
export const isDepartment = (v: unknown): v is Department => DEPARTMENTS.some((d) => d.id === v);

const daysBetween = (fromIso: string, toIso: string) => Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000);

/** A circular is open while it is switched on and its deadline (if any) is today or later. */
export function isOpen(c: Pick<CircularLike, "is_active" | "deadline">, today: string) {
  return c.is_active && (!c.deadline || c.deadline >= today);
}

/** What visitors see: only open circulars, in their original order. */
export function publicCirculars<T extends CircularLike>(list: T[], today: string): T[] {
  return list.filter((c) => isOpen(c, today));
}

/** Staff list status: Active, Closed (switched off) or Expired (deadline passed). */
export function adminStatus(c: Pick<CircularLike, "is_active" | "deadline">, today: string): "active" | "closed" | "expired" {
  if (!c.is_active) return "closed";
  return c.deadline && c.deadline < today ? "expired" : "active";
}

/** Case-insensitive search over title, department, type, qualifications and description, plus optional department. */
export function filterCirculars<T extends CircularLike>(list: T[], search: string, department: string = ALL_DEPARTMENTS): T[] {
  const n = search.trim().toLowerCase();
  return list.filter((c) => {
    if (department !== ALL_DEPARTMENTS && c.department !== department) return false;
    if (!n) return true;
    return `${c.title} ${departmentLabel(c.department)} ${employmentLabel(c.employment_type)} ${c.qualifications} ${c.description}`.toLowerCase().includes(n);
  });
}

/** Deadline badge text; "urgent" when 7 days or fewer remain. */
export function deadlineBadge(deadline: string | null, today: string): { label: string; urgent: boolean } {
  if (!deadline) return { label: "Open until filled", urgent: false };
  const days = daysBetween(today, deadline);
  if (days < 0) return { label: "Closed", urgent: false };
  if (days === 0) return { label: "Closes today", urgent: true };
  if (days <= 7) return { label: `Closes in ${days} day${days === 1 ? "" : "s"}`, urgent: true };
  const [y, m, d] = deadline.split("-").map(Number);
  return { label: `Apply by ${new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`, urgent: false };
}

export type TextBlock = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

/** Splits staff-typed text into paragraphs and bullet lists (lines starting with -, *, • or "1."). */
export function toBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) { blocks.push({ kind: "p", text: "" }); continue; }
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (bullet) {
      if (last?.kind === "ul") last.items.push(bullet[1]!);
      else blocks.push({ kind: "ul", items: [bullet[1]!] });
    } else if (last?.kind === "p" && last.text) last.text += ` ${line}`;
    else blocks.push({ kind: "p", text: line });
  }
  return blocks.filter((b) => b.kind === "ul" || b.text);
}

export function applyMailto(c: { title: string; apply_email: string }) {
  return `mailto:${c.apply_email.trim() || HR_EMAIL}?subject=${encodeURIComponent(`Application for ${c.title}`)}`;
}

export const jobCircularSchema = z.object({
  title: z.string().trim().min(2, "Enter a job title").max(160, "Keep the title under 160 characters"),
  department: z.enum(["medical", "nursing", "diagnostics", "administration"]),
  employment_type: z.enum(["full_time", "part_time", "contractual"]),
  vacancies: z.coerce.number({ message: "Enter the number of vacancies" }).int("Vacancies must be a whole number").min(1, "At least 1 vacancy").max(999, "Too many vacancies"),
  qualifications: z.string().trim().max(3000, "Qualifications are too long"),
  description: z.string().trim().min(10, "Add a job description").max(10000, "Description is too long"),
  salary: z.string().trim().max(120, "Salary text is too long").transform((s) => s || "Negotiable"),
  deadline: z.string().trim().refine((s) => !s || /^\d{4}-\d{2}-\d{2}$/.test(s), "Pick a valid date").transform((s) => s || null),
  apply_email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address")]),
  apply_instructions: z.string().trim().max(2000, "Instructions are too long"),
  is_active: z.boolean(),
});
export type JobCircularInput = z.input<typeof jobCircularSchema>;
