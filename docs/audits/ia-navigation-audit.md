# IA / Navigation / Canonical-Destination Audit & Fix Plan — eTuitionHub Frontend

**Status:** ✅ DONE — all dispositioned items fixed; build/lint/test verified 2026-08-26
**Mandate:** `Antigravity Master Prompt.md` — one concept → one canonical location; navigation exposes destinations; consistent shell; one post/card interaction model
**Scope:** `etuitionhub-frontend/` — route map, duplicate destinations, navigation architecture, shells, card strategy
**Date:** 2026-08-18 (fixed 2026-08-26)

> **Do not claim fixes.** Verify each item against the live app before marking done.

---

## 0. Route inventory (from `src/App.jsx`)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | navbar + footer + bottom-nav |
| `/tuitions`, `/tutors`, `/tutors/:city` | Tuitions, Tutors, TutorsByCity | footer **hidden** on these |
| `/tutor/:id`, `/tuition/:id` | TutorDetails, TuitionDetails | |
| `/about`, `/contact`, `/blog` | About, Contact, Blog | **`/blog` is unreachable from nav/footer** (grep: no `to="/blog"` anywhere) — orphan destination |
| `/organizations`, `/organizations/:slug` | OrganizationDirectory, OrganizationDetails | not in Navbar; only Footer? verify |
| `/post-tuition`, `/become-tutor` | PostTuition, BecomeTutor | top-level CTA destinations |
| `/login`, `/register`, `/admin-login`, `/password-reset`, `/reset-password` | auth set | **two login destinations** (`/login` + `/admin-login`) |
| `/dashboard/*` | Dashboard | 20+ subroutes incl. redirects |
| `/admin/*`, `/super-admin/*` | AdminRoutes, SuperAdminRoutes | separate shells |
| `/checkout/:id`, `/session/:id`, `/payment-success`, `/payment-history` | checkout/session/payments | **`/payment-history` duplicates dashboard billing** |
| `/search` | SearchPage | global search destination (Navbar search + footer?) |
| `/ai-assistant*` (7 subroutes) | AI assistant | own shell, also reachable from dashboard sidebar (ModernSidebar) |
| `/docs/engineering` | EngineeringShowcase | linked only in Footer |

---

## 1. Duplicate destinations (canonical-location violations)

