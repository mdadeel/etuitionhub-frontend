# Role-Capability Implementation — Progress Log

Phase-by-phase status for `docs/audits/role-capability-implementation-plan.md`. Each entry is recorded after the item is **built and verified** (backend `npm test`, frontend `npm run build` / `npm run lint` / `npm test`). Statuses marked `flag` require a product decision before build.

---

## Phase 1 — Critical fixes

### 1.1 Make `GET /api/tutors/:id` public with anonymization — DONE (verified)

- **Backend** (`etuitionhub--backend`): `src/modules/tutor/routes/tutorRoutes.js` — `GET /:id` uses `optionalAuthMiddleware` (line 59), not `authMiddleware`. `getById` already handles absent `req.user` (`req.user?.globalRole` / `req.user?.email?.toLowerCase()` optional chaining) and strips `email`, `mobileNumber`, `verificationDocuments`, `lastLogout`, `passwordHash`, `firebaseUid` for non-owner/non-admin — an anonymous visitor gets the anonymized payload, owner/super_admin get full. Verified in `__tests__/integration/tutor-detail-public.test.js` (5 tests: anon → anonymized 200, owner → full, super_admin → full, 404 for non-tutor id, 404 for nonexistent id).
- **Frontend** (`etuitionhub-frontend`): `src/pages/TutorDetails.jsx` — `tutor.ratings || '4.9'` fallback removed; the only default left is `tutor.ratings || 0` passed to `CredibilityBadge` (an honest "no data" default, not fabricated). Login-gated actions (Message / Request to Hire / Save) unchanged — they still open the login modal for anons.
- **Verification:** backend `npm test` → 53 suites / 395 tests pass (incl. tutor-detail-public); frontend `npm run build`, `npm run lint`, `npm test` → 25 files / 158 tests pass.

### 1.2 Block tutors from posting tuitions server-side — DONE (verified)

- **Backend** (`etuitionhub--backend`): `src/modules/educational/controllers/tuitionController.js` — `POST /api/tuitions` rejects when `req.user.role === 'tutor'` and `req.user.globalRole !== 'super_admin'` → 403 `{ error: 'Tutors cannot post tuitions' }` (matches the client message). Verified in `__tests__/integration/tuition-create-role-guard.test.js` (4 tests: tutor → 403, student → 201, super_admin → 201, anon → 401).
- **Verification:** backend `npm test` → 53 suites / 395 tests pass.

### 1.3 Env-gate the demo-mode notice in Checkout — DONE (verified)

- **Backend** (`etuitionhub--backend`): `config/index.js` reads `PAYMENTS_DEMO_MODE`; `src/modules/config/routes/configRoutes.js` exposes it under `payments.demoMode` in `GET /api/config` (the frontend already fetches `/api/config` — chosen over a `VITE_*` flag per the security rule that `VITE_*` is public-only).
- **Frontend** (`etuitionhub-frontend`): `src/pages/Checkout.jsx` — `getPaymentsDemoMode()` fetches `/api/config`, reads `cfg?.payments?.demoMode`, `.catch(() => false)` (config failure → assume production, no banner). Demo notice renders only when `demoMode && isDemoMethod(...)`. The demo banner was also i18n'd in Phase 6.2 (`checkout.demo_mode` / `checkout.demo_desc`).
- **Verification:** manual (flag off → no demo notice; flag on → shows); frontend `npm run build` passes.

### 1.4 PaymentHistory: derive role from server truth — DONE (verified)

- **Frontend** (`etuitionhub-frontend`): `src/pages/PaymentHistory.jsx` — endpoint choice now uses `dbUser.role` from `useAuth()` (server-sourced), never `localStorage 'etuitionhub_user'`. The endpoint logic was extracted into `src/lib/paymentLedger.js` (`getPaymentsEndpoint(role, email)`) so it's unit-testable in isolation; `PaymentHistory.jsx` imports it. New `src/pages/__tests__/PaymentHistory.test.jsx` (4 tests: tutor → tutor endpoint, non-tutor → student endpoint, missing/null role → student fallback, case-insensitive role).
- **Verification:** frontend `npm test` → 25 files / 158 tests pass (incl. PaymentHistory 4/4); `npm run lint` 0 errors.

### 1.5 Org directory: gate "Request to Join" behind auth — DONE (verified)

- **Frontend** (`etuitionhub-frontend`): `src/pages/OrganizationDirectory.jsx` — when `!user`, the join button is replaced by a "Login to Join" `Link to="/login"` (same pattern as `OrganizationDetails`). No more working-looking join button that 401s on click.
- **Verification:** manual + `npm run build` passes.

### 1.6 Org detail: remove dead placeholder + dead Contact button — DONE (verified)

- **Frontend** (`etuitionhub-frontend`): `src/pages/OrganizationDetails.jsx` — the "This organization has not posted any public tuitions yet." placeholder section is gone (dead section removed). The "Contact" button now renders only when a real `profile.publicEmail || contact.email` exists and opens a `mailto:` on click (was a no-op). Grep confirms no "Available Tuitions"/"has not posted" strings remain.
- **Verification:** manual + `npm run build` passes.

### 1.7 Remove fabricated credibility data — DONE (verified)

