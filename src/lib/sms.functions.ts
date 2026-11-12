import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { appointmentSmsText, toBdMsisdn } from "./sms";
import { sendZendSms, type SmsResult } from "./sms.server";

/** Staff-only: texts the patient that their appointment is confirmed. Details are read from the database, not trusted from the browser. */
export const sendAppointmentSms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ appointmentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<SmsResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false, code: null, error: "Only staff can send SMS." };

    const { data: a, error } = await context.supabase
      .from("doctor_appointments")
      .select("appointment_number, appointment_date, patient_name, patient_phone, status, doctors(name, visiting_hours)")
      .eq("id", data.appointmentId)
      .maybeSingle();
    if (error || !a) return { ok: false, code: null, error: "Appointment not found." };
    if (a.status !== "confirmed") return { ok: false, code: null, error: "Only confirmed appointments get an SMS." };

    const recipient = toBdMsisdn(a.patient_phone);
    if (!recipient) return { ok: false, code: 2101, error: "The patient's phone number isn't a valid Bangladeshi mobile number." };

    const token = process.env["ZENDSMS_API_TOKEN"];
    if (!token) return { ok: false, code: 2001, error: "The SMS service key hasn't been added yet." };

    const message = appointmentSmsText({
      patientName: a.patient_name,
      doctorName: a.doctors?.name ?? "your doctor",
      appointmentDate: a.appointment_date,
      appointmentTime: a.doctors?.visiting_hours,
      appointmentNumber: a.appointment_number,
    });
    return sendZendSms(recipient, message, token);
  });
