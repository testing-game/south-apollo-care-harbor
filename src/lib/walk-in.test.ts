import { describe, expect, it } from "vitest";
import { toLocalBdMobile, walkInResultMessage, walkInSchema } from "./walk-in";

const valid = { name: "Rahima Begum", phone: "01712345678", age: "42", gender: "female", doctorId: "8b1d6f0e-2f3a-4c1b-9d7e-1a2b3c4d5e6f", date: "2026-11-12", time: "5:00 PM - 9:00 PM", notes: "" };
const schema = walkInSchema("2026-11-12");

describe("walk-in booking form", () => {
  it("accepts a complete booking for today", () => expect(schema.safeParse(valid).success).toBe(true));
  it("stores the phone as 01XXXXXXXXX even when typed with +880 and spaces", () => {
    const r = schema.parse({ ...valid, phone: "+880 1712-345678" });
    expect(r.phone).toBe("01712345678");
  });
  it("rejects a phone number that isn't a Bangladeshi mobile", () => expect(schema.safeParse({ ...valid, phone: "0431-2173011" }).success).toBe(false));
  it("requires a patient name", () => expect(schema.safeParse({ ...valid, name: " " }).success).toBe(false));
  it("requires age", () => expect(schema.safeParse({ ...valid, age: "" }).success).toBe(false));
  it("only allows Male, Female or Other", () => expect(schema.safeParse({ ...valid, gender: "" }).success).toBe(false));
  it("requires a doctor", () => expect(schema.safeParse({ ...valid, doctorId: "" }).success).toBe(false));
  it("rejects dates before today", () => expect(schema.safeParse({ ...valid, date: "2026-11-11" }).success).toBe(false));
});

describe("toLocalBdMobile", () => {
  it("turns 8801 numbers into 01 numbers", () => expect(toLocalBdMobile("8801913240139")).toBe("01913240139"));
  it("returns null for short numbers", () => expect(toLocalBdMobile("01913")).toBeNull());
});

describe("walkInResultMessage", () => {
  it("names the phone number when the SMS was sent", () =>
    expect(walkInResultMessage("01712345678", { success: true, message: "SMS sent" }).title).toBe("Appointment booked & confirmed! Confirmation SMS sent to 01712345678."));
  it("keeps the booking confirmed and explains when the SMS failed", () => {
    const m = walkInResultMessage("01712345678", { success: false, message: "The SMS service key is missing or not valid." });
    expect(m.ok).toBe(false);
    expect(m.title).toBe("Appointment booked & confirmed, but the SMS was not sent.");
  });
});