- **Frontend** (`etuitionhub-frontend`): `src/components/CredibilityBadge.jsx` — no hardcoded `: 80` response-rate fallback; response rate only renders from real `requestsRespondedCount > 0`; "Verified Profile" only from real `verificationStatus === 'verified_basic'|'verified_premium'`, never a profile-completeness heuristic; rating only when `reviewCount >= 3 && rating`. `src/pages/TuitionDetails.jsx` "Verified" badge renders only when `tuition.status === 'approved'` (real data). `TutorDetails.jsx` ratings fallback covered by 1.1. Verified in `src/components/__tests__/CredibilityBadge.test.jsx` (7 tests: no fabricated rate, accurate rate, verified_basic/premium only, unverified → nothing, missing status → nothing, rating threshold).
- **Verification:** frontend `npm test` → 25 files / 158 tests pass (incl. CredibilityBadge 7/7).

---

## Phase 2 — Admin consolidation + super-admin landing

### 2.1 Collapse `/admin` into `/super-admin` — DONE (verified)

- **Frontend** (`etuitionhub-frontend`): `src/routes/AdminRoutes.jsx` — `/admin/*` is now a thin redirect to `/super-admin` (both route sets guard on the same `globalRole === 'super_admin'`, so one canonical destination). `src/lib/authz.js` — `defaultRouteFor` returns `/super-admin` for `globalRole === 'super_admin'`. All menu items in `src/components/Dashboard/getDashboardMenuItems.js` use `/super-admin/...` (no `/admin/...` menu links remain). The only `/admin` leftovers are the intentional redirect route in `App.jsx` (`path="/admin/*"` → `AdminRoutes`) and a dead breadcrumb branch in `DashboardLayout.jsx` (can never render since `/admin/*` redirects first — noted, not deleted, per the surgical-changes rule). E2E `e2e/admin-approve-payment.spec.js` already targets `/super-admin/*`.
- **Verification:** super_admin lands `/super-admin`; `/admin` redirects via `AdminRoutes`. E2E spec updated to the canonical path.

### 2.2 Build out `PlatformOverview` with real data — DONE (verified)

- **Backend** (`etuitionhub--backend`): `src/modules/search-analytics/services/analyticsService.js` — `getPlatformOverview()` computes all five sections from real collections via parallel `Promise.all` queries (no placeholders):
  - **Money:** `commissionRevenue` = sum of `commissionAmount` on settled payments (`confirmed`/`commission_applied`/`available_for_withdrawal`/`withdrawn`); `pendingPayouts` = sum of `netTutorAmount` on `available_for_withdrawal`.
  - **Growth:** user/tutor/student counts, active tuitions (`isDeleted: false`), applications.
  - **Funnel:** tuitions → applications → confirmed sessions (`scheduled`/`in_progress`/`completed`) → paid (settled payments count).
  - **Queues:** payment verification (`pending_verification`), tutor verification (`pending_review`), moderation (`open`/`investigating` reports), disputes (`open`/`under_review`), withdrawals (`requested`/`processing`).
  - **Activity:** 5 most recent audit logs + 5 most recent signups.
  - Route: `GET /api/analytics/platform-overview` gated by `authMiddleware + adminMiddleware`. Verified in `__tests__/integration/platform-overview.test.js` (4 tests: non-admin 403, anon 401, zero-filled aggregates on empty DB, real seeded data across all sections).
- **Frontend** (`etuitionhub-frontend`): `src/hooks/queries/usePlatformOverview.js` (TanStack Query, `/api/analytics/platform-overview`, 60s stale). `src/components/Dashboard/SuperAdmin/PlatformOverview.jsx` renders Money / Growth / Funnel / Queues / Activity sections with real numbers, each with a Loading skeleton + Error state (with retry) + Empty state. No fabricated numbers — every value derives from the backend aggregate.
- **Verification:** backend `npm test` → 53 suites / 395 tests pass (incl. platform-overview 4/4); frontend `npm run build`, `npm run lint`, `npm test` → 25 files / 158 tests pass.

---

## Phase 3 — Student features

### 3.1 Tutor comparison — DONE (verified)

- **Files:**
  - `src/lib/tutorCompare.js` — pure compare logic (`toggleCompare`, `buildComparisonRows`), `MAX_COMPARE = 3`
  - `src/lib/__tests__/tutorCompare.test.js` — 10 unit tests
  - `src/components/shared/TutorCompareModal.jsx` — side-by-side comparison dialog (navigates to `/tutor/:id`)
  - `src/components/shared/TutorCard.jsx` — optional compare toggle (`isCompared` / `onToggleCompare`)
  - `src/pages/Tutors.jsx` — compare selection state, fixed bottom compare bar, modal wiring
- **Design notes:** frontend-only, reuses existing `GET /api/tutors` list data. Only real tutor fields compared (fee, subjects, location, experience, qualification, verification, rating) — no fabricated response-rate field (none exists in backend).
- **Verification:** `npm test` → 22 files / 122 tests (incl. tutorCompare), `npm run build`, `npm run lint` all pass.

### 3.2 Session calendar + reminders — DONE (verified)

