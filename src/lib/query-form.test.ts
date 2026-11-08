import { describe, expect, it } from "vitest";
import { normalizeBdPhone, querySchema } from "./query-form";

describe("normalizeBdPhone", () => {
  it("formats a local 01 number as +880", () => {
    expect(normalizeBdPhone("01913240139")).toBe("+880 1913-240139");
  });
  it("accepts +880 with spaces and dashes", () => {
    expect(normalizeBdPhone("+880 1913-240139")).toBe("+880 1913-240139");
  });
  it("rejects a non-mobile or short number", () => {
    expect(normalizeBdPhone("0212345678")).toBeNull();
    expect(normalizeBdPhone("019132401")).toBeNull();
  });
});

describe("querySchema", () => {
  const ok = { name: "Rahim Uddin", phone: "01913240139", email: "", category: "Health Checkup", message: "What does the heart check include?" };
  it("accepts a complete query with optional email left blank", () => {
    expect(querySchema.parse(ok).phone).toBe("+880 1913-240139");
  });
  it("rejects a category outside the list", () => {
    expect(querySchema.safeParse({ ...ok, category: "Other" }).success).toBe(false);
  });
  it("rejects a message under 10 characters", () => {
    expect(querySchema.safeParse({ ...ok, message: "Hi there" }).success).toBe(false);
  });
});
