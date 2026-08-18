# Implementation Plan — Missing / Not-Implemented Gap Fixes

Audit date: 2026-08-17 · Backend HEAD: `73ad0cf` · Frontend HEAD: `4a49309`

Scope: the high-leverage gaps found in the both-repo audit (live 404s, a silently-broken logout security step, and fabricated data rendered as real content). Each fix is surgical; nothing here refactors working features.

## Status: ALL PHASES COMPLETE — verified 2026-08-17

Backend `npm test`: 43 suites / 341 tests pass. Frontend `npm run build`: clean; `npm run lint`: 0 new errors (all 7 remaining errors pre-exist in `MarkdownRenderer.jsx`, `Org*.jsx`, illustration files, `AiAssistantChat.jsx`). Frontend `npm test`: 3 pre-existing `test_render.test.jsx` Shiki timeouts fail identically on the clean tree (verified via stash). `demoTutors.json` deleted (orphaned by 2.8).

---

## Phase 1 — Backend (2 fixes)

### 1.1 Add `/api/search/suggestions` alias

**Why:** Frontend `SearchEmptyState.jsx` (rendered on the empty states of the live `Tutors.jsx` and `Tuitions.jsx` pages) fetches `GET /api/search/suggestions?q=`. Backend only registers `/api/search/suggest`. Every empty-search on those two pages 404s and the "Did you mean…" feature silently never works. README documents `/suggestions` as the canonical path.

**Change:** `etuitionhub--backend/src/modules/search-analytics/routes/searchRoutes.js:82` — register the same handler for both paths:

```js
router.get(['/suggest', '/suggestions'], searchLimiter, validateSearchSuggestQuery, asyncHandler(async (req, res) => {
    const { q } = req.query;
    const suggestions = suggest(q);
    res.json({ query: q, suggestions });
}));
```

Response shape (`{ query, suggestions }`) already matches what `SearchEmptyState.jsx:29` reads (`data.suggestions`). No frontend change needed.

**Verify:** `GET /api/search/suggestions?q=Physic` returns `{ query, suggestions }` with 200.

### 1.2 Fix logout token-blacklist require paths

**Why:** `authController.js` logout (lines 195, 198) requires `'../utils/jwtVerify'` and `'../services/tokenBlacklistService'` relative to `src/modules/auth/controllers/`. Those directories don't exist under the auth module. `MODULE_NOT_FOUND` is thrown inside a `try/catch {}`, so the blacklist step is a permanent silent no-op — access tokens stay valid until natural expiry. The correct paths (used at `src/modules/auth/middleware/auth.js:11`) are `../../../../services/tokenBlacklistService` and `../../../../utils/jwtVerify` (i.e. repo-root `services/` and `utils/`).

**Change:** `etuitionhub--backend/src/modules/auth/controllers/authController.js` lines 195 + 198:

```js
const { verifyWithGrace } = require('../../../../utils/jwtVerify');
...
const { blacklistToken } = require('../../../../services/tokenBlacklistService');
```

**Verify:** `src/modules/auth/controllers/authController.js` imports resolve; logout no longer throws `MODULE_NOT_FOUND` (check no swallow).

---

## Phase 2 — Frontend: real data only (remove fabrications)

Project rule (binding): *"Real data only. Never fabricate testimonials, statistics, avatars, or legal claims."* All files below render invented numbers/claims/people as real content.

### 2.1 `src/components/Home/Testimonials.jsx`
- Delete `MOCK_TESTIMONIALS` (lines 16–41).
- When API returns empty or errors → render `<EmptyState>` (honest empty state), not mocks.
- Fix middle-card drop: `if (idx === 1) return null;` (line 99) unconditionally drops the 2nd real testimonial even when there is no video. Only render the "Video Spotlight" card when `items[1]?.videoURL` is truthy; otherwise render all 3 cards normally.
- Keep the existing loading skeleton.

