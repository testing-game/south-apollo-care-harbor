import { describe, expect, it } from "vitest";
import { cleanSearchTerm, pageRange, patientSearchFilter, serverPageView, statusTone } from "./patient-search";

describe("patient search", () => {
  it("shows every record (no filter) when the search box is empty", () => {
    expect(patientSearchFilter("   ", "appointment_number")).toBeNull();
  });
  it("searches name, phone and the appointment or booking number", () => {
    expect(patientSearchFilter("SA-A-000012", "appointment_number")).toBe('patient_name.ilike."%SA-A-000012%",patient_phone.ilike."%SA-A-000012%",appointment_number.ilike."%SA-A-000012%"');
    expect(patientSearchFilter("SA-T", "booking_number")).toContain('booking_number.ilike."%SA-T%"');
  });
  it("finds local 0… phone numbers when typed with +880", () => {
    expect(patientSearchFilter("+880 1913-240139", "appointment_number")).toContain('patient_phone.ilike."%01913240139%"');
  });
  it("removes wildcard and quote characters from the search", () => {
    expect(cleanSearchTerm('Ra%h"im*')).toBe("Ra h im");
  });
  it("loads 10 records per page", () => {
    expect(pageRange(1)).toEqual({ from: 0, to: 9 });
    expect(pageRange(3)).toEqual({ from: 20, to: 29 });
  });
  it("summarises 'Showing 21–24 of 24' on the last page", () => {
    expect(serverPageView(3, 24)).toEqual({ current: 3, totalPages: 3, from: 21, to: 24, total: 24 });
    expect(serverPageView(9, 24).current).toBe(3);
    expect(serverPageView(1, 0)).toMatchObject({ from: 0, to: 0, total: 0 });
  });
  it("treats unknown statuses as pending", () => {
    expect(statusTone("confirmed")).toBe("confirmed");
    expect(statusTone("unread")).toBe("pending");
  });
});