- **Backend** (`etuitionhub--backend`):
  - `src/modules/sessions/models/Session.js` — added `reminderSent: { type: Boolean, default: false }`
  - `src/modules/sessions/services/sessionReminderService.js` — idempotent `sendSessionReminders()`: finds `status: 'scheduled'`, `reminderSent: false`, `scheduledAt` within lead window (env `SESSION_REMINDER_HOURS`, default 1h); creates `session_reminder` notifications for both tutor + student; sends reminder email via existing `mail` module; marks `reminderSent`
  - `src/modules/cron/services/cronJobs.js` — node-cron job every 15 min (long-running mode)
  - `src/modules/cron/routes/cronRoutes.js` — `GET /api/cron/session-reminders` Vercel-cron route (reuses existing cron infra, `x-cron-secret` guarded)
  - `src/modules/notifications/models/Notification.js` — added `'session_reminder'` to `type` enum
  - `src/modules/notifications/controllers/notificationController.js` — added `session_reminder` to the `session` category filter
  - `__tests__/integration/sessionReminders.test.js` — 6 integration tests (both parties notified, idempotency, lead-window gating, cancelled/past excluded, cron route 403 + 200)
- **Frontend** (`etuitionhub-frontend`):
  - `src/lib/sessionCalendar.js` + `src/lib/__tests__/sessionCalendar.test.js` — pure date-grid helpers (`dayKey`, `monthStart`, `monthEnd`, `buildGridDays`, `groupByDay`), 10 unit tests
  - `src/components/Dashboard/SessionCalendar.jsx` — "My Calendar" month grid (42-cell, Sunday start), prev/next/today, session chips in day cells, upcoming-month list, Loading / Empty / Error / Success states, semantic tokens only
  - `src/pages/Dashboard.jsx` — lazy route `path="calendar"` → `<SessionCalendar />`
  - `src/components/Dashboard/getDashboardMenuItems.js` — student menu: `Calendar` under "Learning" group
- **Reminder scheduling:** node-cron (long-running mode) + Vercel cron route (serverless). No new infra — both reuse existing cron + notification + mail modules. **Note:** the Vercel `vercel.json` crons array has NOT been modified; the `/api/cron/session-reminders` route is registered and guarded but needs a `vercel.json` `crons` entry (e.g. `*/15 * * * *`) before the platform will invoke it in production.
- **Pre-existing bug flagged (not fixed — out of scope):** `sessionController.js` calls `createNotification(otherUserId, 'session', ...)` at lines 51/309/360, but `'session'` is **not** in the Notification `type` enum — those notifications silently fail inside `createNotification`'s try/catch. Reminder notifications use `'session_reminder'` (valid), so this bug does not affect 3.2; it should be fixed separately.
- **Verification:** backend `npm test` → 48 suites / 362 tests pass (incl. sessionReminders); frontend `npm run build`, `npm run lint` (0 errors), `npm test` → 22 files / 119 tests pass.

### 3.3 Anonymous interest list → reconcile on signup (P1) — DONE (verified)

Found **already implemented** during the audit-before-edit pass — verified, no new code needed.

- **Storage:** `src/lib/anonBookmarks.js` — localStorage interest list under `etuitionhub_anon_bookmarks` (`{ tutors: [], tuitions: [] }`): `addAnonBookmark` / `removeAnonBookmark` / `hasAnonBookmark` / `getAnonBookmarks` / `clearAnonBookmarks` / `anonBookmarkCount`. 8 unit tests.
- **Migration:** `src/hooks/useAnonBookmarkMigration.js` — runs once per session when both Firebase `user` and `dbUser` are present; POSTs each saved id individually to the existing bookmarks API (`/api/bookmarks/:tutorId`, `/api/bookmarks/tuitions/:tuitionId`); prunes invalid ObjectIds; removes only successfully-POSTed items (failures stay for retry); success toast. 6 hook tests.
- **Wiring:** invoked via `AnonBookmarkMigrationBridge` inside `<AuthProvider>` in `App.jsx` (hook self-guards on `!user || !dbUser`).
- **UI:** anon save toggles already wired in `TutorCard.jsx`, `TuitionCard.jsx`, `TutorDetails.jsx` (localStorage when logged out, server API when logged in, `LoginRequiredModal` prompt).
- **Backend (unchanged, verified):** `bookmarkRoutes.js` `POST /:tutorId` → `add(userId, id, 'tutor')`; `bookmarkTuitionRoutes.js` `POST /:tuitionId` → `add(userId, id, 'tuition')`. `bookmarkService.add` is idempotent (unique index 11000 swallow + `$addToSet`), so re-saving an already-bookmarked item is safe.
- **Acceptance flow traced:** anon saves 2 items → registers → `useAnonBookmarkMigration` POSTs both → `Bookmarks.jsx` fetches `/api/bookmarks` + `/api/bookmarks/tuitions` → both appear in `/dashboard/bookmarks`. ✓
- **Verification:** `npx vitest run` on the two test files → 2 files / 14 tests passing.

### 3.4 Consumer parent/guardian view (P2) — **FLAG (needs product decision)**
Scope decision required before build: which engagements a linked parent may read, and whether `parentEmail`/`guardianOf` is a user-model link (consumer marketplace) vs. reusing org-side `guardian` (different tenancy). See plan §3.4.

---

## Phase 4 — Tutor growth features

### 4.1 Shareable "Book my slot" availability link — DONE (verified)

Tutor publishes availability → public link (`/book/:tutorId`) shows free slots → student request lands in tutor's applications with the selected slot attached.

