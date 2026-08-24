# Implementation Plan — Admin Login Fix + Role/Status-Based Badges

**Status:** Draft (not yet approved)
**Source audit:** Deep-scan audit (2026-08-24) — see `docs/audits/` for the full audit findings.
**Affected repos:** `etuitionhub--backend` (backend) + `etuitionhub-frontend` (frontend)
**Phases:** 3 phases, ordered by dependency. Each phase independently verifiable.

---

## Phase 1 — Fix admin login routing (the "logged into demo student" bug)

### 1.1 Prevent silent auto-redirect off the login pages

**Problem:** `PublicRoute.jsx:40-43` silently `Navigate`s any signed-in user away from `/login`, `/admin-login`, `/register`. A stale `localStorage` Firebase session (default persistence, never overridden) drops an admin straight into the student dashboard before they can reach the admin form.

**File:** `etuitionhub-frontend/src/components/shared/PublicRoute.jsx`

**Change:** Replace the silent redirect with an interstitial when `user` is set and `dbUser` is loaded. The interstitial shows:
- "You're already signed in as **{displayName}** ({role})"
- "Continue to Dashboard" button → `<Navigate to={defaultRouteFor(dbUser)} replace />`
- "Sign out" button → calls `logout()` from `useAuth`, then re-renders `children`
- A footer link: "Not you? Sign out and try again."

**Verification:**
- Unit test: signed-in student on `/admin-login` → interstitial renders (not a redirect); click "Sign out" → `logout` called; click "Continue" → navigates to `/dashboard`.
- Manual: log in as student, close tab, reopen `/admin-login` → sees the interstitial, can reach the admin form.
- E2E: existing e2e specs that start signed-in continue to flow correctly (they click "Continue" explicitly).

### 1.2 Provision known admins instead of silently down-rolling them

**Problem:** `authController.createJWT:51-66` + `authService.findOrCreateUser:40-68` force `role:'student'` for any email missing from MongoDB — including an admin's email. The frontend then sees `role:'student'` and routes to `/dashboard`.

**Files:**
- `etuitionhub--backend/services/authService.js` — `findOrCreateUser`
- `etuitionhub--backend/src/modules/auth/controllers/authController.js` — `createJWT`, `superAdminLogin`

**Backend changes:**

**1.2a Promise-based `findOrCreateUser` promotion** (`authService.js`):
After the `$setOnInsert` upsert creates or returns the user, add a post-creation check: if the email matches `config.superadmin.email` (the configured superadmin address), upgrade the record to `globalRole: 'super_admin'` and `role: 'admin'`:

```js
// After the findOneAndUpdate call returns the user:
const superAdminEmail = config.superadmin?.email?.toLowerCase();
if (user.email === superAdminEmail && user.globalRole !== 'super_admin') {
  user.globalRole = 'super_admin';
  user.role = 'admin';
  await user.save();
}
```

This is the only trusted source — never accept a role from the client. A non-configured superadmin email means no promotion happens.

**1.2b Fix `superAdminLogin`** (`authController.js:298-315`):
Currently for a brand-new DB user, `findOrCreateUser` returns a `student` record, then `generateToken(user)` mints a student-kosher token. The `else if (user.globalRole !== 'super_admin')` promo branch is unreachable for fresh records.

Fix: after `findOrCreateUser`, always set `globalRole: 'super_admin'` on the returned user, then save before generating the token:

```js
const result = await authService.findOrCreateUser({ email: dbEmail, displayName: 'Super Admin' });
let user = result.user;
user.globalRole = 'super_admin';
user.role = 'admin';
await user.save();
```

**Verification (backend Jest):**
- `findOrCreateUser` with the configured superadmin email → record + token carry `globalRole:'super_admin'`.
- `findOrCreateUser` with any other email → stays `student` (no privilege leak).
- `superAdminLogin` on a *fresh* DB (empty users) → returns `globalRole:'super_admin'`, token allows a super-admin protected route.
- `superAdminLogin` on an existing `role:'admin'` record → preserves `globalRole:'super_admin'`.

### 1.3 Unify "is admin" to the backend's canonical signal

**Problem:** Backend `User.js:29-36` declares `role:'admin'` vestigial; canonical is `globalRole === 'super_admin'`. Frontend `isAdmin()` (`authz.js:5-6`) ORs in `role === 'admin'` — the two layers disagree.

**Frontend changes:**

**1.3a `etuitionhub-frontend/src/lib/authz.js`**
```js
export const isAdmin = (dbUser) => dbUser?.globalRole === 'super_admin';
```
`defaultRouteFor` stays as-is (it already prefers `globalRole` first). `isAdminPath` also unchanged.

**1.3b `etuitionhub-frontend/src/routes/AdminRoutes.jsx:19`**
Change the guard from:
```js
if (dbUser?.role !== 'admin' && dbUser?.globalRole !== 'super_admin')
```
to:
```js
if (dbUser?.globalRole !== 'super_admin')
```
`SuperAdminRoutes.jsx:23` is already `globalRole !== 'super_admin'` — no change needed.

