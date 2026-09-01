/**
 * Tutor comparison — pure selection logic.
 *
 * Kept framework-free so it's unit-testable and reusable by the Tutors
 * directory page and any future surfaces. Only real, present-on-the-list
 * fields are compared (no fabricated response-rate or rating numbers).
 */

/** Maximum number of tutors a user can select for side-by-side comparison. */
export const MAX_COMPARE = 3;

/**
 * Toggle a tutor in/out of the comparison selection.
 * @param {string[]} currentIds - currently selected tutor ids
 * @param {string} id - the tutor id being toggled
 * @param {number} [max=MAX_COMPARE] - upper bound on selection size
 * @returns {{ ids: string[], rejected: boolean }} new selection + whether the
 *   toggle was refused because the selection is already full.
 */
export const toggleCompare = (currentIds, id, max = MAX_COMPARE) => {
  const ids = Array.isArray(currentIds) ? currentIds : [];
  if (ids.includes(id)) {
    return { ids: ids.filter((x) => x !== id), rejected: false };
  }
  if (ids.length >= max) {
    return { ids, rejected: true };
  }
  return { ids: [...ids, id], rejected: false };
};

/** Build the side-by-side comparison rows for the selected tutors. */
export const buildComparisonRows = (tutors) => {
  const list = Array.isArray(tutors) ? tutors : [];
  if (list.length === 0) return [];
  return [
    {
      label: "Monthly fee",
      values: list.map((t) => `৳${(t.expectedSalary || 0).toLocaleString()}`),
    },
    {
      label: "Subjects",
      values: list.map((t) => (Array.isArray(t.subjects) ? t.subjects.join(", ") : "—")),
    },
    {
      label: "Location",
      values: list.map((t) => t.location || "—"),
    },
    {
      label: "Experience",
      values: list.map((t) => t.experience || "—"),
    },
    {
      label: "Qualification",
      values: list.map((t) => t.qualification || "—"),
    },
    {
      label: "Verification",
      values: list.map((t) =>
        t.verificationStatus
          ? t.verificationStatus
          : t.isVerified
            ? "verified"
            : "unverified"
      ),
    },
    {
      label: "Rating",
      values: list.map((t) => (t.ratings || t.rating || 0) || null),
    },
  ];
};
