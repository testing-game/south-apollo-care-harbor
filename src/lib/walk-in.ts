import { z } from "zod";
import { toBdMsisdn } from "./sms";

/** Bangladeshi mobile number -> local 01XXXXXXXXX form, or null when it isn't one. */
export function toLocalBdMobile(phone: string): string | null {
  const intl = toBdMsisdn(phone);
  return intl ? intl.slice(2) : null;
}

/** Staff walk-in / phone booking form. Every booking made here is saved as Confirmed. */
export const walkInSchema = (todayIso: string) =>
  z.object({
    name: z.string().trim().min(2, "Enter the patient's full name").max(120, "Name is too long"),
    phone: z.string().transform((v, ctx) => {
      const local = toLocalBdMobile(v);
      if (!local) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid Bangladeshi mobile number (01XXXXXXXXX)" }); return z.NEVER; }
      return local;
    }),
    age: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : Number(v)),
      z.number({ required_error: "Enter the patient's age", invalid_type_error: "Enter a valid age" }).int("Enter a valid age").min(0, "Enter a valid age").max(130, "Enter a valid age"),
    ),
    gender: z.enum(["male", "female", "other"], { errorMap: () => ({ message: "Choose a gender" }) }),
    doctorId: z.string().uuid("Choose a doctor"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date").refine((d) => d >= todayIso, "The appointment date cannot be in the past"),
    time: z.string().trim().max(80, "Time is too long"),
    notes: z.string().trim().max(500, "Notes are too long"),
  });

export type WalkInForm = { name: string; phone: string; age: string; gender: string; doctorId: string; date: string; time: string; notes: string };

/** The toast staff see after booking, depending on whether the SMS went out. */
export function walkInResultMessage(phone: string, sms: { success: boolean; message: string }) {
  return sms.success
    ? { ok: true, title: `Appointment booked & confirmed! Confirmation SMS sent to ${phone}.` }
    : { ok: false, title: "Appointment booked & confirmed, but the SMS was not sent.", description: `${sms.message} You can use Resend SMS.` };
}
