import { describe, it, expect } from "vitest";
import {
  WEEKDAYS,
  DAYS_IN_GRID,
  dayKey,
  monthStart,
  monthEnd,
  buildGridDays,
  groupByDay,
} from "../sessionCalendar";

describe("dayKey", () => {
  it("normalizes a date to a local y-m-d key", () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe("2026-0-5"); // Jan 5
  });

  it("accepts ISO strings", () => {
    expect(dayKey("2026-06-15T10:00:00")).toBe("2026-5-15"); // June = month 5
  });
});

describe("monthStart / monthEnd", () => {
  it("returns the first instant of the month", () => {
    const start = monthStart(new Date(2026, 3, 15));
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(3);
    expect(start.getDate()).toBe(1);
    expect(start.getHours()).toBe(0);
  });

  it("returns the last instant of the month (inclusive end)", () => {
    const end = monthEnd(new Date(2026, 1, 10)); // Feb 2026
    expect(end.getFullYear()).toBe(2026);
    expect(end.getMonth()).toBe(1);
    expect(end.getDate()).toBe(28);
    expect(end.getHours()).toBe(23);
  });
});

describe("buildGridDays", () => {
  it("always produces a 6-week (42-day) grid", () => {
    expect(buildGridDays(new Date(2026, 0, 1))).toHaveLength(DAYS_IN_GRID);
    expect(buildGridDays(new Date(2026, 5, 15))).toHaveLength(DAYS_IN_GRID);
  });

  it("starts on the Sunday on or before the 1st of the month", () => {
    // Feb 2026 starts on a Sunday, so the grid must start on Feb 1 itself.
    const grid = buildGridDays(new Date(2026, 1, 14));
    expect(grid[0].getDate()).toBe(1);
    expect(grid[0].getDay()).toBe(0); // Sunday
  });

  it("bleeds into the previous month when the 1st is not a Sunday", () => {
    // Jan 2026 starts on a Thursday (day 4) → grid starts on the prior Sunday (Dec 28 2025).
    const grid = buildGridDays(new Date(2026, 0, 10));
    expect(grid[0].getDay()).toBe(0);
    expect(grid[0].getMonth()).toBe(11); // Dec (previous year)
    expect(grid[0].getFullYear()).toBe(2025);
  });

  it("covers the entire displayed month within the grid", () => {
    const grid = buildGridDays(new Date(2026, 0, 1));
    const dates = grid.map((d) => d.getDate());
    expect(dates).toContain(31); // Jan has 31 days
  });
});

describe("groupByDay", () => {
  it("groups sessions by their scheduledAt day", () => {
    const sessions = [
      { _id: "a", scheduledAt: new Date(2026, 0, 5, 9, 0).toISOString() },
      { _id: "b", scheduledAt: new Date(2026, 0, 5, 14, 30).toISOString() },
      { _id: "c", scheduledAt: new Date(2026, 0, 7, 10, 0).toISOString() },
    ];
    const map = groupByDay(sessions);
    expect(map["2026-0-5"]).toHaveLength(2);
    expect(map["2026-0-7"]).toHaveLength(1);
  });

  it("returns an empty map for empty input", () => {
    expect(groupByDay([])).toEqual({});
  });
});
