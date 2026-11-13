import { describe, expect, it } from "vitest";
import { appointmentSmsText, interpretOcsResponse, toBdMsisdn } from "./sms";

describe("toBdMsisdn", () => {
  it("prepends 88 to numbers starting with 01", () => expect(toBdMsisdn("01913240139")).toBe("8801913240139"));
  it("strips +, spaces and dashes", () => expect(toBdMsisdn("+880 1913-240139")).toBe("8801913240139"));
  it("keeps numbers already in 8801 format", () => expect(toBdMsisdn("8801712345678")).toBe("8801712345678"));
  it("rejects numbers that are too short", () => expect(toBdMsisdn("0191324")).toBeNull());
  it("rejects landline-style numbers", () => expect(toBdMsisdn("0431-2173011")).toBeNull());
});

describe("appointmentSmsText", () => {
  it("uses the confirmed wording with date, time and helpline", () => {
    expect(
      appointmentSmsText({ patientName: "Rahim Uddin", doctorName: "Dr. Karim", appointmentDate: "2026-11-14", appointmentTime: "5:00 PM – 9:00 PM", appointmentNumber: "SA-A-000123" }),
    ).toBe("Dear Rahim Uddin, your appointment (SA-A-000123) with Dr. Karim at South Apollo Medical College Hospital is CONFIRMED for 14 Nov 2026 at 5:00 PM - 9:00 PM. Helpline: +8801885941937.");
  });
  it("leaves out the time when the doctor has no visiting hours", () => {
    expect(appointmentSmsText({ patientName: "A", doctorName: "Dr. B", appointmentDate: "2026-11-14", appointmentTime: "", appointmentNumber: "N1" })).toContain("CONFIRMED for 14 Nov 2026. Helpline");
  });
});

describe("interpretOcsResponse", () => {
  const ok = (status: string) => ({ status: "success", message: "SMS request processed.", data: { senderid: "S", results: [{ to: "8801712345678", status, code: null, message_id: "m1" }] } });
  it("counts a 'sent' recipient as success", () => {
    const r = interpretOcsResponse(200, ok("sent"));
    expect(r.success).toBe(true);
    expect(r.details?.messageId).toBe("m1");
  });
  it("treats a blocked recipient as a failure even when the request succeeded", () => expect(interpretOcsResponse(200, ok("blocked")).success).toBe(false));
  it("treats a spam-filtered recipient as a failure", () => expect(interpretOcsResponse(200, ok("spam")).success).toBe(false));
  it("passes OneCodeSoft's error message through", () => {
    expect(interpretOcsResponse(200, { status: "error", message: "Insufficient balance. Required 0.70, available 0.35." })).toEqual({ success: false, message: "Insufficient balance. Required 0.70, available 0.35." });
  });
  it("reports a rejected key on HTTP 401", () => expect(interpretOcsResponse(401, { status: "error", message: "Invalid or inactive token." }).message).toBe("The SMS service key is missing or not valid."));
});
