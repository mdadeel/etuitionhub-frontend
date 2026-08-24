# Implementation Plan — Role & Capability Audit Fixes + Additions

**Status:** Draft (not yet approved)
**Source audit:** `docs/audits/role-capability-audit.md` (2026-08-24)
**Affected repos:** `etuitionhub--backend` + `etuitionhub-frontend`
**Principle:** Fix the system before the page; protect existing behavior; verify each phase with tests/build before moving on. New features reuse existing modules (analytics, guardian, settings, wallet, search-alerts) instead of new scaffolding.

---

## Phase 0 — Data verification (prereq for fixing fabricated content)

**0.1 Verify real numbers (requires production DB access — run this first).**

| Item | Where it appears | What to check |
|---|---|---|
| "2,500+ tutors" | `Home.jsx:25` (SEO) + `Home.jsx:75` | `db.users.countDocuments({ role:'tutor' })` — replace copy with real count or neutral copy |
| `ratings \|\| '4.9'` | `TutorDetails.jsx` | Is there a real ratings/avgRating field on the tutor profile? If yes, use it; if not, remove the fallback |
| Hardcoded "Verified" badge | `TuitionDetails.jsx` | Use the tuition/tutor's real `verificationStatus` |

**Verification:** Record the real counts in the plan and confirm what fields exist in prod tutor docs.

---

## Phase 1 — Critical fixes (small, surgical, ordered)

### 1.1 Make `GET /api/tutors/:id` public with anonymization (HIGH)

**Problem:** Backend gates the detail route with `authMiddleware` (`tutorRoutes.js:56`) but the frontend `/tutor/:id` page is public → anonymous visitors and crawlers get `401` / "Profile Not Found". Tutor profiles are the supply side of the marketplace — they should be crawlable.

**Files:**
- Backend `src/modules/tutor/routes/tutorRoutes.js`
- Backend `src/modules/tutor/controllers/tutorController.js`
- Frontend `src/pages/TutorDetails.jsx`

