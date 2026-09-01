import { describe, it, expect } from "vitest";
import { MAX_COMPARE, toggleCompare, buildComparisonRows } from "../tutorCompare";

describe("toggleCompare", () => {
  it("adds a tutor to an empty selection", () => {
    expect(toggleCompare([], "abc")).toEqual({ ids: ["abc"], rejected: false });
  });

  it("removes a tutor that is already selected", () => {
    expect(toggleCompare(["a", "b"], "a")).toEqual({ ids: ["b"], rejected: false });
  });

  it("rejects adding a 4th tutor when the cap is 3", () => {
    const result = toggleCompare(["a", "b", "c"], "d");
    expect(result.ids).toEqual(["a", "b", "c"]);
    expect(result.rejected).toBe(true);
  });

  it("allows toggling the cap", () => {
    expect(toggleCompare(["a"], "b", 2)).toEqual({ ids: ["a", "b"], rejected: false });
    expect(toggleCompare(["a", "b"], "c", 2).rejected).toBe(true);
  });

  it("tolerates non-array input", () => {
    expect(toggleCompare(null, "a")).toEqual({ ids: ["a"], rejected: false });
  });
});

describe("buildComparisonRows", () => {
  const tutors = [
    { displayName: "A", expectedSalary: 5000, subjects: ["Math"], location: "Dhanmondi", experience: "3y", qualification: "BSc", verificationStatus: "verified_premium", ratings: 4.5 },
    { displayName: "B", expectedSalary: 8000, subjects: ["English", "Bangla"], location: "Gulshan", experience: "5y", qualification: "MSc", isVerified: true },
  ];

  it("produces a row per attribute with one value per tutor", () => {
    const rows = buildComparisonRows(tutors);
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      expect(row.values).toHaveLength(2);
    }
  });

  it("formats the monthly fee with currency", () => {
    const feeRow = buildComparisonRows(tutors).find((r) => r.label === "Monthly fee");
    expect(feeRow.values).toEqual(["৳5,000", "৳8,000"]);
  });

  it("derives verification from verificationStatus or legacy isVerified", () => {
    const verRow = buildComparisonRows(tutors).find((r) => r.label === "Verification");
    expect(verRow.values).toEqual(["verified_premium", "verified"]);
  });

  it("falls back to null rating when absent", () => {
    const row = buildComparisonRows([{ displayName: "C", expectedSalary: 1000 }]).find((r) => r.label === "Rating");
    expect(row.values).toEqual([null]);
  });

  it("handles empty input", () => {
    expect(buildComparisonRows([])).toEqual([]);
  });
});
