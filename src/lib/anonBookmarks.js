/**
 * Anonymous bookmark storage — a lightweight localStorage interest list.
 *
 * Logged-out visitors can save tutors/tuitions while browsing. The target ids
 * are stored locally under a single key and migrated to real server-side
 * bookmarks on first login (see useAnonBookmarkMigration).
 *
 * Storage shape:
 *   { tutors: string[], tuitions: string[] }
 */

const STORAGE_KEY = "etuitionhub_anon_bookmarks";

const DEFAULT_VALUE = { tutors: [], tuitions: [] };

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tutors: [], tuitions: [] };
    const parsed = JSON.parse(raw);
    return {
      tutors: Array.isArray(parsed.tutors) ? parsed.tutors : [],
      tuitions: Array.isArray(parsed.tuitions) ? parsed.tuitions : [],
    };
  } catch {
    return DEFAULT_VALUE;
  }
};

const write = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode / quota) — interest list is best-effort
  }
};

export const hasAnonBookmark = (type, id) =>
  read()[type === "tuition" ? "tuitions" : "tutors"].includes(id);

export const addAnonBookmark = (type, id) => {
  const bucket = type === "tuition" ? "tuitions" : "tutors";
  const data = read();
  if (data[bucket].includes(id)) return false;
  data[bucket] = [...data[bucket], id];
  write(data);
  return true;
};

export const removeAnonBookmark = (type, id) => {
  const bucket = type === "tuition" ? "tuitions" : "tutors";
  const data = read();
  if (!data[bucket].includes(id)) return false;
  data[bucket] = data[bucket].filter((x) => x !== id);
  write(data);
  return true;
};

export const getAnonBookmarks = () => read();

export const clearAnonBookmarks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const anonBookmarkCount = () => {
  const data = read();
  return data.tutors.length + data.tuitions.length;
};