- **Backend** (`etuitionhub--backend`):
  - `src/modules/tutor/routes/tutorRoutes.js` — `GET /:id/availability` switched from `authMiddleware` → `optionalAuthMiddleware`, making free-slot visibility public so anonymous students can open the booking link.
  - `src/modules/sessions/models/HireRequest.js` — added `preferredSlot: { type: String, maxlength: 60, default: '' }` (optional, backwards-compatible).
  - `src/modules/sessions/controllers/hireRequestController.js` — destructures `preferredSlot` from body, slices to 60 chars, passes to `HireRequest.create`.
- **Frontend** (`etuitionhub-frontend`):
  - `src/lib/slotBooking.js` + `src/lib/__tests__/slotBooking.test.js` — pure helpers: `generateBookingLink`, `formatSlotLabel`, `buildSlotKey`, `groupAvailability` (filters active slots, day labels Sunday-first), `sortByDayOfWeek` (non-mutating). 10 unit tests.
  - `src/components/Dashboard/TutorAvailability.jsx` — **rewritten to fix a broken backend contract** (was sending `{day, startTime, endTime}`, backend expects `dayOfWeek` + `slots[]`; the page did not work against the real API). Now uses `dayOfWeek` (0–6) + `slots: [{startTime, endTime}]` for create/update/delete. Added "Share Booking Link" button (copies `${origin}/book/<tutorId>` to clipboard with 2s "Copied!" state, semantic `success` tokens only).
  - `src/pages/PublicBookingPage.jsx` — public page at `/book/:tutorId`: parallel fetch of tutor + availability, grouped day/slot grid, slot select, message textarea, POSTs `/api/hire-requests` with `{ toUserId, message, preferredSlot, proposedRate }`. Loading skeleton / error+not-found / success states, JSON.NET `$values` fallback handled.
  - `src/App.jsx` — lazy import + route `/book/:tutorId`.
  - `src/components/Dashboard/HireRequests.jsx` — shows `Requested slot: <preferredSlot>` under the request message so tutors see the booked slot in their applications.
- **Verification:** backend `npm test` → 48 suites / 362 tests pass; frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 23 files / 129 tests pass (incl. slotBooking 10/10).
- **Note on anonymous submission:** `POST /api/hire-requests` is auth-guarded (`authMiddleware`); an anonymous student can view free slots and compose a request, but the submit returns 401 until they log in. The page surfaces this ("You will need to log in after sending to track your request") and routes them to register/login on success. Making the submit itself public would require backend changes (the controller reads `req.user.userId`) and is out of scope for 4.1 — flag for a product decision if anonymous booking requests are wanted.

### 4.2 Earnings forecast — DONE (verified)

Tutor dashboard Overview now shows "Projected This Month" (net): confirmed-session payments expected within the current month + pending `billing_generated`/`escrow_hold` payments, minus commission. Pure frontend computation — no backend change.

- **`src/lib/earningsForecast.js`** (new) + **`src/lib/__tests__/earningsForecast.test.js`** (new, 25 tests) — pure projection helpers over the existing `GET /api/payments/tutor/:email` response:
  - `isSessionPayment` — `basis === 'session'` or a `sessionId` present.
  - `isProjectedPayment` — status is `confirmed` (session basis only, per plan) or pending `billing_generated` / `escrow_hold` (any basis).
  - `paymentNetAmount` — prefers `netTutorAmount`, falls back to `grossAmount - commissionAmount`, then `grossAmount`.
  - `paymentMonthDate` — month reference from `billingPeriodStart`, else `createdAt`.
  - `computeProjectedThisMonth(payments, now = new Date())` — sums net amounts of projected payments whose month matches the reference; `now` injectable for tests. Rejects non-array input, malformed entries, and out-of-month payments.
- **`src/components/Dashboard/TutorDashboard.jsx`** — Overview stat grid is now 4 cards (`lg:grid-cols-4`): Total Applications, Active Engagements, **Projected This Month** (net ৳, `toLocaleString`), Total Earnings. Also converted three pre-existing raw color tokens to semantic ones (`emerald-500/10`→`success`, `amber-500/10`→`warning`, `red-600`→`destructive`) since the file was already being edited (semantic-token rule).
- **Verification:** frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 24 files / 154 tests pass (incl. earningsForecast 25/25). No backend change, so backend suite untouched.

### 4.4 Batch AI curriculum export — DONE (verified)

Tutor generates a monthly curriculum (one lesson plan per weekly topic) in a single call. The backend loops the existing lesson-plan generator per topic, so each week consumes its own AI usage token ("usage counts increment per plan") and is rate-limited by the existing tutor-tools limiter (30/hr).

