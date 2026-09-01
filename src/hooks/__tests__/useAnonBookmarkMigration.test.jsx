import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  addAnonBookmark,
  clearAnonBookmarks,
  getAnonBookmarks,
} from "../../lib/anonBookmarks";

const T1 = "507f1f77bcf86cd799439011";
const T2 = "507f1f77bcf86cd799439012";
const TU1 = "507f1f77bcf86cd799439021";

vi.mock("../../contexts/AuthContext", () => ({
  useAuthUser: () => authState,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

import useAnonBookmarkMigration from "../useAnonBookmarkMigration";
import api from "../../services/api";
import toast from "react-hot-toast";

let authState = { user: null, dbUser: null };

describe("useAnonBookmarkMigration", () => {
  beforeEach(() => {
    clearAnonBookmarks();
    vi.clearAllMocks();
    authState = { user: null, dbUser: null };
  });

  it("does nothing when the user is not logged in", () => {
    addAnonBookmark("tutor", T1);
    renderHook(() => useAnonBookmarkMigration());
    expect(api.post).not.toHaveBeenCalled();
    // localStorage list untouched while anonymous
    expect(getAnonBookmarks().tutors).toEqual([T1]);
  });

  it("migrates anonymous tutor bookmarks after login and clears the list", async () => {
    addAnonBookmark("tutor", T1);
    addAnonBookmark("tutor", T2);
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1" } };

    renderHook(() => useAnonBookmarkMigration());

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/api/bookmarks/${T1}`);
      expect(api.post).toHaveBeenCalledWith(`/api/bookmarks/${T2}`);
    });

    // localStorage cleared after migration
    await waitFor(() => expect(getAnonBookmarks().tutors).toEqual([]));
    expect(toast.success).toHaveBeenCalled();
  });

  it("migrates anonymous tuition bookmarks to the tuition endpoint", async () => {
    addAnonBookmark("tuition", TU1);
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1" } };

    renderHook(() => useAnonBookmarkMigration());

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/api/bookmarks/tuitions/${TU1}`);
    });
  });

  it("skips ids that are not valid Mongo ObjectIds", async () => {
    addAnonBookmark("tutor", "not-an-object-id");
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1" } };

    renderHook(() => useAnonBookmarkMigration());
    await waitFor(() => expect(getAnonBookmarks().tutors).toEqual([]));
    expect(api.post).not.toHaveBeenCalled();
  });

  it("runs only once per session even if dbUser updates", async () => {
    addAnonBookmark("tutor", T1);
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1" } };

    const { rerender } = renderHook(() => useAnonBookmarkMigration());

    // Simulate a second dbUser refresh for the same user.
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1", role: "student" } };
    rerender();

    await waitFor(() => expect(getAnonBookmarks().tutors).toEqual([]));
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it("removes only the items that POSTed successfully, keeping failures for retry", async () => {
    api.post
      .mockResolvedValueOnce({ data: {} })
      .mockRejectedValueOnce(new Error("network"));
    addAnonBookmark("tutor", T1);
    addAnonBookmark("tutor", T2);
    authState = { user: { uid: "u1" }, dbUser: { _id: "db1" } };

    renderHook(() => useAnonBookmarkMigration());

    // T1 succeeded and was removed; T2 failed and stays for the next login.
    await waitFor(() => expect(getAnonBookmarks().tutors).toEqual([T2]));
    expect(api.post).toHaveBeenCalledTimes(2);
  });
});
