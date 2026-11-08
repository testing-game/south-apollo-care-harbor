import { z } from "zod";

export const QUERY_CATEGORIES = [
  "General Inquiry",
  "Doctor Appointment",
  "Health Checkup",
  "Diagnostic Reports",
  "Emergency Assistance",
  "Billing & Insurance",
] as const;

export const MESSAGE_MAX = 3000;
export const MESSAGE_MIN = 10;

/**
 * Accepts Bangladeshi mobile numbers written as 01XXXXXXXXX, 8801XXXXXXXXX or +8801XXXXXXXXX
 * (spaces/dashes allowed) and returns them as "+880 1XXX-XXXXXX"; null when not a valid BD mobile.
 */
export function normalizeBdPhone(input: string): string | null {
  const digits = input.replace(/[\s-]/g, "");
  const m = digits.match(/^(?:\+?880|0)(1[3-9]\d{8})$/);
  if (!m) return null;
  const local = m[1]!;
  return `+880 ${local.slice(0, 4)}-${local.slice(4)}`;
}

export const querySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120, "Name is too long"),
  phone: z
    .string()
    .trim()
    .transform((v, ctx) => {
      const n = normalizeBdPhone(v);
      if (!n) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid Bangladesh mobile number, e.g. 01913-240139" }); return z.NEVER; }
      return n;
    }),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address").max(255)]),
  category: z.enum(QUERY_CATEGORIES, { message: "Choose an inquiry category" }),
  message: z.string().trim().min(MESSAGE_MIN, `Please write at least ${MESSAGE_MIN} characters`).max(MESSAGE_MAX, "Message is too long"),
});

export type QueryForm = z.input<typeof querySchema>;
