import { describe, expect, it } from "vitest";
import { enterTarget, flatHits, searchSite, validateListingSearch } from "./site-search";

const price = (p: number | null) => (p ? `৳ ${p}` : "Price on request");
const data = {
  doctors: [
    { id: "d1", name: "Dr. Jahid Rayhan", degrees: "MBBS, FCPS", designation: "Professor", department_name: "Cardiology Care Centre", image_url: "" },
    { id: "d2", name: "Dr. Nasrin Akter", degrees: "MBBS, MD", designation: "Consultant", department_name: "Neurology", image_url: "x.jpg" },
    { id: "d3", name: "Dr. Karim Uddin", degrees: "MBBS, MS", designation: "Associate Professor", department_name: "Cardiology Care Centre", image_url: "" },
  ],
  specialities: [
    { id: "s1", name: "Cardiology Care Centre", description: "Heart care" },
    { id: "s2", name: "Neurology", description: null },
  ],
  packages: [
    { id: "p1", title: "Executive Health Check", included_tests: ["ECG", "Lipid Profile"], price: 5000 },
    { id: "p2", title: "Diabetes Package", included_tests: ["HbA1c"], price: null },
  ],
};

describe("Global site search", () => {
  it("needs at least 2 characters", () => {
    expect(searchSite(data, "n", price)).toEqual([]);
    expect(searchSite(data, "ne", price).length).toBeGreaterThan(0);
  });
  it("finds doctors by name, degree, designation or department", () => {
    const ids = (q: string) => searchSite(data, q, price).find((g) => g.key === "doctors")?.hits.map((h) => h.target);
    expect(ids("jahid")).toEqual([{ kind: "doctor", id: "d1" }]);
    expect(ids("FCPS")).toEqual([{ kind: "doctor", id: "d1" }]);
    expect(ids("consultant")).toEqual([{ kind: "doctor", id: "d2" }]);
    expect(ids("cardiology")?.length).toBe(2);
  });
  it("finds specialities by description and packages by included test, with price", () => {
    const groups = searchSite(data, "heart", price);
    expect(groups.find((g) => g.key === "specialities")?.hits[0]?.title).toBe("Cardiology Care Centre");
    const pkg = searchSite(data, "lipid", price).find((g) => g.key === "packages")?.hits[0];
    expect(pkg).toMatchObject({ title: "Executive Health Check", subtitle: "৳ 5000", meta: "Includes Lipid Profile" });
    expect(pkg?.target).toEqual({ kind: "package", id: "p1", title: "Executive Health Check" });
  });
  it("finds key pages such as Career and Contact Us", () => {
    expect(searchSite(data, "jobs", price).find((g) => g.key === "pages")?.hits[0]?.title).toBe("Career");
    expect(searchSite(data, "contact", price).find((g) => g.key === "pages")?.hits[0]?.target).toEqual({ kind: "page", to: "/send-query" });
  });
  it("returns nothing for an unknown word", () => {
    expect(searchSite(data, "zzqx", price)).toEqual([]);
  });
  it("Enter opens a single match directly", () => {
    expect(enterTarget(searchSite(data, "nasrin", price), "nasrin")).toEqual({ kind: "doctor", id: "d2" });
  });
  it("Enter opens the filtered doctor list when several doctors match", () => {
    expect(enterTarget(searchSite(data, "mbbs", price), "mbbs")).toEqual({ kind: "doctor-list", search: "mbbs" });
  });
  it("Enter prefers an exactly named result", () => {
    expect(enterTarget(searchSite(data, "Neurology", price), "Neurology")).toEqual({ kind: "speciality", name: "Neurology" });
  });
  it("Enter does nothing without results", () => {
    expect(enterTarget([], "zzqx")).toBeNull();
  });
  it("keeps arrow-key order the same as the shown groups", () => {
    expect(flatHits(searchSite(data, "cardiology", price)).map((h) => h.group)).toEqual(["doctors", "doctors", "specialities"]);
  });
  it("reads ?search= safely", () => {
    expect(validateListingSearch({ search: "heart" })).toEqual({ search: "heart" });
    expect(validateListingSearch({ search: 4 })).toEqual({});
  });
});