**1.3c Legacy migration (one-time seed script)**
Create `etuitionhub--backend/scripts/promote-legacy-admins.js`:
```js
// Finds all users with role:'admin' and globalRole NOT 'super_admin',
// then sets globalRole: 'super_admin' on them.
const User = require('../src/modules/auth/models/User');
const result = await User.updateMany(
  { role: 'admin', globalRole: { $ne: 'super_admin' } },
  { $set: { globalRole: 'super_admin' } }
);
console.log(`Promoted ${result.modifiedCount} legacy admin records.`);
```
Run this before deploying the frontend so no admin is stranded.

**Verification:** `isAdmin` unit test — super_admin → true; student/tutor/legacy-admin-without-globalRole → false. Re-run admin e2e spec (`e2e/admin-approve-payment.spec.js`) after seeding.

### 1.4 Fix admin session cookie lifetime (audit finding #2)

**Problem:** `getCookieOptions(role)` (`authService.js:126-131`) shortens `maxAge` only when the role argument is `'super_admin'`, but every caller passes `user.role` (the legacy field, which is `'admin'`). So the 1-hour admin window never engages.

**File:** `etuitionhub--backend/services/authService.js`

**Change:** Check both admin signals:
```js
const isAdminRole = role === 'super_admin' || role === 'admin';
maxAge: isAdminRole ? config.admin.sessionMaxAge : 7 * 24 * 60 * 60 * 1000
```

Then, at the call sites in `authController.js`, pass `user.globalRole || user.role` instead of `user.role` so `'super_admin'` reaches the check.

**Verification:** Integration test asserting `Set-Cookie: token ... Max-Age` is 1 hour for admin login, 7 days for student login.

### 1.5 (LOW, optional) Remove dead `res.data.token` logic

**File:** `etuitionhub-frontend/src/hooks/useSessionManager.js:54`

**Change:** `setJWT` checks `res.data.token` (line 54), but `createJWT` never returns a `token` field — cookies are set server-side. Remove the branch or replace with a comment. Identical behavior before and after; purely cosmetic.

---

## Phase 2 — Badges derived from role + account status

### 2.1 New `RoleBadge` component

**Create:** `etuitionhub-frontend/src/components/shared/RoleBadge.jsx`

Renders the user's `globalRole`/`role` as a badge using semantic tokens. Single source of truth for role display.

| `dbUser` value | Badge text | Style variant |
|---|---|---|
| `globalRole === 'super_admin'` | Super Admin | `bg-destructive/10 text-destructive border-destructive/20` |
| `role === 'admin'` (legacy, no super_admin) | Admin | `bg-primary/10 text-primary border-primary/20` |
| `role === 'tutor'` | Tutor | `bg-muted text-foreground border-border` |
| `role === 'student'` (default) | Student | `bg-muted text-muted-foreground border-transparent` |

Props: `({ globalRole, role })` — no `className` leak, semantic tokens only.

**Consumers:** Wire into `DashboardSidebar.jsx` (alongside the user avatar/name) and the profile header on `/dashboard/profile`. These are the two places a user naturally looks at their identity.

**Verification:** Unit test — each role variant renders the expected text + style class. Manual: log in as student → sees "Student" badge; log in as super_admin → sees "Super Admin" badge in red.

### 2.2 Unify verification-status badge config

**Problem:** `StatusBadge` (`STATUS_CONFIG`) and `TrustBadges` (`STATUS_BADGES:3-7`) are two configs that disagree — `TrustBadges` omits `verified_basic`/`verified_premium`, so a *fully verified* tutor shows no status badge from `TrustBadges`.

**File:** `etuitionhub-frontend/src/components/shared/TrustBadges.jsx`

**Change:** Replace the inline STATUS_BADGES status chip with `<StatusBadge status={tutor.verificationStatus} />`. Delete the duplicate `STATUS_BADGES` object. This makes `TrustBadges` always render the correct label for any verification status:

```jsx
const TrustBadges = ({ tutor }) => {
  if (!tutor) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tutor.verificationStatus && (
        <StatusBadge status={tutor.verificationStatus} />
      )}
      {tutor.nidVerified && ( ... )}
      {tutor.verifiedReviewsCount > 0 && ( ... )}
      {tutor.credentialVerified && ( ... )}
    </div>
  );
};
```

**Consumers:** `TutorCard`, `TutorDetails`, `DashUsers` (already uses `StatusBadge` directly), `AdminTutors` — all pass through the same `tutor` object. No API change.

**Verification:** Extend `src/components/shared/__tests__/TrustBadges.test.jsx` — verified tutor renders a `verified_basic`/`verified_premium` badge; unverified/pending_review render their correct labels. Degree/NID/review chips unchanged.

### 2.3 Remove fabricated credibility data

**File:** `etuitionhub-frontend/src/components/CredibilityBadge.jsx`

**Changes:**