**Change:**
- Remove `authMiddleware` from `router.get('/:id', ...)` in `tutorRoutes.js`.
- Verify `tutorController.getById` handles `req.user` being `undefined` for anonymous requests (the anonymization branch already strips `email`, `mobileNumber`, `verificationDocuments`, `lastLogout`, `passwordHash`, `firebaseUid` for non-owner/non-admin — confirm it doesn't throw when `req.user` is absent). Add a Joi/`validateId` path already present.
- Frontend `TutorDetails.jsx`: remove the `tutor.ratings || '4.9'` fallback; render only real fields. Keep login-gated actions (Message / Request to Hire / Save) as-is — they already open the login modal for anons.

**Verification:**
- Backend Jest: anonymous `GET /api/tutors/:id` → 200 with anonymized payload (no email/phone/docs); owner → full; super_admin → full.
- Frontend: visit `/tutor/:id` logged-out → profile renders (name/subjects/verification badges), no "Profile Not Found".
- `npm test` (backend), `npm run build` + `npm run lint` (frontend).

### 1.2 Block tutors from posting tuitions server-side (MEDIUM)

**Problem:** `PostTuition.jsx` blocks `role==='tutor'` client-side, but backend `POST /api/tuitions` (`tuitionRoutes.js:53`) doesn't — a tutor calling the API directly creates a "student-owned" tuition under their own email.

**File:** Backend `src/modules/educational/routes/tuitionRoutes.js` (or controller `create`).

**Change:** In `POST /api/tuitions`, reject when `req.user.role === 'tutor'` and `req.user.globalRole !== 'super_admin'` → `403 { error: 'Tutors cannot post tuitions' }`. Matches the client message.

**Verification:** Backend Jest — tutor token POST `/api/tuitions` → 403; student token → 201; super_admin → 201.

### 1.3 Env-gate the demo-mode notice in Checkout (MEDIUM)

**Problem:** `Checkout.jsx` shows *"Demo Mode — Transactions will be auto-verified for testing purposes"* to real users whenever the chosen method is a demo method.

**File:** Frontend `src/pages/Checkout.jsx`.

**Change:** Show the demo notice only when an explicit demo flag is set (e.g. `import.meta.env.VITE_ENABLE_DEMO === 'true'` or a `config` value). When off, show the normal manual-payment instructions. Frontend has zero env vars today — add the single `VITE_*` public-only flag, or expose it via `/api/config` like the rest of the config. Prefer `/api/config` (frontend already fetches it; `VITE_*` is public-only per security rules).

**Verification:** Manual — dev without the flag → no demo notice; with flag → notice shows. `npm run build` passes.

### 1.4 PaymentHistory: derive role from server truth, not localStorage (LOW–MEDIUM)

**Problem:** `PaymentHistory.jsx:20` reads `localStorage 'etuitionhub_user'.role` to pick the `/api/payments/tutor/:email` vs `/student/:email` endpoint. Stale localStorage role → wrong ledger (backend still protects data via `assertEmailMatchesParam`, but the UX is wrong).

**File:** Frontend `src/pages/PaymentHistory.jsx`.

**Change:** Use `dbUser.role` from `useAuth()` (server-sourced) instead of localStorage.

**Verification:** Unit test — renders tutor endpoint when `dbUser.role==='tutor'`, student endpoint otherwise. `npm test` (frontend).

### 1.5 Org directory: gate "Request to Join" behind auth (LOW)

**Problem:** Anonymous users see a working-looking "Request to Join" button that fails on click with a toast (`OrganizationDirectory.jsx:276`).

**File:** Frontend `src/pages/OrganizationDirectory.jsx`.

**Change:** When `!user`, render "Sign in to join" (link to `/login`) in place of the join button — same pattern as `OrganizationDetails`.

**Verification:** Manual + existing e2e if any. `npm run build`.

### 1.6 Org detail: remove dead placeholder + dead Contact button (LOW)

**Problem:** `OrganizationDetails.jsx` always shows *"This organization has not posted any public tuitions yet."* and the "Contact" button has no handler.

**Files:** Frontend `src/pages/OrganizationDetails.jsx`.

**Change:** Either wire "Available Tuitions" to the real org-tuition endpoint (if one exists) or remove the dead section; remove the no-op Contact button (or give it a real `mailto:`/message action).

**Verification:** Manual — org detail renders without placeholder/dead button. Build passes.

### 1.7 Remove fabricated credibility data (MEDIUM, real-data rule)

**Problems already enumerated in prior audit:** `CredibilityBadge.jsx` hardcoded `: 80` response-rate fallback + "Verified Profile" from `profileCompleteness>=80`; `TutorDetails.jsx` ratings fallback; `TuitionDetails.jsx` hardcoded "Verified" badge.

**Files:** `src/components/CredibilityBadge.jsx`, `src/pages/TutorDetails.jsx`, `src/pages/TuitionDetails.jsx`.

**Change:** Remove each fallback; render badges only from real `verificationStatus`/response data (use `<StatusBadge>`).

**Verification:** Unit tests for `CredibilityBadge` (no badge when `requestsRespondedCount===0`; "Verified" only on real `verificationStatus`).

---

## Phase 2 — Admin consolidation + super-admin landing (HIGH impact, MEDIUM effort)

### 2.1 Collapse `/admin` into `/super-admin` (IA: one concept → one destination)

**Problem:** `/admin` (`AdminRoutes.jsx`) and `/super-admin` (`SuperAdminRoutes.jsx`) both guard on `globalRole==='super_admin'` — duplicate destinations for the same audience; a legacy `role:'admin'` user without `globalRole` 403s on both.

**Files:** `src/routes/AdminRoutes.jsx`, `src/components/Dashboard/getDashboardMenuItems.js`, `src/lib/authz.js`, `src/pages/Dashboard.jsx`.

**Change:** Make `/admin` a thin redirect to `/super-admin` (or remove the route and update the menu so there is exactly one admin home). Keep `defaultRouteFor` returning `/super-admin` for `globalRole==='super_admin'`. Ensure no menu item still links to `/admin/...` for the super_admin branch (map them to `/super-admin/...`).

**Verification:** Super_admin login → lands `/super-admin`; `/admin` → redirects; no dead menu links. E2E admin spec still passes.

### 2.2 Build out `PlatformOverview` with real data (the #1 "offer more" item)

**Problem:** `PlatformOverview.jsx` shows only org count + user count + a "Quick Actions" paragraph — the weakest screen for the platform owner, while the data exists in `DashAnalytics`.

**Files:** Frontend `src/components/Dashboard/SuperAdmin/PlatformOverview.jsx`, `src/components/Dashboard/DashAnalytics.jsx` (reuse), backend analytics endpoints already present (`/api/analytics`, `/api/admin/tutors`, payments list, verifications/moderation queues).

**Change (incremental, each sub-item independently verifiable):**
1. **Money:** total commission revenue, pending payouts (from `/api/payments` admin list — sum of `available_for_withdrawal`).
2. **Growth:** active students / active tutors / tuitions posted / applications (from `/api/analytics`).
3. **Funnel:** tuitions posted → applications → confirmed bookings → paid (single query per stage, reuse existing services).
4. **Queues:** payment verification count, tutor verification count, moderation count, dispute count, withdrawal count (each is an existing admin list endpoint with `pagination.total`).
5. **Activity:** recent audit-log entries (`/api/audit-logs`) and recent tutor signups.

**Verification:** Super_admin sees real numbers, not placeholders; each card has a Loading skeleton + error state; numbers match the corresponding admin list pages. No fabricated numbers.

---

## Phase 3 — Student features (high-demand-side value)

### 3.1 Tutor comparison (P1)
Select 2–3 tutors → side-by-side table (subjects, rate, verification status, response rate, rating). Reuses `TutorCard` data + `GET /api/tutors`. Backend: none (frontend can compare already-public list data; if detail fields are needed, add a `POST /api/tutors/compare` batch endpoint gated by `authMiddleware`).

**Verification:** Unit test for the compare selector logic; manual compare flow logged-in.

### 3.2 Session calendar + reminders (P1)
New "My Calendar" view under student dashboard Engagements → month/week grid of confirmed sessions from existing `/api/sessions` + bookings. Add a reminder: reuse existing `notifications` + `mail` modules to send an in-app/email notification X hours before a session. **Backend:** add a scheduler hook or compute-on-read (avoid new infra — prefer notification at booking confirm + a cron on session start if trivial).

**Verification:** Calendar renders confirmed sessions; a booked session produces a notification at the configured lead time. Integration test for the notification trigger.

### 3.3 Anonymous interest list → reconcile on signup (P1, marketplace classic)
Allow anon visitors to save tutors/tuitions to a localStorage "interest list" before signing up; on first login, migrate to real bookmarks. Reuses existing bookmarks API. **Backend:** no new endpoint needed if migration is client-driven (POST each saved item) — safer, no server trust on anon data.

**Verification:** Anon saves 2 items → registers → both appear in `/dashboard/bookmarks`.

### 3.4 Consumer parent/guardian view (P2, big segment)
Read-only "parent" surface: a parent (linked to a student account) sees child's bookings, payments, session history, verification status — no mutating controls. Reuses the org-side `guardian` concept but on the consumer marketplace: add `parentEmail`/`guardianOf` link on the user model + `assertGuardianOf` middleware, plus a small parent dashboard.

**Verification:** Parent token can read linked student's engagements, cannot mutate. Backend unit/integration tests for `assertGuardianOf`; UI gated by link existence.

---

## Phase 4 — Tutor features (high-supply-side value)

### 4.1 Shareable "Book my slot" availability link (P1)
From existing `TutorAvailability`, generate a public link (`/tutor/:id?book=slot`) that a student can open to request that slot. Backend: availability endpoint exists (`GET /api/tutors/:id/availability` — auth-gated today; expose a public subset) — align with Phase 1.1's public tutor profile. The booking request reuses existing application/hire-request flow with a preselected time.

**Verification:** Tutor publishes availability → public link shows free slots → student request arrives in tutor's applications.

### 4.2 Earnings forecast (P1)
Tutor dashboard Overview: "projected this month" = sum of confirmed-session payments expected within the month + pending `billing_generated`/`escrow_hold` payments, minus commission. Reuses `/api/payments/tutor/:email`. Pure frontend computation over existing data — no backend change.

**Verification:** Unit test of the projection function with sample payment statuses.

### 4.3 Tutor referral program (P2, requires product decision)
Referred tutor completes verification + first confirmed session → referrer wallet bonus. Reuse wallet module (`requestWithdrawal` exists; add a `wallet_credit` type + audit). **Needs a product decision** on bonus amount and anti-abuse rules (same device/email, minimum verified-session threshold).

**Verification:** Backend integration — referral code applied → wallet credit after the verified-session trigger; no self-referral.

### 4.4 Batch AI curriculum export (P1, reuses existing AI)
`AiAssistantTutorTools`: add "Generate monthly curriculum" — loop the existing lesson-plan generator across a subject/class for N topics with one call + a combined export. Reuses `aiService` + templates. Rate-limit to the existing AI usage limits.

**Verification:** Tutor generates a 4-week curriculum; usage counts increment per plan. Manual + existing AI tests.

---

## Phase 5 — Org features (depth over new modules)

### 5.1 Branch-comparison analytics rollup (P1)
OrgAnalytics exists (`/api/v1/organizations/:orgId/analytics/*`). Add a branch-comparison view (attendance %, exam pass rate, finance per branch) reusing the existing analytics endpoints + `OrgBranches`. **Backend:** add one aggregate endpoint `GET /analytics/branches` gated by `requireOrgPermission('analytics:view')`.

**Verification:** Org owner sees per-branch table; endpoint returns data only for own org's branches.

### 5.2 Fee payment notifications to parents/guardians (P1)
Org finance + existing guardian module: when a fee invoice is created/confirmed, notify linked guardians via `notifications` + `mail`. **Backend:** hook into billing/finance creation service to emit notifications to guardian users. **Needs a decision** on whether guardian is a separate user or a contact (guardian module currently links students, not auth users — extend the link to a user email).

**Verification:** Invoice created → linked guardian receives notification + email. Integration test.

### 5.3 Schedule conflict detection (P2)
When org schedules are created, flag teacher/room time overlaps. Reuses `OrgSchedules` + class/batch data. **Backend:** validation in schedule creation (reject or warn on overlap).

**Verification:** Creating two schedules for the same teacher/room at the same time → 409 with conflict details.

### 5.4 Teacher self-service (P2)
Teacher's own org dashboard section: assigned classes, attendance entry, materials upload — read-only where `student:manage`/`material:manage` gates apply. Reuses existing per-role permission checks; mostly frontend assembly.

**Verification:** Teacher sees only their classes; cannot touch finance/admin modules (permission-gated).

---

## Phase 6 — Cross-cutting

### 6.1 Notification preferences (P1)
One settings surface (`/dashboard/profile` or existing `DashSettings`) to toggle which events notify (booking confirmed, payment verified, session reminder, new application, new tuition match). **Backend:** persist preferences on the `Setting` model (module exists) + gate notification dispatch on them.

**Verification:** User disables "session reminder" → no reminder notification sent for their account. Integration test.

### 6.2 Bengali i18n for high-traffic surfaces (P2, per project mandate)
Translate Home, Tuitions, Tutors, TutorDetails, Checkout, and the student/tutor dashboard tabs (i18n currently covers navigation only). Uses existing i18next en/bn files.

**Verification:** `lang=bn` shows Bengali on those pages; no missing-key warnings. Manual + `npm run build`.

### 6.3 Empty states for the two weak spots (LOW)
`PlatformOverview` "Quick Actions" paragraph (covered by 2.2) and `OrganizationDetails` "Available Tuitions" placeholder (covered by 1.6). Nothing extra here — tracked in their phases.

---

## Test matrix

| Phase | Level | What it verifies | Command |
|---|---|---|---|
| 1.1 | Backend unit/integration | Anon GET tutor detail → 200 anonymized; owner full | backend `npm test` |
| 1.1 | Frontend build | TutorDetails renders without `ratings` fallback | frontend `npm run build` |
| 1.2 | Backend integration | Tutor POST tuition → 403; student → 201 | backend `npm test` |
| 1.4 | Frontend unit | PaymentHistory endpoint choice from `dbUser.role` | frontend `npm test` |
| 1.7 | Frontend unit | CredibilityBadge no-fabrication cases | frontend `npm test` |
| 2.1 | E2E | Super_admin login → `/super-admin`; `/admin` redirects | `npx playwright test e2e/` |
| 2.2 | Manual + build | PlatformOverview shows real numbers + loading/error states | `npm run build` |
| 3.x–6.x | Per-feature | Listed per feature above | Per feature |

---

## Rollout order (dependency-ordered)

```
Phase 0   Data verification (user runs against prod DB)
Phase 1   Critical fixes (1.1 → 1.7)   → backend + frontend tests → deploy backend (1.1,1.2), then frontend
Phase 2   Admin consolidation + PlatformOverview → frontend tests + build → deploy frontend
Phase 3   Student features (independent of 4/5) → per-feature
Phase 4   Tutor features (4.1 depends on 1.1) → per-feature
Phase 5   Org features → per-feature
Phase 6   Cross-cutting → per-feature
```

**Rules of engagement:**
- Phases 1–2 are pure fixes — implement and verify first; they unblock everything else.
- Phases 3–6 are feature additions. **They are independent** — we can implement them in any order, or trim the list. Flag items marked *needs product decision* (4.3 referral bonus, 5.2 guardian-as-user, 3.4 parent view scope) before building.
- No new heavy dependencies; no new DB collections where an existing module covers it; every feature ships with its Loading/Empty/Error states and is gated server-side.

---

## Pre-deploy checklist

- [ ] Phase 0 counts recorded; fabricated copy updated (1.7 + 0.1)
- [ ] Backend `npm test` green after 1.1, 1.2
- [ ] Frontend `npm run build` + `npm run lint` + `npm test` green after each frontend phase
- [ ] Super_admin smoke: `/super-admin` landing shows real numbers; `/admin` redirects
- [ ] Anonymous smoke: `/tutor/:id` renders; org join button requires sign-in
- [ ] Manual payment smoke unchanged (Checkout without demo flag shows no demo notice)
- [ ] E2E admin spec passes after 2.1
