import { describe, expect, it } from "vitest";
import { countByTab, filterInbox, pageNumbers, paginate } from "./query-inbox";

const q = (name: string, status: string, extra: Partial<{ phone: string; email: string | null; subject: string }> = {}) => ({ name, status, phone: "01700000000", email: null, subject: "General", ...extra });

describe("query inbox", () => {
  it("puts unread queries in Unresponded and responded ones in Responded", () => {
    const list = [q("A", "unread"), q("B", "responded"), q("C", "unread")];
    expect(countByTab(list)).toEqual({ unresponded: 2, responded: 1 });
    expect(filterInbox(list, "responded", "").map((x) => x.name)).toEqual(["B"]);
  });
  it("searches name, phone, email and subject within the active tab only", () => {
    const list = [q("Rahim", "unread", { email: "rahim@mail.com" }), q("Karim", "responded", { subject: "Billing" }), q("Salma", "unread", { phone: "01913240139" })];
    expect(filterInbox(list, "unresponded", "RAHIM@").map((x) => x.name)).toEqual(["Rahim"]);
    expect(filterInbox(list, "unresponded", "240139").map((x) => x.name)).toEqual(["Salma"]);
    expect(filterInbox(list, "unresponded", "billing")).toEqual([]);
    expect(filterInbox(list, "responded", "billing").map((x) => x.name)).toEqual(["Karim"]);
  });
  it("shows 10 queries per page with a 'from–to of total' summary", () => {
    const list = Array.from({ length: 24 }, (_, i) => i);
    const p3 = paginate(list, 3);
    expect(p3.totalPages).toBe(3);
    expect([p3.from, p3.to, p3.total]).toEqual([21, 24, 24]);
    expect(paginate(list, 9).current).toBe(3);
    expect(paginate([], 1)).toMatchObject({ from: 0, to: 0, totalPages: 1 });
  });
  it("collapses long page lists around the current page", () => {
    expect(pageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(pageNumbers(5, 12)).toEqual([1, "gap", 4, 5, 6, "gap", 12]);
    expect(pageNumbers(1, 12)).toEqual([1, 2, "gap", 12]);
  });
});
