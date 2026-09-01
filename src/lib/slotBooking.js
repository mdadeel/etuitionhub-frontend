/**
 * Public "Book a slot" helpers — pure functions used by the public booking
 * page (PublicBookingPage) and the tutor dashboard's share-link control.
 */

/** Day index (0 = Sunday) → short label. Matches the backend dayOfWeek field. */
export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Build the public booking URL for a tutor. */
export const generateBookingLink = (tutorId) => `/book/${tutorId}`;

/** Format a slot start/end pair as a single label, e.g. "09:00 – 10:00". */
export const formatSlotLabel = (slot) => {
  const start = slot?.startTime || "";
  const end = slot?.endTime || "";
  if (!start && !end) return "";
  return `${start} – ${end}`;
};

/** Stable key for a day+slot tuple (used as React key + to dedupe). */
export const buildSlotKey = (dayOfWeek, slot) =>
  `${dayOfWeek}:${slot?.startTime || ""}-${slot?.endTime || ""}`;

/**
 * Map backend availability docs into a display-friendly grouped shape:
 *   [{ dayOfWeek, dayLabel, slots: [{ startTime, endTime, isActive, key }] }]
 * Only active slots are included.
 */
export const groupAvailability = (docs = []) =>
  docs
    .filter((d) => d && Number.isInteger(d.dayOfWeek))
    .map((d) => ({
      dayOfWeek: d.dayOfWeek,
      dayLabel: DAY_NAMES[d.dayOfWeek] || "—",
      slots: (Array.isArray(d.slots) ? d.slots : [])
        .filter((s) => s && s.startTime && s.endTime && s.isActive !== false)
        .map((s) => ({ ...s, key: buildSlotKey(d.dayOfWeek, s) })),
    }))
    .filter((d) => d.slots.length > 0);

/** Sort grouped availability by day-of-week order. */
export const sortByDayOfWeek = (groups = []) =>
  [...groups].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