**2.3a** Remove the hard-coded `: 80` fallback on line 17:
```js
// Before:
const responseRate = requestsRespondedCount > 0
  ? Math.round((requestsRespondedCount / requestsReceived) * 100)
  : 80;  // ← fabricated
// After:
const responseRate = requestsRespondedCount > 0
  ? Math.round((requestsRespondedCount / requestsReceived) * 100)
  : null;
if (responseRate === null) return null;
```

**2.3b** Gate the "Verified Profile" branch (lines 5-12) on actual `verificationStatus` rather than `profileCompleteness >= 80`. Pass `verificationStatus` as a prop, or replace the whole branch with a `StatusBadge` usage. The profile-completeness heuristic is not a reliable signal of verified status.

**2.3c** Add unit test: `requestsRespondedCount === 0` → no badge rendered (not "80%").

**Verification:** CredibilityBadge test — no badge when response count is 0; accurate rate when data exists; "Verified Profile" only when `verificationStatus` is `verified_basic` or `verified_premium`.

---

## Phase 3 — Test matrix & rollout

### Test matrix

| Level | Scope | What it verifies | Command / files |
|---|---|---|---|
| Backend unit | `authService.js` | `findOrCreateUser` admin-promote / non-admin no-leak; cookie `Max-Age` for admin vs student | `npm test` (backend) |
| Backend integration | `authController.js` | `createJWT` auto-create + admin allowlist; super_admin token can access super-admin route; `superAdminLogin` fresh-DB | Jest + supertest (existing auth test files) |
| Frontend unit | `isAdmin()` | `globalRole === 'super_admin'` → true; student/tutor/legacy-admin-no-global → false | `npm test` (frontend) |
| Frontend unit | `PublicRoute` interstitial | Signed-in user on `/admin-login` → interstitial renders; click "Continue" → navigates; click "Sign out" → logout | `npm test` (frontend) |
| Frontend unit | `RoleBadge` | Each role variant renders correct text + style | `npm test` (frontend) |
| Frontend unit | `TrustBadges` | Verified tutor renders `verified_basic`/`verified_premium` badge; unverified renders correct label | `npm test` (frontend) |
| Frontend unit | `CredibilityBadge` | No badge when `requestsRespondedCount === 0`; accurate rate otherwise | `npm test` (frontend) |
| E2E | Admin login | Seeded admin → `/super-admin` dashboard loads | `npx playwright test e2e/admin-approve-payment.spec.js` |
| E2E | Session handoff | Logged-in student visiting `/admin-login` → interstitial, not auto-redirect | `npx playwright test e2e/` |
| Manual | Fresh browser | Register student → close tab → reopen `/admin-login` → form reachable; sign in admin → `/super-admin` | dev servers |
| Build | Frontend | `npm run build` passes with no errors | `npm run build` |
| Lint | Both | `npm run lint` passes | `npm run lint` (both repos) |

### Rollout order

```
1. Backend: 1.2a + 1.2b + 1.4  (admin provisioning, cookie fix)
   → npm test
   → deploy backend

2. Database: 1.3c  (promote legacy admin records)
   → run promote-legacy-admins.js against prod DB

3. Frontend: 1.1 + 1.3a + 1.3b  (interstitial, authz fix)
   → npm test + npm run build + npm run lint
   → deploy frontend

4. Frontend: 1.5 (optional: dead code removal)
   → npm test
   → (no deploy needed, churn-only)

5. Frontend: Phase 2 (badges)
   → npm test + npm run build + npm run lint
   → deploy frontend
```

### Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Legacy `role:'admin'`, `globalRole:'user'` records lose admin access | Medium | Run `promote-legacy-admins.js` before deploying frontend Phase 1. Verify count of affected records. |
| Interstitial changes login UX for returning students | Medium | One extra click (Continue vs Sign out). Not a regression for the admin use case. E2E specs need a small update to click "Continue" on the interstitial. |
| `config.superadmin.email` is empty in prod, so admin allowlist promotion never fires | Low | Document that `seed-admin.js` remains the fallback provisioning path. Add a startup warning if `config.superadmin?.email` is not set. |
| `findOrCreateUser` promotion re-saves the same record on every login for the superadmin | Low | Guard with `if (user.globalRole !== 'super_admin')` — one-time promotion per record. |
| Badge changes break tutor card rendering | Low | Phase 2 is purely additive (new `RoleBadge` component). `TrustBadges` reuses existing `StatusBadge` — same props, same output for unverified/pending states. |

### Pre-deploy checklist

- [ ] `promote-legacy-admins.js` run against production MongoDB
- [ ] Backend `npm test` — all green
- [ ] Frontend `npm run build` — no errors
- [ ] Frontend `npm run lint` — no errors
- [ ] Frontend `npm test` — all green
- [ ] E2E spec `admin-approve-payment.spec.js` — passes
- [ ] Manual smoke: admin login → `/super-admin` dashboard loads
- [ ] Manual smoke: student login → `/dashboard` loads, "Student" badge visible
- [ ] Manual smoke: logout → `/login` reachable, no stale session redirect