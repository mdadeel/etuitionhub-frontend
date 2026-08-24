# Role & Capability Audit — What Each Role Can See, Control, and Should Get Next

**Status:** Audit (no code changed)
**Date:** 2026-08-24
**Scope:** Role-based dashboards + all home/public pages. What each role can see/control, what the project currently offers vs. what it *should* offer, and concrete "more you can offer" recommendations.
**Method:** Static code audit of `etuitionhub-frontend` (routes, guards, menus, dashboard pages) + `etuitionhub--backend` (server.js route table, rbac.js, auth middleware, per-module route gating). Not a live-app walkthrough — findings were verified against code, not clicks.

---

## 1. The role model (how roles actually work)

The project has **three independent role axes**, which is the single most important thing to understand before judging "what users can see":

| Axis | Field | Values | Canonical? | Where enforced |
|---|---|---|---|---|
| **Platform role** | `user.role` | `student` \| `tutor` \| `admin` (vestigial) | ❌ Legacy; `admin` is documented as vestigial in `User.js` | `tutorMiddleware`, `studentMiddleware` (super_admin bypasses) |
| **Global role** | `user.globalRole` | `user` \| `super_admin` | ✅ Canonical admin signal | `superAdminMiddleware`, `adminMiddleware`, `requireGlobalRole` |
| **Org role** | `OrgMembership.roleId.slug` | `owner` \| `admin` \| `coordinator` \| `teacher` \| `student` | ✅ For org-scoped work | `requireOrgPermission`, `requireOrgAnyPermission` |

**Key consequence:** a single user can be a **Student on the platform, a super_admin globally, AND an org admin/teacher/student inside one or more coaching centers** — all at once. The frontend switches between these contexts via `orgContext` + `switchOrg`. The audit below treats each context separately.

**Frontend guard layer (who gets which page):**
- `PublicRoute` — wraps `/login`, `/register`, `/password-reset`, `/reset-password`, `/admin-login`. Silently redirects a signed-in user away (this was the admin-login bug — already fixed in a prior phase).
- `PrivateRoute` — wraps `/dashboard/*`, `/checkout/:id`, `/session/:id`, `/payment-success`, `/payment-history`, `/ai-assistant/*`. Requires Firebase `user`; no role check (any signed-in user).
- `AdminRoute` / `AdminRoutes` / `SuperAdminRoutes` — all gate on `dbUser.globalRole === 'super_admin'`, else `/403`. **A legacy `role:'admin'` user is NOT a super_admin and will get `/403`** unless the `promote-legacy-admins.js` seed ran.

---

## 2. Public / home pages — what each role sees

All routes below are public (no guard) unless noted. **Auth-gated sub-behaviors** are what change by role.

### 2.1 `/` Home
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Browse hero/categories/tutors/why-us/stats/FAQ/CTA | ✅ | ✅ | ✅ | ✅ |
| Bookmark/Request/Message a featured tutor | ➖ login prompt | ✅ | ✅ | ✅ |
| **Post-a-tuition CTA block** (tutor-specific banner) | ✅ shown | ✅ shown | ❌ hidden (`!user`) | ✅ shown |

