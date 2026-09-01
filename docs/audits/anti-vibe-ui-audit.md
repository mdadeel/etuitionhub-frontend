# Anti-Vibe-Coded UI Audit & Fix Plan — eTuitionHub Frontend

**Status:** ✅ DONE — all 30 anti-patterns dispositioned; Part 3 final report complete; build-verified 2026-08-26
- **Done & verified (lint+build+tests green 2026-08-25):** #7 emoji→lucide (interface-level: PasswordStrength, SaveSearchButton, AdminVerifications, ConnectionRequestCard, WhyChooseUs, AiResponseCard, ActivePanel, Home illustrations), #9 copy (PaymentHistory rewrite, FilterBar, DashAnalytics/DashTuitions/DashPayments, Checkout locales, Contact, NotFound, AdminAuditLogs), #11/#22/#23 dot-grid removal (PaymentHistory, Contact), #8 blur sweep (blur now only on modal overlays + floating shells), #5 shadow-2xl removal (PaymentHistory, Contact), #26/#27 Terms & Privacy pages (routes `/terms`+`/privacy`, pages with honest "not yet legally reviewed" placeholder structure, footer links, sitemap entries, per-page SEO).
- **#1 gradients done (2026-08-25):** removed decorative gradient fields — CallToAction (600px emerald radial glow orb, primary→cyan→accent rainbow stripe → solid `bg-primary`, CTA button `from-primary to-primary/90` → solid `bg-primary`, inner card `from-background to-card` → `bg-card`), Testimonials (section `from-background via-primary/[0.01]` wash → plain, video-spotlight `from-primary/20 to-accent/20` + `shadow-xl` → `bg-card shadow-premium-lg`), Home.jsx "Are you a tutor?" band `from-primary/5 to-accent/5` → `bg-muted/40`, OrganizationDirectory org-card banner `from-primary/20 to-primary/5` → `bg-primary/10` (kept the image-scrim gradient at :218 — functional, over banner photos), ChatSidebarItem unread badge pointless `from-primary to-primary` → `bg-primary`, Illustration placeholder 5 pastel gradients + fallback → single `bg-muted/30` neutral surface (kept the dev-only "Drop SVG" placeholder, now neutral).
- **Gap-sweeps folded in:** `text-[8px]` labels (missed by T4) → `text-[11px]` across 5 files (TutorRecommendationCard, TuitionRecommendationCard, ProgressTracker, FeaturedCategories, WhyChooseUs, Testimonials "Video Spotlight" badge); raw `fill-amber-400/500` star fills → `fill-warning` (Testimonials, TutorCompareModal, TutorDetails).
- **Gradients intentionally kept (documented):** shimmer skeletons (`SkeletonCard`, `ui/skeleton`), sent-message bubble `from-[#3B82F6] to-[#2563EB]` (messaging surface), DynamicIsland teal gradient (protected), categorical hover washes (SuggestedActions, AiAssistantHome — the categorical multi-hue system, see design-system T2 keeps).
- **#6 Home card-grid→editorial done (2026-08-25):** Statistics — 4-col equal-capability grid → editorial layout (strong statement headline left, 2×2 hairline-separated capability grid right, no hover-transform/scale, no backdrop-blur card). WhyChooseUs — removed 500px radial glow orb, removed decorative `↓`/`✦` connector bars between cards, removed `backdrop-blur-sm` from cards, replaced em-dash string-split feature list with structured label+note pairs (no raw `—` in copy). FeaturedCategories — removed `bg-gradient-to-br` gradient wash from all 8 accent styles (emerald/blue/orange/cyan/slate/teal/pink/rose all had `gradient` key with `from-*/via-*/to-transparent`); removed `a.gradient` render layer in every card. Statistics/WhyChooseUs/FeaturedCategories all now use editorial hierarchy (strong statement + list + cards) instead of equal-card grids.
- **#21 states gap closed (2026-08-26):** Tutors.jsx had no error state — a fetch failure fell through to the misleading "No tutors found" `SearchEmptyState`. Added `error` + `retryNonce` state: `setError(null)` on success and on filter reset, catch sets a human-readable server message (or a plain-network fallback) in `error`, and the empty-state branch renders a dedicated error block (destructive heading + message + "Try again" button that bumps `retryNonce` into the fetch effect deps). Added `tutors.error_title` / `tutors.try_again` to en+bn locales. Tuitions.jsx's existing error handling was already correct (`error?.message` renders a readable string). Skeleton coverage verified: Tutors (TutorCardGridSkeleton), Tuitions, TutorDetails, Home (Testimonials skeleton), dashboards (StatCardSkeleton/TableSkeleton) all load with skeletons, not spinners.
- **#24 sparkle reduce — verified (2026-08-26):** grep confirms sparkles are a single pair flanking the AiAssistantHome section-header eyebrow ("Porua AI · E-TuitionBD Official AI Tutor") plus the AI-appropriate IntentBadge/ChatInput affordances — the audit's premise ("tiny sparkles beside every feature") is stale. No change needed; documented as KEEP per design-system C5 exemption.
- **H-sweep verified (2026-08-26):** H1 hierarchy — Home sections editorialized (#6), PaymentHistory rewritten, each page keeps a clear primary action; H2 spacing — remaining `py-20/24` are empty/loading-state centering + shared `Section.jsx` rhythm (in scale); H3 layout stability — `useAnimateOnScroll` hook neutralized (content renders visible without JS), entrance animations 200ms + `forwards` ending visible, universal `prefers-reduced-motion` block forces opacity-visible, `scrollbar-gutter: stable`, fonts `display=swap` + preconnect, no hover-lifts on cards; H4 responsive — walk verified 320/768/1440 (mobile drawer `rounded-t-3xl`→`rounded-t-lg`, no overflow); H5 states — Tuitions error-readability already correct + Tutors error state added (#21); H6 copy — "seamless" generic phrase removed from Profile.jsx (remaining instances are technical prose on the EngineeringShowcase dev-doc page, appropriate).
- **Remaining:** Part 3 final report (below).
**Mandate:** `UI-UX Anti-Vibe-Coded Design Audit & Fix Prompt.md` (30 anti-patterns + hierarchy/spacing/layout-stability/states/copy)
**Scope:** `etuitionhub-frontend/` — the 30 patterns, deeper problems, final report format
**Date:** 2026-08-18 (updated 2026-08-25)

> **Do not claim fixes.** Each item must be verified against the live app before marking done.

---

## 0. How to read this

For each pattern: **exists? where? why it hurts here? replacement?** Patterns marked ✅ keep were verified to already conform or to be product-appropriate — do not churn them. All locations were grep-verified on 2026-08-18 against `src/`.

---

## Part 1 — The 30 anti-patterns

### 1. Harsh gradients — ⚠️ EXISTS (decorative)
- `src/app.css`: `.bg-layered` (`bg-gradient-to-b from-background to-muted/20`), Testimonials section `bg-gradient-to-b from-background via-primary/[0.01] to-background`, video spotlight card `bg-gradient-to-br from-primary/20 to-accent/20` (`Testimonials.jsx`), Home illustrations `Illustration.jsx:38-42` (5 pastel gradients).
- **Hurt:** decorative color fields behind content; the "AI template" signal.
- **Replacement:** solid `bg-muted/30` / `bg-card` surfaces; keep a gradient only if a real section needs it (none does today).

### 2. Generic Lucide icons — ✅ KEEP (one consistent set)
- Single icon set (lucide-react) across the app; `PoruaLogo`/`Github`/`Instagram`/`Linkedin` are brand SVGs (justified). Only exception: `AppleUI/index.jsx` buttons import icons — verify same set. No action beyond the icon-size sweep below.

### 3. Pure white background — ✅ MOSTLY OK
- `--background: 210 20% 97%` (not `#FFFFFF`); cards `--card: 0 0% 100%` give a real surface hierarchy. Footer `bg-slate-900` is a deliberate dark footer. Keep. (Revisit only if T2 of the design-system audit lands.)

### 4. Rainbow coloring — ⚠️ EXISTS (scattered)
- `avatarColors` (emerald/blue/amber) in `Testimonials.jsx:7-9`, `Home/illustrations` 5-hue palette, `text-amber-500` stars, `bg-blue-600`/`text-gray-700` in `SessionRoom.jsx:265,271`.
- **Replacement:** semantic tokens only — success/warning/destructive for status; one primary for action; muted neutrals elsewhere.

### 5. Drop shadows — ⚠️ EXISTS (card shadows everywhere)
- `shadow-xl`/`shadow-2xl`/`shadow-lg` on cards (`AiAssistantChat` popovers, `PaymentHistory` table `shadow-2xl`, `TutorDetails` modals `shadow-lg`), `box-shadow` triple-stack on `.card-premium`, `shadow-[0_20px_50px_rgba(0,0,0,0.05)]` (`HomeBanner.jsx:128`).
- **Replacement:** borders + surface contrast; shadows only on elevated overlays (dialogs/dropdowns/toasts).

### 6. Three feature cards in a row — ⚠️ EXISTS (Home)
- `Statistics.jsx` (4-col capability cards), `WhyChooseUs.jsx` (feature list + 4-col), `FeaturedCategories.jsx` (6-col grid), `PopularTutors.jsx` (4-col), `Testimonials.jsx` (3-col). Home is a card-grid page.
- **Replacement (partial):** keep data grids (PopularTutors/Testimonials are real data — fine); convert *marketing* sections (Statistics/WhyChooseUs/FeaturedCategories) to editorial hierarchy: one strong statement + list + single spotlight, not 3–6 equal cards.

### 7. Emojis — ⚠️ EXISTS (interface-level)
- `components/Home/illustrations/Illustration.jsx:38-48` — **emoji as illustration icons** (`🏙️👨👩👧🤖🤔🎓🖼️`) — the flagship violation.
- Also: `PasswordStrength.jsx` `✓/○`, `SaveSearchButton.jsx:19` toast icon `🔔`, `AdminVerifications.jsx:44` email subjects `🎉/⚠️`, `ConnectionRequestCard.jsx:64` `📍`, `WhyChooseUs.jsx:159` `↓/✦`, `ChatInputBar.jsx:5`/`ReactionTray.jsx:4` emoji **pickers** (chat reactions — product-appropriate, keep), `AiResponseCard.jsx:148,205` `💬🧠`.
- **Replacement:** lucide icons for all interface emoji; keep the chat reaction/emoji picker (that's a real feature); replace the Home illustration emoji with lucide icons or real SVG illustrations.

### 8. Liquid glass — ⚠️ EXISTS (49 backdrop-blur matches)
- `.glass-premium` (`app.css:305`), `.bg-elevated` (`backdrop-blur-md`), `DynamicIsland.jsx:173` (`backdrop-blur-[30px] saturate-[150%]`), `MobileBottomNav.jsx:31` (`backdrop-blur-2xl`), `ChatInput.jsx:308` (`backdrop-blur-xl`), plus 40+ `backdrop-blur-sm/md` on modals/cards.
- **Replacement:** blur only on modal overlays and floating shells (bottom nav/chat input **may** keep a *subtle* blur for readability over scroll — decide once, document); strip blur from all cards/sections.

### 9. Em dashes / AI copy — ⚠️ EXISTS (copy level)
- `WhyChooseUs.jsx:52-75` — "Verification — Academic credentials checked" em-dash list; `PoruaTeaser.jsx:32`; `FAQ.jsx:10` — long run-on answers; `PaymentHistory.jsx` — **"Yield Logs", "Financial Infrastructure", "Professional Node", "Yield Volume", "End-to-end encrypted ledger synchronization"** — invented financial jargon (anti-vibe copy at its worst).
- **Replacement:** plain human copy; PaymentHistory re-worded to "Payment History / Amount / Status" with real labels. (See Part 2 copy audit.)

### 10. Inter / Space Grotesk — ✅ KEEP (documented identity)
- CLAUDE.md identity: "Inter body / Space Grotesk display". Both used correctly (`font-display` on headings, `font-sans` body). Only fix: non-blocking font loading (see design-system T4).

### 11. Colored stripes — ✅ NOT FOUND
- No arbitrary colored bars/stripes found (grep). The `w-10 h-1 bg-primary` bar in `PaymentHistory.jsx` is decorative — remove with the page rewrite (D1/anti-vibe copy).

### 12. Fake testimonials — ✅ GOOD (real data only)
- `Testimonials.jsx` fetches `/api/testimonials/featured` with **Loading skeleton + EmptyState** — verified real-data pattern. Keep. (Seed data exists backend-side.)

### 13. Bento grids — ✅ NOT FOUND

### 14. Terminal windows — ✅ JUSTIFIED (one)
- `Docs/EngineeringShowcase.jsx` uses shiki code blocks — that's a developer showcase page, product-appropriate. Keep; it's not a decorative marketing terminal.

### 15. "It's not X, it's Y" — ✅ NOT FOUND (copy sweep)

### 16. Checkmark bullets — ⚠️ EXISTS (minor)
- `CallToAction.jsx:36-38` (`CheckCircle` "Instant Matching / Verified Tutors / Direct Contact"), `WhyChooseUs.jsx` features. Used for real guarantees — acceptable; reduce if the page reads as a bullet template. Low priority.

### 17. Three pricing tiers — ✅ NOT APPLICABLE
- No public pricing tiers; `SubscriptionManagement` (SuperAdmin org plans) is a real backend feature (`plans` module), not fake UI. Keep.

### 18. No real product demos — ✅ GOOD
- Home shows live tutor search (HomeBanner), real tutors (PopularTutors), real testimonials, real AI assistant (PoruaTeaser). No placeholder marketing mockups.

### 19. Soft corner radius — ⚠️ EXISTS (global)
- `--radius: 8px` base; `rounded-2xl` (16px) in 42 page matches; `rounded-[20px]`/`rounded-[22px]` (Testimonials/FAQ cards); `rounded-t-3xl` (Tutors mobile drawer); pill `rounded-full` everywhere.
- **Replacement:** design-system T1 — 0–4px components, 0–6px dialogs, `rounded-full` only for avatars/badges/chips. This is the single highest-impact fix.

### 20. Purple + black — ✅ NOT FOUND (royal blue primary, correct identity)

### 21. No skeleton loaders — ✅ DONE (skeletons + error states)
- `shared/skeletons` (StatCardSkeleton, TableSkeleton…), `Skeleton` in ui, Testimonials skeleton. **Fixed 2026-08-26:** Tutors list had no error state — fetch failure showed misleading "No tutors found". Now renders a dedicated error state with retry (see Status header). Verified loading = skeletons not spinners on Tutors/Tuitions/TutorDetails/Home/dashboards.

### 22. Radial orbs — ⚠️ EXISTS (subtle)
- `.bg-pattern-academic` (radial-gradient dots, `app.css`), `PaymentHistory.jsx:10-12` inline radial dot grid + empty-state grid, Testimonials large quote SVGs (decorative, low opacity — borderline OK).
- **Replacement:** remove dot-grid backgrounds (PaymentHistory rewrite + `.bg-pattern-academic`); keep or remove quote SVGs per taste (they're subtle and on-brand).

### 23. Dot grids — ⚠️ EXISTS (same as #22)
- `.bg-dot-pattern` (`app.css`), `PaymentHistory` inline grids, `bg-pattern-academic`. Remove from page surfaces; never behind text.

### 24. Sparkle icons — ✅ KEEP (AI-appropriate, documented exemption)
- `Sparkles` in 10+ AI-assistant files (`IntentBadge`, `ChatInput`, `SubjectSelector`, `AiAssistantHome`, `AiAssistantTutorTools`, `AiAssistantSettings`, `PoruaTeaser`). For an AI product this is *meaningful* visual language. **Verified 2026-08-26:** the audit's stale premise ("tiny sparkles beside every feature") is false — sparkles are a single pair flanking the AiAssistantHome section-header eyebrow, plus AI-appropriate IntentBadge/ChatInput affordances. Held as KEEP per design-system C5 documented exemption.

### 25. Animated arrows — ⚠️ EXISTS (mild)
- `TuitionCard.jsx:155` (`group-hover/btn:translate-x-0.5`), `OrgHome.jsx:130` (translate-x on hover), `PoruaTeaser` `ArrowRight`. Subtle affordance on CTAs — acceptable at 100–200ms; strip any 300ms+ ones.

### 26. Terms of Service — ✅ FIXED (2026-08-25) — [High]
- `/terms` route + `pages/Terms.jsx` created with honest placeholder structure ("not yet legally reviewed" notice, no fake legal claims) + footer link + sitemap entry + SEO meta. **Open:** product owner should replace template with real counsel copy.

### 27. Privacy Policy — ✅ FIXED (2026-08-25) — [High]
- `/privacy` route + `pages/Privacy.jsx` created with honest placeholder structure ("not yet legally reviewed" notice, no fake legal claims) + footer link + sitemap entry + SEO meta. (`ConnectionPrivacySettings` remains a separate *feature*, correctly distinct from the policy.) **Open:** real counsel copy.

### 28. Hover animations everywhere — ⚠️ EXISTS (pervasive)
- `.card-lift`/`.card-premium-hover`/`.motion-lift`/`.soft-scale`/`.directional-move`/`.reveal-on-hover`/`.magnetic-button` (app.css utility layer), `hover:-translate-y-1`, `hover:scale-105`, `group-hover:scale-110`, `active:scale-95/98`, `btn-primary:hover { transform: translateY(-1px) }` (app.css), `transition-all duration-300` on nearly every card.
- **Replacement:** design-system C5/C6 — keep hover only on interactive controls (buttons/links/rows), 100–200ms, no translate/scale on cards; content must never shift on hover.

### 29. Neon colors — ✅ NOT FOUND

### 30. Basic pastel colors — ⚠️ EXISTS (Home illustrations)
- `Illustration.jsx` pastel gradients (blue-50/indigo-100, amber-50/orange-100, violet-50/purple-100…), avatarColors pastel. Replace with the semantic palette.

---

## Part 2 — Deeper problems (beyond the checklist)

### H1. Visual hierarchy — [High]
- **Where am I / what is this for / primary action:** mostly clear on marketplace pages (PageHeader, CTAs exist). **Problem pages:** `PaymentHistory.jsx` (invented taxonomy, no clear primary action, decorative grid competing with data), `Home` (7+ equal sections, no single dominant message), AiAssistantHome (sparkle-dense).
- **Fix:** PaymentHistory rewritten to standard table + real labels; Home hierarchy pass (one hero statement → one primary CTA → real data sections); remove decorative elements competing with content (dot grids, floating SVGs).

### H2. Spacing — [High]
- Section padding `py-20 md:py-28 lg:py-36` (`.section-rhythm`), `gap-12 lg:gap-16`, `p-10 md:p-14`, `mb-16`, `py-40` (PaymentHistory empty state) — exceeds the mandated 4/8/12/16/20/24/32/40/48/64 scale. **Fix:** design-system T3 scale; cap section rhythm at 48–64px.

### H3. Layout stability — [Medium]
- `scrollbar-gutter: stable` ✓ (good). Watch-items: hover lifts (`.card-lift` translate-y — movement on hover), `active:scale-*` on buttons (no layout shift but motion), scroll-reveal content (`animate-in-up`/`scroll-reveal` — content hidden until JS; if the observer never fires, content stays invisible → **fix: content must render visible without JS**), font-swap shift (Space Grotesk swap — add `font-display: swap` + size-adjust).

### H4. Responsive — [Medium]
- Mobile bottom nav fixed on **all** routes except session/checkout → it overlays `/login`, tutor detail, etc. (IA N1). `Tutors.jsx` mobile drawer `rounded-t-3xl` + `h-[85vh]` — verify no overflow at 320px. Walk at 320/375/430/768/1024/1280/1920 after fixes.

### H5. States — [Medium]
- Covered by design-system S1. Critical: `Tuitions.jsx:351` renders an **Error object as a React child** (the live crash from the earlier session) — must render readable error strings.

### H6. Copy audit — [High]
- `PaymentHistory.jsx`: "Yield Logs", "Professional Node", "Yield Volume", "Zero transaction records detected in current sector", "End-to-end encrypted ledger synchronization" — **invented financial jargon; rewrite as plain, specific copy** ("Payment history", "Tutor", "Amount", "Status", empty state: "No payments yet — your verified payments will appear here").
- `HomeBanner.jsx:144` "Checking live tutor availability..." — good (real).
- Sweep for generic AI phrases ("unlock", "supercharge", "seamless", "cutting-edge") across `src/` and remove.

---

## Part 3 — Final report (required output, after fixes)

The final report after implementation must state, per pattern: existed / removed / intentionally retained + why. **Nothing is marked fixed until verified** in the running app + build. Track in this file's Status header.

---

## Execution order

1. **Design-system audit T1–T6 + C5/C6** (radius, colors, spacing, animation, premium-utilities purge) — unblocks everything. ✅
2. **Anti-vibe quick wins:** PaymentHistory rewrite (copy + dot grids + shadows), Illustration emoji → lucide, blur sweep, Home hierarchy pass. ✅
3. **IA:** D1 payment-history redirect, D2 city canonical, D3 admin-login fold, D4 blog orphan, N1 shell rules, N2 typo.
4. **Terms/Privacy pages (#26/#27)** + footer links. ✅
5. **States/hierarchy verification** + reduced-motion/JS-off pass. ✅ (2026-08-26)

```bash
cd etuitionhub-frontend
npm run lint && npm run build && npm test
grep -rn "backdrop-blur" src/ | wc -l        # → modals/floating shells only
grep -rn "rounded-2xl" src/ | wc -l          # → ~0
grep -rn "Sparkles" src/ | wc -l             # → ≤1 (AI section header)
grep -rn "Yield\|Professional Node\|ledger synchron" src/ | wc -l   # → 0
grep -rn "🏙️\|👨👩👧\|🤖" src/ | wc -l       # → 0
```

---

## Part 3 — Final report per pattern (verified 2026-08-26)

Verification basis: `npm run lint` (clean), `npm run build` (succeeds), `npm test` (25 files / 158 tests pass), plus live-app and grep checks noted inline. **Nothing below is claimed fixed without that verification.**

| # | Pattern | Disposition | Where / why |
|---|---------|-------------|-------------|
| 1 | Harsh gradients | REMOVED | `.bg-layered` purged (C5); decorative gradient fields removed across CallToAction, Testimonials, Home, OrganizationDirectory, ChatSidebarItem, Illustration placeholder → solid `bg-muted/30`/`bg-card`/`bg-primary`. Retained only where functional: shimmer skeletons, sent-message bubble, DynamicIsland teal, categorical AI hover washes. |
| 2 | Generic Lucide icons | KEEP | One consistent lucide set; brand SVGs (PoruaLogo, socials) justified. Verified `AppleUI` buttons use lucide too. |
| 3 | Pure white bg | KEEP | `--background: 210 20% 97%`; cards white → real surface hierarchy. |
| 4 | Rainbow coloring | PARTIALLY REMOVED | `fill-amber-400/500` stars → `fill-warning`; `text-[#2563EB]` → `text-primary` (Tutors/Tuitions sweeps); `bg-[#2563EB]` → `bg-primary`. Retained categorical multi-hue only for AI suggested-actions / FeaturedCategories nav tiles (T2 documented keeps). |
| 5 | Drop shadows | REMOVED (decorative) | `shadow-2xl` on PaymentHistory removed; card shadows → borders/surface contrast; shadows remain only on elevated overlays (dialogs/dropdowns/toasts) and small `shadow-sm/md` on interactive controls. |
| 6 | 3 feature cards in a row | REMOVED (marketing) | Statistics/WhyChooseUs/FeaturedCategories → editorial statement+list layouts. Kept real-data grids (PopularTutors, Testimonials). |
| 7 | Emojis | REMOVED (interface) | Illustration emoji → lucide/SVG; `✓/○` → lucide; toast `🔔`, email `🎉/⚠️`, `📍`, `↓/✦`, `💬🧠` all → lucide. Kept chat reaction picker (real feature). |
| 8 | Liquid glass | REMOVED (cards) | 49 backdrop-blur matches → blur only on modal overlays + floating shells (bottom nav, chat input, DynamicIsland). Card blur stripped. |
| 9 | Em dashes / AI copy | REMOVED | PaymentHistory rewritten to plain labels; WhyChooseUs em-dash list → structured pairs; FAQ/Contact/Checkout/NotFound/AdminAuditLogs copy normalized; `seamless` generic phrase removed from Profile.jsx. |
| 10 | Inter / Space Grotesk | KEEP | Documented identity; `display=swap` + preconnect confirmed. |
| 11 | Colored stripes | REMOVED | Rainbow stripe in CallToAction → `h-1 bg-primary`; PaymentHistory decorative bar removed with rewrite. |
| 12 | Fake testimonials | KEEP (real data) | `/api/testimonials/featured` with skeleton + EmptyState. |
| 13 | Bento grids | KEEP (not found) | None existed. |
| 14 | Terminal windows | KEEP (justified) | EngineeringShowcase shiki code blocks — developer showcase page, product-appropriate. |
| 15 | "It's not X, it's Y" | KEEP (not found) | Copy sweep clean. |
| 16 | Checkmark bullets | KEPT (minor) | CallToAction guarantees are real; low priority, not a template. |
| 17 | Three pricing tiers | KEEP (not applicable) | No public pricing; org plans are a real backend feature. |
| 18 | No real demos | KEEP (good) | Home shows live tutor search, real tutors, real testimonials, real AI assistant. |
| 19 | Soft corner radius | REMOVED | Design-system T1: `--radius` → 4px; `rounded-2xl`/`rounded-[20px+22px]` → `rounded-lg`; dialogs 6px; `rounded-full` only avatars/badges/chips. |
| 20 | Purple + black | KEEP (not found) | Royal-blue primary is correct identity. |
| 21 | No skeleton loaders | REMOVED (gap closed) | Tutors error state added with retry; skeletons verified on Tutors/Tuitions/TutorDetails/Home/dashboards. |
| 22 | Radial orbs | REMOVED | CallToAction 600px glow orb, WhyChooseUs 500px orb, dot grids removed; `.bg-pattern-academic` purged. |
| 23 | Dot grids | REMOVED | `.bg-dot-pattern` removed; PaymentHistory inline grids removed with rewrite. |
| 24 | Sparkle icons | KEEP (AI-exemption) | Verified sparkles only at AiAssistantHome section header + AI affordances — documented C5 exemption. |
| 25 | Animated arrows | KEEP (mild, ≤200ms) | Subtle CTA affordances at capped duration. |
| 26 | Terms of Service | FIXED | `/terms` page with honest placeholder, footer link, sitemap, SEO. Open: real counsel copy. |
| 27 | Privacy Policy | FIXED | `/privacy` page same treatment. Open: real counsel copy. |
| 28 | Hover animations everywhere | REMOVED (cards) | `.card-lift`/`.card-premium-hover`/`.motion-lift`/`.soft-scale`/`.directional-move`/`.reveal-on-hover`/`.magnetic-button` purged (C5); hover on cards → border/color only, no translate/scale; buttons/links keep ≤200ms states. |
| 29 | Neon colors | KEEP (not found) | None. |
| 30 | Basic pastel colors | REMOVED | Illustration pastel gradients → neutral surface; avatar pastels → semantic tokens. |

**Deeper problems (Part 2):** H1 hierarchy ✅ editorialized; H2 spacing ✅ in scale; H3 layout stability ✅ (no JS-hidden content, reduced-motion, `display=swap`); H4 responsive ✅ walk verified; H5 states ✅ Tutors + Tuitions readable errors; H6 copy ✅ PaymentHistory rewritten + generic-phrase sweep.

**Left for follow-up (documented, not this pass):**
- Terms/Privacy real legal copy (product-owner input).
- Dashboard (650 raw colors) + EngineeringShowcase (406) excluded for separate careful passes.
- Bengali i18n of remaining screens (navigation-only today).
- Backend/frontend phase-0 data verification against prod DB (requires user).
- 4.3 Tutor referral program — FLAG, needs product decision.
- IA items D1–D4, N1–N2 (separate audit pass).
