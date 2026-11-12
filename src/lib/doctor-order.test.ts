import { describe, expect, it } from "vitest";
import { moveDoctor, nextSerial, sortDoctors } from "./doctor-order";

const d = (id: string, display_order: number, created_at = "2026-01-01") => ({ id, display_order, created_at });

describe("doctor display order", () => {
  it("shows lower serials first, then earlier-added doctors on ties", () => {
    const rows = [d("c", 2), d("b", 1, "2026-03-01"), d("a", 1, "2026-02-01")];
    expect(sortDoctors(rows).map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("gives a new doctor the serial after the last one", () => {
    expect(nextSerial([d("a", 1), d("b", 7)])).toBe(8);
    expect(nextSerial([])).toBe(1);
  });

  it("moving up swaps with the doctor above", () => {
    const rows = [d("a", 1), d("b", 2), d("c", 3)];
    expect(moveDoctor(rows, rows, "c", "up")).toEqual([{ id: "c", display_order: 2 }, { id: "b", display_order: 3 }]);
  });

  it("moving down swaps with the doctor below", () => {
    const rows = [d("a", 1), d("b", 2), d("c", 3)];
    expect(moveDoctor(rows, rows, "a", "down")).toEqual([{ id: "b", display_order: 1 }, { id: "a", display_order: 2 }]);
  });

  it("does nothing at the top or bottom", () => {
    const rows = [d("a", 1), d("b", 2)];
    expect(moveDoctor(rows, rows, "a", "up")).toEqual([]);
    expect(moveDoctor(rows, rows, "b", "down")).toEqual([]);
  });

  it("with a filter, jumps past the next visible doctor", () => {
    const rows = [d("a", 1), d("b", 2), d("c", 3)];
    expect(moveDoctor(rows, [rows[0]!, rows[2]!], "c", "up")).toEqual([{ id: "c", display_order: 1 }, { id: "a", display_order: 2 }, { id: "b", display_order: 3 }]);
  });

  it("untangles equal serials into 1..n", () => {
    const rows = [d("a", 999, "2026-01-01"), d("b", 999, "2026-01-02")];
    expect(moveDoctor(rows, rows, "b", "up")).toEqual([{ id: "b", display_order: 1 }, { id: "a", display_order: 2 }]);
  });
});
