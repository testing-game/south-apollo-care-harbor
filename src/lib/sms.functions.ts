import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { appointmentSmsText, toBdMsisdn, type SmsResult } from "./sms";
import { sendOcsSms } from "./sms.server";

/** Staff-only: texts the patient that their appointment is confirmed. Details are read from the database, not trusted from the browser. */
export const sendAppointmentSms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ appointmentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<SmsResult> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { success: false, message: "Only staff can send SMS." };

    const { data: a, error } = await context.supabase
      .from("doctor_appointments")
      .select("appointment_number, appointment_date, appointment_time, patient_name, patient_phone, status, doctors(name, visiting_hours)")
      .eq("id", data.appointmentId)
      .maybeSingle();
    if (error || !a) return { success: false, message: "Appointment not found." };
    if (a.status !== "confirmed") return { success: false, message: "Only confirmed appointments get an SMS." };

    const number = toBdMsisdn(a.patient_phone);
    if (!number) return { success: false, message: "The patient's phone number isn't a valid Bangladeshi mobile number." };

    const apiKey = process.env["ONECODESOFT_API_KEY"];
    if (!apiKey) return { success: false, message: "The SMS service key hasn't been added yet." };

    const message = appointmentSmsText({
      patientName: a.patient_name,
      doctorName: a.doctors?.name ?? "your doctor",
      appointmentDate: a.appointment_date,
      appointmentTime: a.appointment_time || a.doctors?.visiting_hours,
      appointmentNumber: a.appointment_number,
    });
    return sendOcsSms(number, message, {
      apiKey,
      senderId: process.env["ONECODESOFT_SENDER_ID"],
      baseUrl: process.env["ONECODESOFT_BASE_URL"],
    });
  });
