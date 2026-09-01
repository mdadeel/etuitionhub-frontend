import { describe, it, expect } from "vitest";
import {
  DAY_NAMES,
  DAY_NAMES_FULL,
  generateBookingLink,
  formatSlotLabel,
  buildSlotKey,
  groupAvailability,
  sortByDayOfWeek,
} from "../slotBooking";

describe("generateBookingLink", () => {
  it("builds a /book/:id URL", () => {
    expect(generateBookingLink("abc123")).toBe("/book/abc123");
  });
});

describe("formatSlotLabel", () => {
  it("formats start/end as a range", () => {
    expect(formatSlotLabel({ startTime: "09:00", endTime: "10:00" })).toBe("09:00 – 10:00");
  });

  it("handles missing times", () => {
    expect(formatSlotLabel({})).toBe("");
    expect(formatSlotLabel(null)).toBe("");
  });
});

describe("buildSlotKey", () => {
  it("produces a stable day:start-end key", () => {
    expect(buildSlotKey(2, { startTime: "09:00", endTime: "10:00" })).toBe("2:09:00-10:00");
  });
});

describe("groupAvailability", () => {
  const docs = [
    { dayOfWeek: 1, slots: [{ startTime: "09:00", endTime: "10:00" }, { startTime: "11:00", endTime: "12:00" }] },
    { dayOfWeek: 3, slots: [{ startTime: "15:00", endTime: "16:00", isActive: true }, { startTime: "17:00", endTime: "18:00", isActive: false }] },
    { dayOfWeek: 5, slots: [{ startTime: "08:00", endTime: "09:00" }] },
  ];

  it("groups by day and maps dayLabel + slot keys", () => {
    const groups = groupAvailability(docs);
    expect(groups).toHaveLength(3);
    expect(groups[0].dayOfWeek).toBe(1);
    expect(groups[0].dayLabel).toBe("Mon");
    expect(groups[0].slots).toHaveLength(2);
    expect(groups[0].slots[0].key).toBe("1:09:00-10:00");
  });

  it("excludes inactive slots but keeps the day if other slots are active", () => {
    const groups = groupAvailability(docs);
    const wed = groups.find((g) => g.dayOfWeek === 3);
    expect(wed.slots.map((s) => s.startTime)).toEqual(["15:00"]);
  });

  it("drops days with no active slots", () => {
    const groups = groupAvailability([{ dayOfWeek: 4, slots: [{ startTime: "09:00", endTime: "10:00", isActive: false }] }]);
    expect(groups).toEqual([]);
  });

  it("returns empty for empty/invalid input", () => {
    expect(groupAvailability([])).toEqual([]);
    expect(groupAvailability([{ slots: [{ startTime: "09:00", endTime: "10:00" }] }])).toEqual([]);
  });
});

describe("sortByDayOfWeek", () => {
  it("sorts groups by dayOfWeek and does not mutate input", () => {
    const input = [{ dayOfWeek: 5 }, { dayOfWeek: 1 }, { dayOfWeek: 3 }];
    const sorted = sortByDayOfWeek(input);
    expect(sorted.map((g) => g.dayOfWeek)).toEqual([1, 3, 5]);
    expect(input.map((g) => g.dayOfWeek)).toEqual([5, 1, 3]); // unchanged
  });
});

describe("day name tables", () => {
  it("uses Sunday-first indexing to match backend dayOfWeek", () => {
    expect(DAY_NAMES[0]).toBe("Sun");
    expect(DAY_NAMES[6]).toBe("Sat");
    expect(DAY_NAMES_FULL[0]).toBe("Sunday");
    expect(DAY_NAMES_FULL[6]).toBe("Saturday");
  });
});