- **Backend** (`etuitionhub--backend`):
  - `src/modules/ai/validators/aiSchema.js` — added `curriculumSchema` (Joi): `subject` (SUPPORTED_SUBJECTS), `grade`, `duration`, `topics` (array of 1–8 strings, each trimmed, 1–200 chars). Exported.
  - `src/modules/ai/services/aiTutorToolsService.js` — added `generateMonthlyCurriculum({ userId, subject, grade, duration, topics })`: trims/dedupes empty topics, then loops the existing `generateLessonPlan` once per topic (each reserves its own budget token + runs the scope guard). Per-topic failures are collected as `failures` (with status code) rather than failing the batch; if every topic fails the first error is rethrown with its status code. Returns `{ templateType:'curriculum', title, subject, grade, duration, weeks:[{week,topic,plan}], failures, meta }`.
  - `src/modules/ai/controllers/aiController.js` — added `curriculum` handler (delegates to `tutorToolsService.generateMonthlyCurriculum`), exported.
  - `src/modules/ai/routes/aiRoutes.js` — added `POST /api/ai/tutor/curriculum` with the same middleware stack as lesson-plan/assignment: `aiTutorToolsLimiter` (30/hr), `authMiddleware`, `tutorMiddleware`, `promptInjectionGuardrail`, `validateCurriculumBody`.
  - `__tests__/unit/aiTutorTools.test.js` — new unit test file (7 tests): loops once per topic, usage increments per plan, trims/drops empty topics, 400 on empty topics, partial failures collected, all-fail rethrows, per-week plan meta preserved.
- **Frontend** (`etuitionhub-frontend`):
  - `src/services/aiService.js` — added `generateMonthlyCurriculum({ subject, grade, duration, topics })` → POST `/api/ai/tutor/curriculum`.
  - `src/components/AiAssistant/CurriculumCard.jsx` (new) — renders the combined export: header (subject · grade · duration · week count), one `LessonPlanCard` per week, and a per-week failures notice. Reuses the existing lesson-plan card (no near-duplicate renderer).
  - `src/pages/AiAssistant/AiAssistantTutorTools.jsx` — added a third tab **Curriculum** (`CalendarRange`): weekly-topic input list (default 4 weeks, add/remove up to `MAX_WEEKS = 8`, mirrors backend 1–8), grade + duration selectors, calls `generateMonthlyCurriculum` (filters empty topics), renders `CurriculumCard` in the output card. Save-note/copy-JSON toolbar works on the combined output (grade included for curriculum). Loading skeleton reuses `LessonPlanSkeleton` (batch of lesson plans).
- **Verification:** backend `npm test` → 49 suites / 369 tests pass (incl. aiTutorTools 7/7); frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 24 files / 154 tests pass.


## Phase 5 — Organization power features

### 5.1 Branch-comparison analytics rollup (P1) — DONE (verified)

OrgAnalytics now shows a per-branch comparison (attendance %, exam pass rate, revenue) alongside the existing dashboard stats. Backend aggregates through `OrgMembership.branchId` (the only record in the org module that carries a branch) — no academic/finance model has a direct branch link.

- **Backend** (`etuitionhub--backend`):
  - `src/modules/organizations/services/branchAnalyticsService.js` (new) — `getBranchAnalytics({ orgId, startDate, endDate })`: resolves the org's **active** student memberships (whitelist for every join), then rolls up per active branch:
    - Attendance % — `Attendance.records[].studentId → membership.branchId` (present / present+absent+late).
    - Exam pass rate — published `Result.studentId → membership.branchId` (isPassed / total).
    - Finance — paid `Invoice.studentId → membership.branchId` (`paidAmount` sum + invoice count).
    - **Flag (data model):** `Expense` and `Salary` carry no branch/student linkage, so per-branch finance is **paid-student-invoice revenue only**. Expenses are org-wide; salaries are linked to staff memberships with no branch join. Documented in the response shape (`finance.revenue`) and here.
    - Members without a branch roll into an `unassigned` bucket (`branchId: null` matches both explicit null and missing field); inactive branches are excluded.
  - `src/modules/organizations/controllers/analyticsController.js` — added `getBranchAnalytics` (delegates to the service, same shape as sibling endpoints).
  - `src/modules/organizations/routes/organizationRoutes.js` — `GET /:orgId/analytics/branches` gated by `requireOrgPermission('analytics:view')` (owner bypass included).
  - `__tests__/integration/orgBranchAnalytics.test.js` (new, 5 tests) — owner sees correct per-branch attendance/pass-rate/revenue + unassigned bucket; no cross-org branch leak; non-member → 403; role without `analytics:view` → 403; zeroed rows for an active-but-empty branch.
- **Frontend** (`etuitionhub-frontend`):
  - `src/components/Dashboard/Organization/OrgAnalytics.jsx` — added **Branch Comparison** card (fetch `/analytics/branches`): table of branch / students / attendance% (success/warning/destructive thresholds) / pass rate / revenue; `unassigned` section; Loading spinner + Error + Empty states; semantic tokens only. Also converted the file's pre-existing raw color classes (`text-blue-500`, `text-green-500`, `text-cyan-500`, `text-orange-500`, `text-emerald-500`, `text-green-600`, `text-red-600`) to semantic tokens (`success`/`warning`/`destructive`/`primary`) since the file was being edited.
- **Verification:** backend `npm test` → 50 suites / 374 tests pass (incl. orgBranchAnalytics 5/5); frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 24 files / 154 tests pass.

### 5.3 Schedule conflict detection (P2) — DONE

**Plan §5.3:** "When org schedules are created, flag teacher/room time overlaps. Reuses `OrgSchedules` + class/batch data. **Backend:** validation in schedule creation (reject or warn on overlap). **Verification:** Creating two schedules for the same teacher/room at the same time → 409 with conflict details."

