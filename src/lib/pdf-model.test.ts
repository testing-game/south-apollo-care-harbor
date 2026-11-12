import { describe, expect, it } from "vitest";
import { ageGenderLabel, dhakaTimestamp, manifestColumns, manifestFilterLabel, manifestTitle, needsShaping, pageLabel, statusLabel, weekdayName } from "./pdf-model";

describe("pdf model", () => {
  it("sends Bengali names and the Taka sign through the Bengali renderer", () => {
    expect(needsShaping("রহিম উদ্দিন")).toBe(true);
    expect(needsShaping("৳2,500")).toBe(true);
    expect(needsShaping("Dr. Karim — Room 204")).toBe(false);
  });

  it("titles each staff manifest as requested", () => {
    expect(manifestTitle("appointments")).toBe("Daily Doctor Appointment Manifest");
    expect(manifestTitle("tests")).toBe("Daily Diagnostic Test Booking Manifest");
  });

  it("falls back to All Doctors / All Packages when nothing is filtered", () => {
    expect(manifestFilterLabel("appointments")).toBe("All Doctors");
    expect(manifestFilterLabel("tests", "")).toBe("All Packages");
    expect(manifestFilterLabel("appointments", "Dr. Rahman")).toBe("Dr. Rahman");
  });

  it("uses the eight manifest columns ending with a signature column", () => {
    expect(manifestColumns("appointments")).toEqual(["SL", "Booking No.", "Patient Name", "Phone", "Age/Gender", "Doctor", "Status", "Remarks / Signature"]);
    expect(manifestColumns("tests")[5]).toBe("Package");
  });

  it("formats age, gender, status and pages", () => {
    expect(ageGenderLabel(34, "male")).toBe("34 / Male");
    expect(ageGenderLabel(null, null)).toBe("—");
    expect(statusLabel("pending")).toBe("PENDING");
    expect(statusLabel("confirmed")).toBe("CONFIRMED");
    expect(pageLabel(2, 5)).toBe("Page 2 of 5");
  });

  it("stamps times in Bangladesh time", () => {
    expect(dhakaTimestamp(new Date("2026-11-12T07:59:00Z"))).toBe("12 Nov 2026, 1:59 PM");
    expect(weekdayName("2026-11-12")).toBe("Thursday");
  });
});
