/** Shared, browser-safe rules for appointment SMS (ZendSMS). */

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

/** Plain-language explanation of a ZendSMS error code for reception staff. */
export function smsErrorText(code: number | null | undefined, fallback?: string): string {
  switch (code) {
    case 2001: case 2002: return "The SMS service key is missing or not valid.";
    case 2003: return "The SMS service blocked this server's address.";
    case 2004: return "The SMS account is suspended.";
    case 2101: return "The patient's phone number isn't a valid mobile number.";
    case 2102: case 2103: return "The SMS account has no approved sending number.";
    case 2106: return "The message is too long.";
    case 2201: return "The SMS account balance is too low.";
    case 2202: case 2203: case 2204: return "The SMS sending limit was reached. Try again later.";
    case 2302: return "The mobile operator rejected the message.";
    case 2303: case 2304: case 5000: case 5001: case 5002: return "The SMS service is temporarily unavailable. Try again shortly.";
    default: return fallback || "The SMS could not be sent.";
  }
}