- **Backend** (`etuitionhub--backend`):
  - `src/modules/organizations/controllers/scheduleController.js` — extended `checkConflicts(orgId, tutorId, dayOfWeek, startTime, endTime, room, excludeId)` to flag **both** teacher and room overlaps. It matches `status:'active'` schedules on the same day with `$or: [{tutorId}, ...(room ? [{room}] : [])]`, and on time overlap (`startTime < s.endTime && endTime > s.startTime`) classifies the conflict as `type: 'tutor'` (same membership) or `'room'` (same room, different tutor). 409 responses now carry `{ error, conflictType: 'tutor'|'room', conflict: existingSchedule }`. Wired into `createSchedule` (with `room`), `updateSchedule` (re-checks when tutor/day/time/room changes, excluding self), and `assignSubstitute` (verifies substitute availability, excluding the schedule being substituted; error prefixed `Substitute tutor is unavailable:`).
  - `__tests__/integration/scheduleConflict.test.js` (new, 7 tests) — non-conflicting create 201; same-tutor overlap → 409 `conflictType:'tutor'` + `error` contains `Tutor is already scheduled` + `conflict` truthy; same-room different-tutor overlap → 409 `conflictType:'room'`; same tutor at adjacent slot and same room at adjacent slot both 201; update that would create a tutor overlap → 409; substitute tutor already booked → 409 `unavailable`; same room on a different day → 201.
- **Frontend** (`etuitionhub-frontend`):
  - `src/components/Dashboard/Organization/OrgSchedule.jsx` — **no change needed.** The schedule create/update handlers already surface `err.response?.data?.error` via `react-hot-toast`, so the enriched 409 message (`Tutor is already scheduled from 09:00 to 10:00` / `Room "Room 1" is already booked from ...`) reaches the user as-is.
- **Verification:** backend `npm test` → 51 suites / 381 tests pass (incl. scheduleConflict 7/7). Frontend untouched by this phase.

### 5.2 Fee payment notifications to guardians (P1) — DONE

**Plan §5.2:** "when a fee invoice is created/confirmed, notify linked guardians via `notifications` + `mail`. **Backend:** hook into billing/finance creation service to emit notifications to guardian users."

**Decision resolved (plan flagged *needs product decision*):** the Guardian model already carries a **required `userId` ref to `User`** plus `email` and a `canReceiveNotifications` opt-out — guardians were already linked to auth users, not bare contacts. So the notification target is `guardian.userId` (in-app notification) with `guardian.email` as the mail channel; no "extend the link to a user email" change was needed. Per-branch/tutor-marketplace payments (Payment model) are untouched — this hooks the org **Invoice** flow only.

- **Backend** (`etuitionhub--backend`):
  - `src/modules/organizations/services/invoiceNotificationService.js` (new) — `notifyGuardiansOfInvoice({ orgId, studentId, event, invoice })` resolves active `GuardianStudent` links for the invoice's student membership, follows only `status:'active'` links, skips guardians with `canReceiveNotifications === false`, then `createNotification(userId, 'payment', title, message, /dashboard/org/:orgId/billing)` + `sendEmail(guardian.email, ...)`. `event:'created'` → "New Fee Invoice" (issued, due date); `event:'paid'` → "Payment Received". Email built inline (no new template plumbing), reusing the existing mail module.
  - `src/modules/organizations/controllers/financeController.js` — `createInvoice` awaits `notifyGuardiansOfInvoice(event:'created')` after the audit log; `updateInvoice` captures `previousStatus` and fires `event:'paid'` only on a `sent/partially_paid → paid` transition (no re-notify on already-paid updates). Both are awaited so tests are deterministic (createNotification/sendEmail already swallow their own errors).
  - `__tests__/integration/invoiceGuardianNotification.test.js` (new, 6 tests) — invoice created → linked guardian gets 1 `type:'payment'` Notification + email to `guardian.email`; opt-out guardian skipped; no links → nothing; `pending` link → nothing; marking paid emits a second "Payment Received" notification; re-saving an already-paid invoice adds no new notification.
- **Frontend** (`etuitionhub-frontend`): **no change needed.** Notification bell already renders in-app notifications; email is server-side.
- **Verification:** backend `npm test` → 52 suites / 387 tests pass (incl. invoiceGuardianNotification 6/6).

### 5.4 Teacher self-service (P2) — DONE

**Plan §5.4:** "Teacher's own org dashboard section: assigned classes, attendance entry, materials upload — read-only where `student:manage`/`material:manage` gates apply. Reuses existing per-role permission checks; mostly frontend assembly. **Verification:** Teacher sees only their classes; cannot touch finance/admin modules (permission-gated)."

**Audit outcome:** the backend already enforced teacher self-service correctly — teacher `ROLE_TEMPLATE` (raw perms, so frontend `hasPermission` reads them) grants `class:view`, `attendance:mark`/`attendance:view`, `material:view`/`material:upload`, `assignment:view`/`assignment:create`/`assignment:grade`, `student:view`, `announcement:view`/`announcement:create`, `message:view`/`message:send` — and every org route is gated server-side (`GET /classes`→`class:view`, `POST /attendance`→`attendance:mark`, `POST /materials`→`material:upload`, etc.), with ABAC class-scoping (`getScopedClassIds`/`isTeacherAssignedToClass`/`applyClassScopeFilter`) limiting classes/attendance/materials/assignments to the teacher's assigned classes. Finance (`billing:read`), roles (`role:view`), analytics (`analytics:view`), settings (`settings:manage`), salaries/expenses are all behind permissions teachers lack. So **no backend changes were needed.**

