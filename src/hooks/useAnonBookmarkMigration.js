import { useEffect, useRef } from "react";
import { useAuthUser } from "@/contexts/AuthContext";
import { getAnonBookmarks, removeAnonBookmark } from "@/lib/anonBookmarks";
import api from "@/services/api";
import toast from "react-hot-toast";

/**
 * Migrate anonymous localStorage bookmarks to genuine server-side bookmarks
 * on first login. Runs exactly once — when dbUser transitions from null to
 * non-null for the first time in the session.
 *
 * The migration POSTs each saved target id individually to the existing
 * bookmark endpoints. Items that POST successfully are removed from
 * localStorage as they complete; items that fail are left in place so the
 * next login can retry them.
 */
const useAnonBookmarkMigration = () => {
  const { user, dbUser } = useAuthUser();
  const migrated = useRef(false);

  useEffect(() => {
    // Wait for both a Firebase user and a backend user record.
    if (!user || !dbUser) return;
    // Only migrate once per session.
    if (migrated.current) return;
    migrated.current = true;

    const { tutors, tuitions } = getAnonBookmarks();
    const total = tutors.length + tuitions.length;
    if (total === 0) return;

    let migratedCount = 0;

    const migrate = async () => {
      const promises = [];

      for (const tutorId of tutors) {
        if (!/^[a-f\d]{24}$/i.test(tutorId)) {
          // Structurally invalid — can never be migrated, so prune it.
          removeAnonBookmark("tutor", tutorId);
          continue;
        }
        promises.push(
          api
            .post(`/api/bookmarks/${tutorId}`)
            .then(() => {
              removeAnonBookmark("tutor", tutorId);
              migratedCount++;
            })
            .catch(() => {
              /* best-effort — left in localStorage for a later retry */
            })
        );
      }

      for (const tuitionId of tuitions) {
        if (!/^[a-f\d]{24}$/i.test(tuitionId)) {
          removeAnonBookmark("tuition", tuitionId);
          continue;
        }
        promises.push(
          api
            .post(`/api/bookmarks/tuitions/${tuitionId}`)
            .then(() => {
              removeAnonBookmark("tuition", tuitionId);
              migratedCount++;
            })
            .catch(() => {
              /* best-effort */
            })
        );
      }

      await Promise.allSettled(promises);

      if (migratedCount > 0) {
        toast.success(
          `Saved ${migratedCount} item${migratedCount > 1 ? "s" : ""} to your account`
        );
      }
    };

    migrate();
  }, [user, dbUser]);
};

export default useAnonBookmarkMigration;