**Findings:**
- ⚠️ **Fabricated marketing numbers** (anti-vibe "real data only" violation): `Home.jsx:25` SEO description claims *"Browse 2,500+ tutors"* and `Home.jsx:75` *"Join 2,500+ verified tutors across Bangladesh."* If the real tutor count is different, these are false claims. **Verify against production DB.**
- ⚠️ The tutor CTA is hidden for logged-in users regardless of role — a student who is *also* a tutor (they're the same person) never sees it. Minor.

### 2.2 `/tuitions` (public listing) + `/tuition/:id` (public detail)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Browse approved tuitions, filter by class/location/subject/salary | ✅ | ✅ | ✅ | ✅ |
| Bookmark a tuition (only when `user`) | ➖ | ✅ | ✅ | ✅ |
| **Express Interest** (apply) — `TuitionDetails` | ➖ | ❌ no button (student is the poster) | ✅ Dialog + `POST /api/applications` | ✅ |
| **Reach Out to Student** — `TuitionDetails` | ➖ | ❌ | ✅ `POST /api/hire-requests` | ✅ |

**Findings:**
- ✅ Correct: tutors apply to tuitions, students post them, and the roles are cleanly separated in the UI.
- ⚠️ **Students cannot "save an interest" in a tuition** — they can bookmark, but there is no "save this job for later / apply later" flow for the student side (students are posters, not applicants, so this is fine; see recommendations).
- ⚠️ **Hardcoded "Verified" badge + "payment is secured" copy** on `TuitionDetails` (from prior audit) — real-data violation if the tuition isn't actually verified.

### 2.3 `/tutors` + `/tutors/:city` (public) + `/tutor/:id` (public detail)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Browse/search/filter tutors | ✅ | ✅ | ✅ | ✅ |
| Save search alert | ✅ | ✅ | ✅ | ✅ |
| Bookmark tutor | ➖ | ✅ | ✅ | ✅ |
| **Message tutor** (`TutorDetails`) | ➖ login modal | ✅ Chat | ✅ Chat | ✅ |
| **Request to Hire** (`TutorDetails`) | ➖ login modal | ✅ `POST /api/hire-requests` | ✅ | ✅ |
| **Review tutor** (`canReview` = completed booking) | ➖ | ✅ | ✅ (own booking) | ✅ |
| View full profile (email/phone/verification docs) | ❌ **401** | ❌ **401** (unless owner/admin) | ✅ own / ❌ others | ✅ |

**Findings:**
- ⚠️ **⚠️ CRITICAL UX/SEO asymmetry (likely bug):** `GET /api/tutors/:id` is **auth-gated server-side** (`tutorRoutes.js:56` `authMiddleware`), but the frontend `/tutor/:id` route is **public** and renders the page for anonymous users. So an anonymous visitor (or a search engine) hitting `/tutor/:id` gets `401 → "Profile Not Found"`. This is exactly the same class of bug as the tuition-public/tutor-private mismatch. **Fix options:** make `GET /api/tutors/:id` public with PII anonymization for non-owner/non-admin (the controller already strips `email`/`mobileNumber`/`verificationDocuments`/etc. for non-owners), OR gate the frontend route behind `PrivateRoute`. Given SEO value (tutors are the marketplace's supply side), **making it public-with-anonymization is the right call** — the backend is already half-ready.
- ⚠️ **Fabricated rating fallback:** `TutorDetails` shows `tutor.ratings || '4.9'` — hardcoded 4.9 when no real rating exists. Real-data violation.
- ⚠️ **`ratings` field:** confirmed the controller anonymizes sensitive fields but the **anonymized payload includes no ratings/statistics** for anon users, so the public profile (if made public) would render without any rating/review data.

### 2.4 `/post-tuition` (public route, auth-required behavior)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| View form | ✅ (sees login wall) | ✅ | ❌ **blocked with toast** "Tutors cannot post tuitions. Switch to student mode or use a student account." | ✅ |

**Findings:**
- ✅ Correct enforcement. The guard is client-side (`role === 'tutor'`), but the **backend `POST /api/tuitions` does NOT block tutors** — it just stamps `student_email = req.user.email`. So a tutor can post a tuition by calling the API directly. **Server-side gap:** a tutor posting a tuition creates a "student-owned" tuition record that the student dashboard's `getByStudent` will list under their own email. Should be explicitly forbidden server-side (or allowed as "I'm a tutor also wanting a tutor" — but that's ambiguous). **Recommendation:** add `studentMiddleware`-style check to `POST /api/tuitions` OR allow it deliberately and reflect it in the tutor dashboard.

### 2.5 `/become-tutor` (public route, auth-required behavior)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Start tutor onboarding | ➖ login wall | ✅ two-step form → `PATCH /api/users/by-email/:email` role→`tutor` | ❌ toast + redirect `/dashboard/my-profile` | ✅ |

- ✅ Correct: one-way student→tutor promotion, blocked for existing tutors. No tutor→student demotion (deliberate).

### 2.6 `/checkout/:id` (PrivateRoute, student-only)
| Capability | Student | Tutor | Super Admin |
|---|---|---|---|
| Pay a manual bKash/Nagad/Rocket/Bank for an application | ✅ | ❌ `role==='tutor'` → Navigate `/dashboard` | ✅ |
| **Demo mode auto-verify** | ⚠️ sees "Demo Mode — Transactions will be auto-verified for testing purposes" | ❌ | ✅ |

**Findings:**
- ⚠️ The **demo-mode auto-verification notice is surfaced to real users** — in production this line should be env-gated (only show when `VITE_*`/config says demo). Otherwise users may believe their payment is auto-confirmed and it isn't (or worse, it is).
- ⚠️ No payment gateway (deliberate, manual + admin verify), but the checkout UX has no way to **upload the bKash/Nagad transaction ID/trxID inline** — the user must submit the manual payment then presumably provide trx separately. Verify the actual flow (`submitManual` vs `submit-trx`).

### 2.7 `/organizations` (public directory) + `/organizations/:slug` (public detail)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Browse orgs, view detail | ✅ | ✅ | ✅ | ✅ |
| **Request to Join** | ❌ (button shows but `handleJoinRequest` toasts "sign in first") | ✅ `POST join-request` | ✅ | ✅ |
| Withdraw pending join request | ➖ | ✅ | ✅ | ✅ |
| See "My Organizations" + **Open Dashboard** | ➖ | ✅ (if member) | ✅ (if member) | ✅ |
| Leave an org | ➖ | ✅ | ✅ | ✅ |

**Findings:**
- ⚠️ **Anonymous users see a "Request to Join" button** that fails on click with a toast. Minor UX: gate the button behind `user`, like other pages do.
- ⚠️ **`OrganizationDetails` "Available Tuitions" tab is a dead placeholder** — always shows "This organization has not posted any public tuitions yet." No real data. Either wire it to real org tuitions or remove.
- ⚠️ The **"Contact" button** on `OrganizationDetails` does nothing visible (no onClick handler). Dead button.

### 2.8 `/search` (public)
| Capability | Anonymous | Student | Tutor | Super Admin |
|---|---|---|---|---|
| Search tutors + approved tuitions | ✅ | ✅ | ✅ | ✅ |
| Save search (SaveSearchButton) | ✅ | ✅ | ✅ | ✅ |

- ⚠️ Note: tutor search hits `/api/tutors/search` which is **public** (from `tutorRoutes.js` — `GET /` and `/search` are public), but the **detail endpoint is auth-gated** (see 2.3). So search results render but clicking a result → 401. Consistent with the CRITICAL finding above.

### 2.9 `/about`, `/contact`, `/blog`, `/docs/engineering`, `/403`, `*` (NotFound)
- Public, informational, no role differences. Contact form is public (`POST /api/contact`). No findings.

### 2.10 `/ai-assistant/*` (PrivateRoute — any signed-in user)
| Page | Student | Tutor | Super Admin |
|---|---|---|---|
| Chat / Quiz / History / Saved-notes / Settings | ✅ | ✅ | ✅ |
| **Lesson Planner / Assignment (Tutor Tools)** | ❌ server 403 + client lock banner | ✅ | ✅ (`isTutor = userRole==='tutor' \|\| 'admin'` — super_admin sees it) |

**Findings:**
- ⚠️ `AiAssistantTutorTools.jsx` sets `isTutor = userRole === 'tutor' || userRole === 'admin'` — **super_admin with `role:'student'` sees the lock banner in the UI but the API would allow them** (super_admin bypasses `tutorMiddleware`). Minor inconsistency; harmless since super_admin should have everything. But the UI could simply unlock for super_admin too.
- ⚠️ The tutor-tools page says "The form will still work in this preview, but the API will return a 403" — deliberate preview pattern; fine.
- ✅ AI is correctly gated server-side: `/ai/tutor/lesson-plan` + `/ai/tutor/assignment` use `tutorMiddleware`; everything else is `authMiddleware` only.

### 2.11 `/payment-history` (PrivateRoute)
- Student ↔ tutor endpoint chosen client-side from `localStorage 'etuitionhub_user'.role`. **⚠️ Uses a client-supplied role to pick the endpoint** (`/api/payments/tutor/:email` vs `/student/:email`). The backend `assertEmailMatchesParam('email')` still protects cross-user access (email must match the caller), but the *role choice* is client-authoritative — if a user's role is stale in localStorage they'd see the wrong ledger. **Recommendation:** derive from `dbUser.role` (server truth) instead of localStorage.

---

## 3. Dashboards — what each role can see & control

### 3.1 `/dashboard` hub (`Dashboard.jsx`)
Route dispatch (all inside `PrivateRoute`):
- `globalRole==='super_admin'` → `/super-admin`
- has `orgContext` → `/dashboard/org/:orgId/...` (OrgDashboardLayout)
- legacy `role==='admin'` → `/admin` (→ 403 unless super_admin — see finding)
- `role==='tutor'` → `TutorDashboard`
- else → `StudentDashboard`

Sub-routes are **role-gated by component** (wrong role → `<Navigate to="/dashboard">`):
- Profile (all), Sessions/Billing/Bookmarks/Verification/Wallet/Withdraw/SessionConfirmations (tutor vs student), Templates (student → redirect), Disputes/Assignments/Notifications/Requests (all), `my-profile` → redirect to profile.

### 3.2 Student dashboard (`StudentDashboard.jsx`)
Tabs: **Overview, Post Job, My Requests, Applications, Engagements, Payments, Assignments.**
- Approve application → navigate `/checkout/:id`; reject via PATCH; delete own tuition; "Join Room" for accepted bookings.
- **Correct offerings:** post/delete tuition, see applications, approve → pay, track engagements, assignments.
- **Gaps (things to offer more):** see §5.

### 3.3 Tutor dashboard (`TutorDashboard.jsx`)
Tabs: **Overview, Applications, My Engagements/Sessions, Availability, Verification, Wallet, Withdraw, Templates.**
- Fetches `/api/applications/tutor/:email` + `/api/payments/tutor/:email`. Sets availability, verification flow, wallet + withdrawal, lesson templates, assignments.
- **Correct offerings:** apply→manage applications, sessions, availability calendar, verification, wallet/withdraw (manual payments), AI lesson templates.
- **Gaps:** see §5.

### 3.4 Admin dashboard — `/admin` (`AdminRoutes`) vs `/super-admin` (`SuperAdminRoutes`)
Both guard `globalRole === 'super_admin'`.

`AdminDashboard` tabs (legacy single-page tabs): **Overview(Analytics), Payments, Users, Tutors, Tuitions, Verifications, Moderation, Disputes, Settings.**
`SuperAdmin` menu items (`getDashboardMenuItems.js`): Overview (`PlatformOverview`), Organizations, Org Requests, Users, Analytics, Tutors, Tuitions, Verifications, Subscriptions, Audit Logs, Settings + (org-independent) `/admin/withdrawals`, `/admin/payments`, `/admin/contacts`, `/super-admin/audit-logs`, `/dashboard/disputes`.

**Findings:**
- ⚠️ **`PlatformOverview` (the super-admin landing page) is extremely thin** — only two stat cards (orgs, users) + a "Quick Actions" paragraph. For the platform owner this is the highest-value screen and it's the weakest page in the app. **This is the #1 "offer more" candidate** — see §5.
- ⚠️ **Legacy `/admin` route confusion:** the `/admin` menu + `defaultRouteFor` point legacy `role:'admin'` users to `/admin`, but the guard 403s anyone without `globalRole==='super_admin'`. Unless `promote-legacy-admins.js` ran, a legacy admin sees a dead-end. The `/admin` and `/super-admin` surfaces are **duplicated destinations for the same audience** — this violates the IA rule "one concept → one canonical location." Recommendation: **collapse `/admin` into `/super-admin`** (or alias) so there's a single admin home.

### 3.5 Org dashboards — `/dashboard/org/:orgId/*` (`OrgDashboardLayout`)
Built from `buildOrgMenu` + `hasPermission()`. ~25 org modules: **Overview, Branches, Members, Roles/Permissions, Classes, Batches, Exams, Attendance, Finance/Billing, Materials, Announcements, Schedules, Assignments, Results, Guardian, Join Requests, Academic Years, Analytics, Audit Logs.**

- ✅ **Correct:** org RBAC is the most mature part of the system — `requireOrgPermission` / `requireOrgAnyPermission` with owner bypass, per-role permission cache, `hasPermission()` on the frontend mirroring `PERMISSIONS`. Owner/admin/coordinator/teacher/student roles with granular bundles.
- **Gaps:** see §5 (this is a rich surface — the "offer more" here is about depth per module + cross-org tooling, not about missing modules).

---

## 4. Backend authorization matrix (server-side truth)

Summarized from `server.js` + route modules. This is what actually *enforces* access — the frontend menus are cosmetic by comparison.

| Resource | Public (anon) | Any auth | Role-gated | Ownership check |
|---|---|---|---|---|
| `GET /api/config` | ✅ | — | — | — |
| `GET /api/tutors` + `/search` | ✅ | — | — | — |
| **`GET /api/tutors/:id`** | ❌ **401** | ✅ | — | owner/admin get full, others anonymized |
| `GET /api/tuitions` + `/:id` | ✅ | — | — | — |
| `POST /api/tuitions` | ❌ | ✅ | **⚠️ no tutor-block server-side** | stamps student_email = caller |
| `GET /api/tuitions/student/:email` | ❌ | ✅ | — | `forbidIfNotOwnerOrAdmin` ✅ |
| `POST /api/applications` | ❌ | ✅ | **tutorMiddleware** ✅ | — |
| `/api/applications/*` by-email | ❌ | ✅ | — | `assertEmailMatchesParam` ✅ |
| `/api/bookings/*` | ❌ | ✅ | — | getById/patch ownership ✅ |
| `GET /api/payments/student/:email`, `tutor/:email` | ❌ | ✅ | — | `assertEmailMatchesParam` ✅ |
| `POST /api/payments/manual` | ❌ | ✅ | — | `studentEmail = caller email` ✅ |
| `/api/payments/:id/approve,reject` | ❌ | ✅ | `adminMiddleware` ✅ | — |
| `/api/wallet`, `/api/receipts`, `/api/sessions` | ❌ | ✅ | — | ownership via email/userId |
| `/api/ai/tutor/lesson-plan`, `/assignment` | ❌ | ✅ | **tutorMiddleware** ✅ | — |
| `/api/ai/*` (chat/quiz/notes/sessions) | ❌ | ✅ | — | per-user scoping |
| `/api/users` (list), `DELETE /:id` | ❌ | ✅ | `adminMiddleware` ✅ | — |
| `PATCH /api/users/by-email/:email` | ❌ | ✅ | — | `assertEmailMatchesParam` ✅ (own profile) |
| `/api/v1/organizations` (list/slug detail) | ✅ | ✅ | — | — |
| `/api/v1/organizations/my/orgs` | ❌ | ✅ | — | per-membership |
| `/api/v1/organizations/:orgId/*` | ❌ | ✅ | `requireOrgPermission`/`Any` ✅ | owner bypass + active-context |
| `POST /api/v1/organizations/:orgId/join-request`, `/leave` | ❌ | ✅ | — | self-scoped |
| `/uploads` | ❌ | ✅ | — | Upload record + owner match ✅ |
| `/metrics` | ❌ | ✅ | `adminMiddleware` ✅ | — |

**Overall assessment: the backend authorization layer is strong** — server-side ownership checks on all money/data flows, `assertEmailMatchesParam` everywhere an email is a param, org RBAC with wildcards + active-context, super_admin bypass is deliberate. The **weaknesses are asymmetry (tutor detail public-vs-401) and a couple of client-authoritative decisions** (PostTuition role check, PaymentHistory endpoint choice).

---

## 5. Recommendations — what else you can offer each role

Ranked by leverage for a Bangladesh tuition marketplace. All are "offer more" additions; none require weakening existing security.

### For Students (the demand side)
1. **Save-for-later on tutor profiles + "apply later" on tuitions** — students currently only bookmark. A saved-tutor list with a "I contacted them" status would make the marketplace feel functional.
2. **Compare tutors side-by-side** — select 2–3 tutors, compare subjects/rates/verification/response rate. High trust value in a manual-payment marketplace.
3. **Session calendar + reminders** — students have "Engagements" but no calendar view of booked sessions with SMS/notification reminders before each class (Bangladesh mobile-first; SMS reminders via existing mail/SMS infra).
4. **Progress tracking / shared notes per engagement** — tie into the existing `Assignments` module so a parent/student can see the tutor's lesson notes and progress.
5. **Parent (guardian) mode** — Bangladesh parents are often the real buyers. A read-only "I'm the parent" view of a child's bookings/payments/verification status would open a huge user segment. The org side already has a `guardian` module — extend that concept to the consumer marketplace.
6. **Anonymous→checkout friction fix:** let students build an interest list before they create an account, then reconcile on sign-in (this is the classic two-sided-marketplace leak).

### For Tutors (the supply side)
1. **Availability→booking coupling:** availability is set, but there's no visible "these students can book my free slots" flow from the tutor side. A weekly time-block view with a shareable "Book my slot" link.
2. **Earnings forecast + smart withdrawal:** tutors see past payments; give a **projected-monthly-earnings** based on confirmed sessions + commission estimate, and a "withdraw when balance > X" one-tap.
3. **Tutor referral program** — refer another verified tutor, get a wallet bonus on their first booking. Great growth loop, fits the existing wallet + commission model.
4. **Profile completion score + "boost visibility"** — the profile-completeness calc already exists; surface it as a checklist ("add NID → get Verified badge → appear higher in search").
5. **Batch lesson-plan export** — the AI lesson planner generates single plans; let tutors generate a **monthly curriculum** for a subject/class in one click (reuses existing AI + templates).
6. **Tutor "jobs you match" digest** — weekly email/notification of new tuitions matching their subject+area (reuses `search-alerts` infra but pre-scoped to their profile).

### For Organization members (owner/admin/teacher/student within a center)
1. **Cross-org/branch analytics rollup** — OrgAnalytics exists; add a **branch-comparison view** (attendance %, exam pass-rate by branch/class/batch).
2. **Guardian (parent) portal** — the org already has a guardian module; make it a first-class **parent-facing read-only dashboard** (child's attendance, exam results, fees due, announcements). Currently likely buried.
3. **Fee collection with payment-status notifications** — org finance exists; push SMS/notification to parents when a fee is due and when it's confirmed.
4. **Class-room scheduling conflicts** — detect and flag room/teacher time conflicts when schedules are created.
5. **Teacher self-service** — a teacher's own dashboard for their assigned classes, attendance entry, and materials upload (reduces admin workload).

### For Super Admin (platform owner)
1. **A real PlatformOverview** — the single biggest "offer more" in the whole app. Add: MRR/commission revenue, active tutors/students (not just registered), booking conversion funnel (tuitions posted → applications → confirmed → paid), payment verification queue count, moderation queue count, recent audit-log activity, top districts/subjects. `DashAnalytics` already computes much of this data — surface it on the landing.
2. **Withdrawal review workflow** — tutor withdrawals likely need manual admin approval (manual payments model). Confirm the queue exists in `/admin/withdrawals` and add per-tutor trust signals (verified?, history) to the review screen.
3. **Escrow/refund administration** — a single view of payments in `escrow_hold` + disputes, so the admin can resolve hold→release/refund. `DisputeWorkspace` exists; tie it to the payment hold state.
4. **Content moderation queue with bulk actions** — `AdminModeration` exists; add bulk-approve/reject + a reason dropdown for tutor-verification rejections (so tutors get a fixable message, not just "denied").
5. **Seeded analytics export (CSV)** — admin-only CSV export of users/payments/tutors for offline reporting.

### Cross-cutting (all roles)
1. **Real notification preferences** — one place to choose which events email/SMS/notification them (booking confirmed, payment verified, session reminder, new application).
2. **Bengali i18n for these surfaces** — per project CLAUDE.md, i18n currently covers navigation only. The tutor/student dashboards and public pages are still English-only; translate the highest-traffic surfaces first (Home, Tuitions, Tutors, Checkout, Tutor/Student dashboard tabs).
3. **Empty-state with next-action everywhere** — already good in places (`SearchEmptyState`); the org detail "Available Tuitions" placeholder and `PlatformOverview` "Quick Actions" paragraph are the two weak spots.

---

## 6. Priority fix list (bugs/quality, not features)

Ordered by user impact:

| # | Finding | Where | Severity | Suggested fix |
|---|---|---|---|---|
| 1 | `GET /api/tutors/:id` auth-gated but page public → anonymous users see "Profile Not Found" | backend `tutorRoutes.js:56` + `TutorDetails.jsx` | **HIGH** (core SEO + anonymous UX) | Make `getById` public with the existing anonymization for non-owner/non-admin |
| 2 | `PlatformOverview` super-admin landing is two cards + a paragraph | `PlatformOverview.jsx` | HIGH (weakest admin surface) | Surface existing analytics (revenue, funnels, queues) |
| 3 | `/admin` vs `/super-admin` are duplicate admin destinations (IA violation) | `AdminRoutes.jsx` / `SuperAdminRoutes.jsx` | MEDIUM | Collapse to one canonical admin home |
| 4 | Fabricated marketing numbers (2,500+ tutors) + `ratings \|\| '4.9'` + hardcoded "Verified" badge | `Home.jsx`, `TutorDetails.jsx`, `TuitionDetails.jsx` | MEDIUM (real-data rule) | Verify against DB; remove fallbacks |
| 5 | `POST /api/tuitions` doesn't block tutors server-side | backend `tuitionRoutes.js` + `PostTuition.jsx` | MEDIUM | Add server-side role check to match the client |
| 6 | `PaymentHistory` picks endpoint from `localStorage` role | `PaymentHistory.jsx:20` | LOW-MEDIUM | Use `dbUser.role` (server truth) |
| 7 | Demo-mode auto-verify notice shown to real users | `Checkout.jsx` | MEDIUM | Env-gate the demo notice |
| 8 | Org detail "Available Tuitions" placeholder + dead "Contact" button | `OrganizationDetails.jsx` | LOW | Wire to real data or remove |
| 9 | Org "Request to Join" button visible to anonymous users | `OrganizationDirectory.jsx` | LOW | Gate behind `user` |

---

## 7. What's already correct (don't touch)

- ✅ **Two-sided marketplace role split** is clean: students post + pay, tutors apply + teach, orgs run their own centers. No role is "doing the wrong thing."
- ✅ **Server-side ownership checks** on every money/data endpoint (`assertEmailMatchesParam`, `forbidIfNotOwnerOrAdmin`, booking ownership, upload ownership, org RBAC). No trust in client-supplied roles for authorization.
- ✅ **Org RBAC is production-grade** (owner bypass, wildcard permissions, active teacher-context, permission caching, audit logging of bypass).
- ✅ **Tutor-only AI tools** correctly gated server-side; all AI usage scoped per-user.
- ✅ **Verification + wallet + manual payments** flow is coherent for a Bangladesh-first manual-payments model.
- ✅ Route guards do their job; `PrivateRoute`/`PublicRoute`/`AdminRoute` split is sound (modulo the `/admin` vs `/super-admin` duplication).