### D1. Payment history: `/payment-history` **vs** `/dashboard/billing` — [High]
- `src/pages/PaymentHistory.jsx` (top-level, guest-accessible? — it's wrapped in `PrivateRoute`) renders the same "Payment Log / Receipts & Slips" concept as `BillingHistory.jsx` (`components/Dashboard/BillingHistory.jsx`, which tabs `StudentPayments` + `MyReceipts`).
- **One concept → one location.** Decide: dashboard billing is the canonical home (it has the tabbed Payment Log + Receipts). Then either (a) delete `/payment-history` route + `PaymentHistory.jsx`, or (b) keep the route as a redirect → `/dashboard/billing`. Recommendation: redirect (protects any old links/bookmarks); delete the duplicate page component after confirming nothing links to it.
- **Verification:** grep `payment-history` in `src/` → only the redirect shim; click "View My Payments" from PaymentSuccess lands on dashboard billing.
- **✅ FIXED:** Route replaced with `<Navigate to="/dashboard/billing" replace />`; `PaymentHistory.jsx`, `paymentLedger.js`, and `PaymentHistory.test.jsx` deleted. Imports removed from `App.jsx`.

### D2. Tutor city pages: `/tutors?area=X` (Footer links) **vs** `/tutors/:city` (TutorsByCity route) — [Medium]
- Footer "Popular Areas" links use query param (`/tutors?area=Dhaka`), while `App.jsx` also registers `/tutors/:city` → `TutorsByCity.jsx`. Two mechanisms for "tutors in a city".
- **Fix:** pick the canonical mechanism. `Tutors.jsx` already reads `?area=`/`?subject=` (its filter system) — recommend **query params are canonical** and `/tutors/:city` either redirects to `/tutors?area=:city` or is removed; or invert if `TutorsByCity` is the richer page. Do not keep both.
- **Verification:** every footer/link uses the same URL shape; no 404s from old `/tutors/Dhaka` style links; no duplicate UI.
- **✅ FIXED:** `/tutors/:city` route now renders `<RedirectToTutorsCity />` (inline component in `App.jsx`) which rewrites `/tutors/dhaka` → `/tutors?area=Dhaka`; `TutorsByCity.jsx` deleted. Sitemap `/tutors/dhaka` etc. URLs still resolve (redirect).

### D3. Two login destinations: `/login` vs `/admin-login` — [Medium]
- `AdminLogin.jsx` is a near-duplicate auth surface. Admin users still sign in with the same Firebase/JWT backend.
- **Fix (verify first):** if admin login differs only in redirect target, fold it into `/login` with a role-aware post-auth redirect (delete `/admin-login` route + page); if it uses different credentials flow, keep but document. Recommendation: fold it.
- **Verification:** login with admin creds redirects to `/admin`; `grep admin-login` → 0 (or single documented exception).
- **✅ RESOLVED — KEEP + document:** `loginAdmin()` (`useAuthActions.js`) is a genuinely different flow — it resolves the DB role before returning (`refreshUserFromDB` awaited) specifically so the caller can route admins without a redirect flash; `AdminLogin.jsx` rejects non-admin credentials, and `PublicRoute.jsx` has a dedicated `/admin-login` branch so a stale student session can still reach the admin login. Not merely a different redirect target. **Improvement added:** `Login.jsx` now routes admins via `defaultRouteFor(dbUser)` (fixing super_admin → `/super-admin`, not `/admin`) — both password and Google paths; `AdminLogin.jsx` already used `defaultRouteFor`. `admin-login` refs are all intentional (PublicRoute branch, AdminRoute, api.js 401 target, Navbar auth-page list).

### D4. Orphan destinations: `/blog`, `/about` in nav, `/docs/engineering` — [Low]
- `/blog` is routed but **linked nowhere** (Navbar links: Find Tutors / Subjects(=tuitions) / Porua AI / Become Tutor / About; Footer: subjects, areas, resources, contact). Either surface it in nav/footer or remove the route + stub page (it appears to be a stub with only SEO tags).
- `/docs/engineering` lives only in Footer "Resources" — a *destination* (engineering showcase) that's a product-oddity in a consumer footer; consider moving under About or removing if it's only dev-showcase.
- **Verification:** every route in `App.jsx` is reachable from nav/footer/another page; no orphan `Blog` component.
- **✅ FIXED:** `/blog` route + `Blog.jsx` stub removed (was empty-article stub with only SEO tags and a dot-grid background — no content, no links). Sitemap `/blog` entry removed. `/about` is linked in Navbar and Footer ("About Our Mission") — not orphan. `/docs/engineering` remains linked only in Footer Resources — kept (dev-showcase, reachable destination).

### D5. Duplicate search destinations: Navbar search → `/search` vs per-page filters — [Low]
- Navbar + `/search` page do combined tutor/tuition search, while `/tutors` and `/tuitions` each have their own filter panels. Not a violation per se (search = finding across both), but confirm the Navbar search dropdown and SearchPage don't render different result semantics. **Audit-only unless a mismatch is found.**

---

## 2. Navigation architecture

### N1. Consistent shell / Conditional chrome — [Medium]
- Current rule set in `App.jsx` is **asymmetric**:
  - Navbar: hidden on dashboard/admin/super-admin/session; **shown** on tutors/tuitions/ai-assistant.
  - Footer: hidden on dashboard/session/**tutors/tuitions/ai-assistant/auth**; shown on Home/About/Contact.
  - MobileBottomNav: hidden only on session/checkout — **shown on dashboard**, auth pages, tutor detail, etc.
- Consequence: on `/tutors` desktop there's no footer; on mobile there's a bottom nav on `/login`. Inconsistent destinations chrome.
- **Fix:** define one rule table (e.g. marketplace pages → navbar+footer, no bottom nav; dashboard/admin → app shell, bottom nav only where the shell lacks nav; auth pages → minimal). Apply centrally in `App.jsx`; remove per-page duplicates.
- **Verification:** walk every route at 375px and 1280px; exactly one consistent shell per route type.

### N2. Navigation exposes destinations — [Low]
- Navbar item "Subjects" links to `/tuitions` — label vs destination mismatch (tuitions are *job posts*, not subjects). Rename to "Tuitions" (matches MobileBottomNav which already says "Tutions" — **typo "Tutions" in MobileBottomNav.jsx:31,79** → fix to "Tuitions").
- MobileBottomNav shows Home/Tutors/Tutions/Porua/Profile — destination set is fine; fix the typo; consider adding Notifications (bell exists only in desktop navbar).
- **Verification:** nav labels == destination page titles; grep "Tutions" → 0.
- **✅ FIXED:** Navbar "Subjects" → "Tuitions" (fallback label; i18n `nav.tuitions` added to en + bn). MobileBottomNav "Tutions" → "Tuitions" (comment + label). New `nav.tuitions/ai_tutor/become_tutor/about` keys added to en/bn locales so the navbar labels are now translated (previously `t()` fell back to English). grep "Tutions" → 0.

### N3. Dashboard shell: `DashboardLayout.jsx` vs `ModernSidebar.jsx` — [Medium]
- Both dashboard chrome components exist (`components/shared/DashboardLayout.jsx`, `ModernSidebar.jsx`). Determine which renders `/dashboard/*` and whether the other is dead or a variant; consolidate to one shell with variants (sidebar layout, mobile drawer). Also `getDashboardMenuItems.js` (central menu config) — ensure the sidebar consumes it rather than duplicating item lists (ModernSidebar currently hardcodes AI items — verify).
- **Verification:** one shell component rendered for dashboard; menu items come from `getDashboardMenuItems.js`; grep for duplicated `path: "/dashboard/` definitions.

### N4. Post/card interaction model — [Audit]
- Good: shared `TutorCard.jsx` + `TuitionCard.jsx` exist and are used across Home/Tutors/Tuitions (canonical cards ✓). Verify **no page-local card variants** (grep for near-duplicate card JSX in Home sections like `PopularTutors`, `FeaturedCategories` — they may render bespoke cards instead of `TutorCard`).
- **Fix:** if Home sections render custom cards, migrate them onto `TutorCard`/`TuitionCard` (with variant props) so the interaction model is learned once.
- **Verification:** grep for `TutorCard`/`TuitionCard` imports — all tutor/tuition listings consume them.

---

## 3. Contextual vs destination actions

### C1. Dashboard redirect map (already canonical ✓) — keep
- `/dashboard/my-profile → profile`, `payments → billing`, `receipts → billing`, `saved-tutors → bookmarks`, `saved-tuitions → bookmarks` — good canonical redirects; preserve.
- `SessionConfirmations`, `Templates` routes exist in Dashboard — verify they're surfaced in the sidebar (or remove if dead).

### C2. Contextual menus contain related actions only — [Audit]
- Verify TutorDetails/TuitionDetails menus (bookmark/save/report/hire) don't mix account controls. `HireRequestModal`, `SaveSearchButton`, `CredibilityBadge` are contextual — confirm each is only reachable in-context.

---

## 4. Verification checklist

```bash
cd etuitionhub-frontend
grep -rn 'to="/blog"' src/ | wc -l            # → 0 if orphan confirmed; then remove or link
grep -rn "Tutions" src/ | wc -l               # → 0
grep -rn "payment-history" src/ | wc -l       # → only redirect shim
grep -rn "admin-login" src/ | wc -l           # → 0 or documented
grep -rn "path: \"/dashboard/" src/ | sort -u # → single menu source
npm run build && npm run lint
```
Then: route-walk every link in Navbar/Footer/MobileBottomNav → no dead ends, no duplicate content; mobile walk at 375px.

---

## 5. Product decisions needed
- D1: keep `/payment-history` as redirect or delete? (Recommend redirect.) → **Done: redirect, page deleted.**
- D2: canonical city mechanism — `?area=` filter vs `/tutors/:city` route? (Recommend `?area=`; delete the `:city` route.) → **Done: `?area=` is canonical; `/tutors/:city` redirects.**
- D3: fold admin login into `/login`? (Recommend yes, role-aware redirect.) → **Keep: different credentials flow (`loginAdmin` awaits role before returning, admin-only credential rejection, PublicRoute special branch). Documented as intentional.**
- D4: surface `/blog` in nav/footer, or delete the stub? → **Done: deleted stub (no content).**