- **Frontend** (`etuitionhub-frontend`):
  - `src/components/Dashboard/getDashboardMenuItems.js` — the sidebar "Classes" entry was gated on `class:manage`, which hid the teacher's own classes from the nav even though the route (`class:view`) and ABAC scope allowed it. Split the block: **Classes** now shows for `class:view || class:manage` (teachers get a nav entry to their assigned classes); **Academic Years** and **Batches** stay behind `class:manage`.
  - `src/components/Dashboard/Organization/OrgClasses.jsx` — "Create Class" / "Create First Class" / "Manage Class" buttons now render only when `hasPermission('class:manage')` (teacher view is read-only); the empty-state and page-subtitle copy adapt for a teacher who is not a manager.
  - `src/components/Dashboard/Organization/OrgAttendance.jsx` — "Mark Attendance" button now renders only when `hasPermission('attendance:mark')` (viewers keep the read-only report).
  - `src/components/Dashboard/Organization/OrgMaterials.jsx` — "Upload Material" / "Upload First Material" buttons now render only when `hasPermission('material:upload')`.
  - `src/components/Dashboard/Organization/OrgAssignments.jsx` — "Create Assignment" / "Create First Assignment" and per-row "Grade" buttons now render only under `assignment:create` / `assignment:grade`; "Submissions" stays view-only.
  - `src/components/Dashboard/Organization/OrgHome.jsx` — made the org overview permission-aware so a teacher landing page is not built on a 403'd `/members` fetch: `member:view` gates the members fetch + Members/Teachers stat cards + Members quick link; `student:view` gates the Students card; `tuition:view` gates the Tuitions card/link + tuitions fetch; `settings:manage` gates the Settings quick link.
- **Verification:** frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 24 files / 154 tests pass; backend `npm test` → 52 suites / 387 tests pass (unchanged — no backend edits).


### 6.1 Notification preferences (P1) — DONE

**Plan §6.1:** "One settings surface (`/dashboard/profile` or existing `DashSettings`) to toggle which events notify (booking confirmed, payment verified, session reminder, new application, new tuition match). **Backend:** persist preferences on the `Setting` model (module exists) + gate notification dispatch on them. Verification: User disables 'session reminder' → no reminder notification sent for their account. Integration test."

**Flagged plan-deviation (storage):** the plan's stated storage — the global `Setting` model — **cannot hold per-user preferences**: `Setting` is a platform-wide key-value store with no `userId` and its values feed the admin `DashSettings` page, so per-user prefs would leak across accounts and pollute the platform settings UI. The plan's *intent* is preserved exactly (persist per-user prefs, gate dispatch, one toggle surface); only the storage moves to the `User` model, which already carries per-user preferences (`languagePreference`). This is a technical storage decision, not a product change.

- **Backend** (`etuitionhub--backend`):
  - `src/modules/auth/models/User.js` — added `notificationPreferences` subdocument with five booleans (`booking_confirmed`, `payment_verified`, `session_reminder`, `new_application`, `new_tuition_match`), each default `true`. Legacy users without the field default to enabled (`absent === true`).
  - `src/modules/notifications/services/notificationService.js` — `createNotification` is the single dispatch choke point (~40 call sites). Added `NOTIFICATION_PREFERENCE_MAP` (notification `type` → preference key: `booking`→booking_confirmed; `payment`/`trx_verified`→payment_verified; `session_reminder`→session_reminder; `application`/`hire_request_received`→new_application; `tutoring_scheduled`/`tutoring_accepted`→new_tuition_match). Non-gateable types (message, system, admin, verification, announcement, …) dispatch with **zero** extra queries. Gateable types do a lean `User.findById(userId, 'notificationPreferences')` and return `null` (suppressed) when the pref is `=== false`. Lookup failures **fail open** — a notification is never dropped because the pref read errored. Exports `isSuppressed` + `NOTIFICATION_PREFERENCE_KEYS` for tests.
  - `src/modules/users/services/userService.js` — added `notificationPreferences` to `USER_ALLOWED_UPDATE_FIELDS`; `updateUser` and `updateUserByEmail` now **merge** a partial pref update into the existing subdocument so toggling one event can't silently re-enable the others.
  - `src/modules/users/validators/userSchema.js` — `notificationPreferences` added to `updateUserSchema` as a strict 5-key boolean object; the shared `validate` wrapper's `allowUnknown:false` rejects unknown pref keys and non-boolean values with 400.
  - `src/modules/users/controllers/userController.js` + `routes/userRoutes.js` — added `GET /api/users/me/notification-preferences` (own prefs, auth-required; safe from `/:email` shadowing — two segments vs one).
  - `__tests__/integration/notificationPreferences.test.js` (new, 8 tests) — **plan verification:** student disables `session_reminder` → `sendSessionReminders` writes only the tutor's reminder (student gets none) while `reminderSent` still advances; legacy user (field `$unset`) still reminded; disabling one event doesn't gate `application`/`hire_request_received`; `isSuppressed` returns `false` for unknown types and missing users (fail-open, no throw); `GET /me/notification-preferences` returns own prefs and 401s unauthenticated; `PATCH /by-email` merges partial updates without resetting earlier toggles; unknown keys and non-boolean values → 400.
