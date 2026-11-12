import { describe, expect, it } from "vitest";
import { filterAdminDoctors, filterAdminPackages } from "./admin-filters";
import { paginate } from "./query-inbox";

const doc = (name: string, extra: Partial<{ degrees: string; department_name: string; room_number: string; speciality_id: string }> = {}) => ({ name, degrees: "MBBS", department_name: "Medicine", room_number: "101", speciality_id: "med", ...extra });
const pkg = (title: string, price: number | null, included_tests: string[] = []) => ({ title, price, included_tests });

describe("admin doctor search", () => {
  const list = [doc("Dr. Rahim", { degrees: "MBBS, FCPS" }), doc("Dr. Salma", { speciality_id: "card", department_name: "", room_number: "305" }), doc("Dr. Karim")];
  it("matches name, degree, speciality name and room, ignoring case", () => {
    expect(filterAdminDoctors(list, "fcps").map((d) => d.name)).toEqual(["Dr. Rahim"]);
    expect(filterAdminDoctors(list, "CARDIO", "all", { card: "Cardiology" }).map((d) => d.name)).toEqual(["Dr. Salma"]);
    expect(filterAdminDoctors(list, "305").map((d) => d.name)).toEqual(["Dr. Salma"]);
  });
  it("narrows to the chosen speciality and combines with search", () => {
    expect(filterAdminDoctors(list, "", "med").map((d) => d.name)).toEqual(["Dr. Rahim", "Dr. Karim"]);
    expect(filterAdminDoctors(list, "karim", "card")).toEqual([]);
  });
  it("shows 10 doctors per page", () => {
    const many = Array.from({ length: 35 }, (_, i) => doc(`Dr. ${i}`));
    const p1 = paginate(filterAdminDoctors(many, ""), 1);
    expect([p1.from, p1.to, p1.total, p1.totalPages]).toEqual([1, 10, 35, 4]);
  });
});

describe("admin package search", () => {
  const list = [pkg("Basic Checkup", 2500, ["CBC", "Lipid Profile"]), pkg("Diabetes Package", 12000, ["HbA1c"]), pkg("Whole Body", null)];
  it("matches title and included tests", () => {
    expect(filterAdminPackages(list, "lipid").map((p) => p.title)).toEqual(["Basic Checkup"]);
    expect(filterAdminPackages(list, "WHOLE").map((p) => p.title)).toEqual(["Whole Body"]);
  });
  it("matches price typed with or without commas or ৳", () => {
    expect(filterAdminPackages(list, "2500").map((p) => p.title)).toEqual(["Basic Checkup"]);
    expect(filterAdminPackages(list, "12,000").map((p) => p.title)).toEqual(["Diabetes Package"]);
    expect(filterAdminPackages(list, "৳ 2,500").map((p) => p.title)).toEqual(["Basic Checkup"]);
  });
});
