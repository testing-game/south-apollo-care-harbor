import { describe, expect, it } from "vitest";
import { adminStatus, applyMailto, deadlineBadge, filterCirculars, isOpen, jobCircularSchema, publicCirculars, toBlocks } from "./careers";

const base = { employment_type: "full_time", qualifications: "", description: "", deadline: null as string | null, is_active: true };
const jobs = [
  { ...base, title: "Medical Officer", department: "medical", qualifications: "MBBS with BMDC registration" },
  { ...base, title: "Staff Nurse", department: "nursing", employment_type: "contractual" },
  { ...base, title: "Lab Technologist", department: "diagnostics", deadline: "2026-11-01" },
  { ...base, title: "Front Desk Officer", department: "administration", is_active: false },
];
const today = "2026-11-12";

describe("public job circulars", () => {
  it("shows only active circulars whose deadline is today or later", () => {
    expect(publicCirculars(jobs, today).map((j) => j.title)).toEqual(["Medical Officer", "Staff Nurse"]);
    expect(isOpen({ is_active: true, deadline: today }, today)).toBe(true);
  });
  it("filters by department tab and search text together", () => {
    expect(filterCirculars(jobs, "", "nursing").map((j) => j.title)).toEqual(["Staff Nurse"]);
    expect(filterCirculars(jobs, "bmdc").map((j) => j.title)).toEqual(["Medical Officer"]);
    expect(filterCirculars(jobs, "contractual", "medical")).toEqual([]);
  });
});

describe("staff status", () => {
  it("labels switched-off circulars Closed and past-deadline ones Expired", () => {
    expect(jobs.map((j) => adminStatus(j, today))).toEqual(["active", "active", "expired", "closed"]);
  });
});

describe("deadlineBadge", () => {
  it("flags the last 7 days as urgent", () => {
    expect(deadlineBadge(today, today)).toEqual({ label: "Closes today", urgent: true });
    expect(deadlineBadge("2026-11-19", today)).toEqual({ label: "Closes in 7 days", urgent: true });
    expect(deadlineBadge("2026-11-30", today)).toEqual({ label: "Apply by 30 Nov 2026", urgent: false });
    expect(deadlineBadge(null, today).label).toBe("Open until filled");
  });
});

describe("toBlocks", () => {
  it("turns dash lines into bullet lists and joins wrapped paragraph lines", () => {
    expect(toBlocks("Join our ward team\nin Barishal.\n\n- Patient care\n- Night shifts")).toEqual([
      { kind: "p", text: "Join our ward team in Barishal." },
      { kind: "ul", items: ["Patient care", "Night shifts"] },
    ]);
  });
});

describe("applyMailto", () => {
  it("falls back to the HR desk when a circular has no email", () => {
    expect(applyMailto({ title: "Staff Nurse", apply_email: "" })).toBe("mailto:info@southapollomedicalcollegehospital.com?subject=Application%20for%20Staff%20Nurse");
  });
});

describe("jobCircularSchema", () => {
  const ok = { title: "Staff Nurse", department: "nursing", employment_type: "full_time", vacancies: "3", qualifications: "", description: "Provide ward nursing care.", salary: "", deadline: "", apply_email: "", apply_instructions: "", is_active: true };
  it("defaults salary to Negotiable and an empty deadline to none", () => {
    const r = jobCircularSchema.parse(ok);
    expect(r).toMatchObject({ vacancies: 3, salary: "Negotiable", deadline: null });
  });
  it("rejects zero vacancies and a bad email", () => {
    expect(jobCircularSchema.safeParse({ ...ok, vacancies: "0" }).success).toBe(false);
    expect(jobCircularSchema.safeParse({ ...ok, apply_email: "hr@" }).success).toBe(false);
  });
});
