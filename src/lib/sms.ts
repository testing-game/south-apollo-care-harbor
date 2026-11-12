/** Shared, browser-safe rules for appointment SMS (OneCodeSoft Bulk SMS v3). */

export const HOSPITAL_SMS_NAME = "South Apollo Medical College Hospital";
export const SMS_HELPLINE = "+8801913240139";

/**
 * Bangladeshi mobile number -> international format 8801XXXXXXXXX.
 * Strips +, spaces, dashes and brackets; numbers starting with 01 get 88 in front.
 * Returns null when the result is not a valid Bangladeshi mobile number.
 */
export function toBdMsisdn(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("01")) digits = `88${digits}`;
  return /^8801[3-9]\d{8}$/.test(digits) ? digits : null;
}

function smsDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export type AppointmentSmsInput = {
  patientName: string;
  doctorName: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime?: string | null;
  appointmentNumber: string;
};

/** The confirmation text sent to the patient. Fancy dashes become "-" so the SMS stays in the cheaper plain-text encoding. */
export function appointmentSmsText(a: AppointmentSmsInput): string {
  const time = (a.appointmentTime ?? "").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const when = time ? `${smsDate(a.appointmentDate)} at ${time}` : smsDate(a.appointmentDate);
  return `Dear ${a.patientName.trim()}, your appointment (${a.appointmentNumber}) with ${a.doctorName.trim()} at ${HOSPITAL_SMS_NAME} is CONFIRMED for ${when}. Helpline: ${SMS_HELPLINE}.`;
}

export type SmsResult = { success: boolean; message: string; details?: { to: string | null; status: string | null; messageId: string | null; senderId: string | null } };

type OcsBody = {
  status?: string;
  message?: string;
  data?: { senderid?: string; results?: { to?: string; status?: string; code?: string | number | null; message_id?: string | null }[] };
};

/**
 * Reads a OneCodeSoft Bulk SMS v3 reply. The API answers HTTP 200 with status "success"/"error";
 * 401 means a bad key. Even on success, each recipient can be sent / failed / blocked / spam.
 */
export function interpretOcsResponse(httpStatus: number, body: OcsBody | null): SmsResult {
  if (httpStatus === 401) return { success: false, message: "The SMS service key is missing or not valid." };
  if (!body || body.status !== "success") {
    return { success: false, message: body?.message?.trim() || `The SMS service returned an unexpected reply (HTTP ${httpStatus}).` };
  }
  const r = body.data?.results?.[0];
  const details = { to: r?.to ?? null, status: r?.status ?? null, messageId: r?.message_id ?? null, senderId: body.data?.senderid ?? null };
  switch (r?.status) {
    case "sent": return { success: true, message: "SMS sent", details };
    case "blocked": return { success: false, message: "This number is on the SMS service's block list.", details };
    case "spam": return { success: false, message: "The SMS service's spam filter stopped the message.", details };
    case "failed": return { success: false, message: `The mobile operator rejected the message${r.code ? ` (code ${r.code})` : ""}.`, details };
    default: return { success: false, message: "The SMS service didn't confirm the message was sent.", details };
  }
}
