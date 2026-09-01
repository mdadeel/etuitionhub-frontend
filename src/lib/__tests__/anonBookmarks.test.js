import { describe, it, expect, beforeEach } from "vitest";
import {
  hasAnonBookmark,
  addAnonBookmark,
  removeAnonBookmark,
  getAnonBookmarks,
  clearAnonBookmarks,
  anonBookmarkCount,
} from "../anonBookmarks";

describe("anonBookmarks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty lists when nothing is saved", () => {
    expect(getAnonBookmarks()).toEqual({ tutors: [], tuitions: [] });
    expect(anonBookmarkCount()).toBe(0);
    expect(hasAnonBookmark("tutor", "abc")).toBe(false);
  });

  it("adds a tutor bookmark and reports it as saved", () => {
    expect(addAnonBookmark("tutor", "tutor-1")).toBe(true);
    expect(hasAnonBookmark("tutor", "tutor-1")).toBe(true);
    expect(anonBookmarkCount()).toBe(1);
  });

  it("adds a tuition bookmark to a separate bucket", () => {
    addAnonBookmark("tutor", "tutor-1");
    addAnonBookmark("tuition", "tuition-1");

    const data = getAnonBookmarks();
    expect(data.tutors).toEqual(["tutor-1"]);
    expect(data.tuitions).toEqual(["tuition-1"]);
    expect(anonBookmarkCount()).toBe(2);
  });

  it("is idempotent — adding the same id twice does not duplicate", () => {
    expect(addAnonBookmark("tutor", "tutor-1")).toBe(true);
    expect(addAnonBookmark("tutor", "tutor-1")).toBe(false);
    expect(getAnonBookmarks().tutors).toEqual(["tutor-1"]);
  });

  it("removes a bookmark", () => {
    addAnonBookmark("tutor", "tutor-1");
    addAnonBookmark("tutor", "tutor-2");

    expect(removeAnonBookmark("tutor", "tutor-1")).toBe(true);
    expect(removeAnonBookmark("tutor", "tutor-1")).toBe(false);
    expect(getAnonBookmarks().tutors).toEqual(["tutor-2"]);
  });

  it("persists across reads (localStorage is the source of truth)", () => {
    addAnonBookmark("tuition", "tuition-9");
    // Simulate a fresh module read by re-reading storage directly.
    const persisted = JSON.parse(localStorage.getItem("etuitionhub_anon_bookmarks"));
    expect(persisted.tuitions).toEqual(["tuition-9"]);
  });

  it("survives corrupt storage by returning empty lists", () => {
    localStorage.setItem("etuitionhub_anon_bookmarks", "{not valid json");
    expect(getAnonBookmarks()).toEqual({ tutors: [], tuitions: [] });
    expect(anonBookmarkCount()).toBe(0);
  });

  it("clearAnonBookmarks removes everything", () => {
    addAnonBookmark("tutor", "tutor-1");
    addAnonBookmark("tuition", "tuition-1");
    clearAnonBookmarks();
    expect(getAnonBookmarks()).toEqual({ tutors: [], tuitions: [] });
    expect(localStorage.getItem("etuitionhub_anon_bookmarks")).toBeNull();
  });
});