### 2.2 `src/pages/Blog.jsx`
- No blog API exists on the backend. Replace the 3 fabricated posts (fake authors `ADMIN_MATRIX` etc., lines 10–35) with an honest empty state (`EmptyState`, "No articles yet — coming soon").
- Keep `SEO` and page shell.

### 2.3 `src/pages/About.jsx`
- Stats grid (lines 26–39) is fabricated (`2,500+`, `15,000+`, `50+`, `10+`). Replace with **real** numbers fetched from public endpoints: `GET /api/tutors` → `pagination.total` (Verified Tutors) and `GET /api/tuitions` → `pagination.total` (Open tuition posts). Drop "Students Matched" and "Cities" (no public source). Show a skeleton while loading; render nothing if fetch fails (no fake fallback).
- Keep mission / values / coverage sections unchanged.

### 2.4 `src/components/Home/WhyChooseUs.jsx`
- Delete fabricated `trustStats` (lines 80–85: `100%`, `4.8/5`, `<24h`, `95%`) and the "Floating statistics row" render (lines 178–194). The feature-blocks section above carries the value.

### 2.5 `src/components/Home/FeaturedCategories.jsx`
- `count` (`850+`, `620+`, …) and `rating` (`4.8`, …) fields are fabricated. Remove them from the `categories` array and from the card footer (lines 211–222). Cards keep icon / label / context / tag / link.

### 2.6 `src/components/Home/HomeBanner.jsx`
- Line 120: replace hardcoded `2,500+ verified expert tutors` with the **real** live count already fetched from `/api/tutors/availability` (`availability.count`); fall back to non-numeric copy ("Connect with verified expert tutors…") if count unavailable.
- Bottom stats row (lines 244–263) is fabricated (`2,500+`, `45k+`, `15k+`, `64`). Remove the row (no public data source for those metrics).

### 2.7 `src/components/Home/FinalTrustStrip.jsx`
- Remove the fabricated policy claim "No-show replace in 24h / Free replacement if tutor doesn't show" (line 5). Keep "Verified" and "Direct contact".

### 2.8 `src/pages/TutorDetails.jsx`
- Remove `demoTutors` state + `../data/demoTutors.json` import (lines 112, 117–119, 126–132, 176–182). On API failure → real error state, no mock fallback.
- "Similar Tutors" section (lines 624–631) uses `demoTutors`. Replace with a real query: `GET /api/tutors` filtered client-side by overlapping subject, excluding current tutor, slice 3. Render the section only when matches exist. Remove `src/data/demoTutors.json` usage (keep file removal optional).

### 2.9 `src/components/Home/TestimonialVideo.jsx`
- The no-`videoUrl` branch (lines 18–48) renders a fake play button that does nothing. Since 2.1 now gates the spotlight on a real `videoURL`, this branch is dead — replace with a minimal neutral card (no play affordance) or remove it and let the parent skip rendering.

---

## Phase 3 — Missing assets (2 files)

### 3.1 `public/og-image.png`
Referenced by `index.html:17` and absent. Generate a real 1200×630 PNG (brand: primary `#2563EB`, "e-TuitionBD / eTuitionHub") — see scripts/og-image script.

### 3.2 `public/mask-icon.svg`
Referenced by `vite.config.js:42` PWA `includeAssets` and absent. Create a simple SVG monochrome icon.

---

## Phase 4 — Verification

- Backend: `npm test` (all suites pass).
- Frontend: `npm run build` (clean) + `npm run lint` (no new errors).
- Manual: empty-search on `/tutors` no longer 404s; logout does not throw.

## Out of scope (recorded, not fixed here)
- `Connections.jsx` page (no route) — needs product decision, page uses `useState('student')` placeholder.
- Full Bengali i18n (326 files), org feature parity, dead component cleanup (`chat/*`, `ComingSoon.jsx`, `ui/hero-section-8.jsx`, `ui/shuffle-grid.jsx`), unused deps, doc/README stale claims.