- **Frontend** (`etuitionhub-frontend`):
  - `src/components/Dashboard/NotificationPreferences.jsx` (new) — reusable card (semantic tokens, lucide `Bell`, no new icon set) with five accessible toggles (`role="switch"` + `aria-checked`, focus ring, 150ms transition). Loads prefs from `GET /me/notification-preferences`, PATCHes partial updates via the existing `PATCH /by-email/:email`, optimistic update with rollback on failure. Loading → skeleton rows; Error → message + Retry; Success → check flash on the toggled row.
  - `src/components/Dashboard/Profile.jsx` — renders `<NotificationPreferences />` in both the tutor (Professional Profile) and non-tutor (Account Settings) branches — one canonical surface at `/dashboard/profile`.
- **Verification:** backend `npm test` → **53 suites / 395 tests pass** (387 prior + 8 new, no regressions); frontend `npm run build` (passes), `npm run lint` (0 errors), `npm test` → 24 files / 154 tests pass.

### 6.2 Bengali i18n — Home, Tuitions, Tutors, TutorDetails, Checkout + dashboards — DONE (verified)

**Plan §6.2:** "Translate Home, Tuitions, Tutors, TutorDetails, Checkout, and the student/tutor dashboard tabs (i18n currently covers navigation only)." Uses the existing i18next en/bn files.

- **`src/locales/en.json` + `src/locales/bn.json`** — added four new top-level sections under the single `translation` namespace:
  - `home.*` — hero, features, how-it-works, stats, CTA, footer-band strings (previously hardcoded English).
  - `tuitions.*` — page title/subtitle, filters (subject/class/location/availability), sort, salary display (`"{{count}}৳/month"`), empty/error/loading states, bookmark + interest-list actions, load-more.
  - `tutors.*` — page title/subtitle, filters sidebar (location, subjects, fee range, sort, verified-only), compare bar (`compare_selected` / `compare_selected_plural` using i18next's `_plural` suffix, same convention as existing `verified_reviews`), tutor-card copy, searching-for, load-more/no-more.
  - `tutorDetails.*` — SEO title/description, stats, subjects/availability, About (`about_p1` with `name`/`subjects`/`experience`/`location` interpolation, `about_p2` with `firstName`), Reviews (count plural), Similar Tutors, Message/Hire/Status modals, LoginRequired save prompt, all toast strings.
  - `checkout.*` — header/subtitle, form labels + placeholders, submit button, summary sidebar (yield/reference/total/monthly/verification protocol), demo banner, error + success toasts.
  - `student.*` — StudentDashboard: AppleHeader (hello with `name`), tab labels, overview stat cards, My Jobs / Applications / Booked DataTables (columns, badges, empty states, action buttons), all fetch/toast/confirm strings.
  - `tutorDashboard.*` — TutorDashboard: AppleHeader, tab labels, overview stat cards, Recent Activity, Applications DataTable (Recall/Locked), ongoing engagements (Active Connection, Student Email, Monthly Fee, Send Message), Earnings report + DataTable, all fetch/toast/confirm strings.
- **`src/pages/Home.jsx`** — full render string + CTA action wiring translated.
- **`src/pages/Tuitions.jsx`** — full wiring (incl. filters, sort, salary, empty/error states, bookmark actions).
- **`src/pages/Tutors.jsx`** — full wiring (incl. compare bar, filter sidebar). **Fixed a pre-existing missing import:** the compare bar used `<Button>` with no `Button` import — added `import { Button } from "@/components/ui/button"` (would have failed the build otherwise).
- **`src/pages/TutorDetails.jsx`** — full wiring (incl. interpolated About paragraphs, SEO, modals, Reviews count).
- **`src/pages/Checkout.jsx`** — full wiring; `PAYMENT_METHODS` const stays module-level, `badge: 'Manual'` translated at render via `t('checkout.manual_badge')`; brand names (bKash/Nagad/Rocket/Bank) kept as-is.
- **`src/components/Dashboard/StudentDashboard.jsx`** — full wiring. `tabs` const converted to key-labels (`label: "overview"`, …) translated at render via `` t(`student.tab_${tab.label}`) ``; `useCallback` deps updated to include `t` (stable across renders — resolves the 3 new `exhaustive-deps` warnings my edits introduced).
- **`src/components/Dashboard/TutorDashboard.jsx`** — full wiring (same key-label + `t`-in-deps pattern as StudentDashboard; 2 warnings resolved).
- **Convention notes:** const arrays (`tabs`, `PAYMENT_METHODS`) stay module-level with key strings, translated at render. Status values shown raw (backend enum) — only UI chrome translates. Currency `৳` and brand names untranslated. Pluralization uses i18next's default `_plural` suffix (existing convention).
- **Verification:** `npm run build` (passes), `npm run lint` (0 errors, 0 warnings), `npm test` → 24 files / 154 tests pass.
- **Remaining i18n scope (out of this phase):** organization screens, tutor/student profile tabs beyond the dashboards, AI Assistant, and remaining routes still use hardcoded English — see NEXT TASK in project CLAUDE.md.
