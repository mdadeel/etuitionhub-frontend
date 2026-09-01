/**
 * Session calendar date helpers — pure functions, framework-free so they're
 * unit-testable and reusable by the SessionCalendar dashboard view.
 */

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYS_IN_GRID = 42; // 6 rows x 7 columns — stable grid height

/** Normalize a date to a local "yyyy-m-d" key for grouping sessions by day. */
export const dayKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/** First instant of the month containing `cursor` (local time). */
export const monthStart = (cursor) => new Date(cursor.getFullYear(), cursor.getMonth(), 1);

/** Last instant of the month containing `cursor` (local time). */
export const monthEnd = (cursor) =>
  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999);

/**
 * Build the 42-cell month grid for a cursor date, starting on Sunday.
 * Leading/trailing cells bleed into adjacent months (offset from getDay()).
 * @param {Date} cursor - any date inside the displayed month
 * @returns {Date[]} 42 dates, first = Sunday before or on the 1st
 */
export const buildGridDays = (cursor) => {
  const start = monthStart(cursor);
  const offset = start.getDay(); // Sunday = 0
  const days = [];
  for (let i = 0; i < DAYS_IN_GRID; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i - offset);
    days.push(d);
  }
  return days;
};

/**
 * Group sessions by their scheduledAt day key.
 * @param {Array} sessions - sessions with a `scheduledAt` field
 * @returns {Record<string, Array>} dayKey -> sessions
 */
export const groupByDay = (sessions) => {
  const map = {};
  for (const s of sessions) {
    const key = dayKey(s.scheduledAt);
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }
  return map;
};
