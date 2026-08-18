# Design-System Audit & Fix Plan — eTuitionHub Frontend

**Status:** 📝 PLAN ONLY — no code changed yet
**Mandate:** `desgin-system.md` (design-system-first: tokens → primitives → core → composite → pages)
**Scope:** `etuitionhub-frontend/` — tokens, primitives, component sets, animation policy, states, layout stability
**Date:** 2026-08-18

> **Do not claim fixes.** Every item below must be verified against the live app/build before being marked done (per CLAUDE.md `LAST VERIFIED` rule).

---

## 0. Executive summary

The semantic-token *foundation* is already correct: `--background/--foreground/--primary/--muted/--border/...` HSL vars in `src/app.css` mapped through `tailwind.config.js`, shadcn `ui/` primitives, `Skeleton`/`EmptyState`/`ErrorBoundary` shared components, global focus-visible styles, and a `prefers-reduced-motion` block all exist. **The problem is what got layered on top of that foundation:**

1. A parallel **"premium" utility language** in `app.css` (`glass-premium`, `bg-layered`, `bg-elevated`, `bg-dot-pattern`, `btn-illuminate`, `magnetic-button`, `card-lift`, `animate-float/sway/twinkle/robot-idle`…) that directly contradicts the restrained mandate — glass, gradients, dot grids, perpetual animation, 300–600ms durations.
2. **Radius/spacing/typography tokens that don't match the mandated scale** (`--radius: 8px` base, components at `rounded-2xl`/`rounded-[20px]`/`rounded-t-3xl`; section padding up to `py-36`; `text-[9px]` labels).
3. **Duplicate component systems**: shadcn `ui/` + `shared/AppleUI` + dead registry files (`ui/hero-section-8.jsx`, `ui/shuffle-grid.jsx`) + hand-rolled overlay modals that bypass the Radix `ui/dialog`.
4. **Raw colors leaking into components** (`bg-slate-900` Footer, `text-slate-400` MobileBottomNav, `bg-blue-600` SessionRoom, `#f9fafb`/`#0d1117` shiki styles) and into `tailwind.config.js` (`success: '#22c55e'`, `warning: '#f59e0b'`).
5. **Two animation dependency stacks** (`tailwindcss-animate` **and** `tw-animate-css`) + `framer-motion` used only for decorative Home illustrations.

**Order of fixes:** tokens → primitives → component consolidation → animation purge → states/verification. Fix shared code first, never patch page-by-page.

---

## 1. Token audit (fix first — everything depends on this)

### T1. Radius — [High] `src/app.css` + `tailwind.config.js`
- **Mandate:** 0–4px (buttons/inputs/cards/dropdowns), 0–6px dialogs. **Actual:** `--radius: 8px`; `--radius-md 8px`, `--radius-lg 12px`, `--radius-xl 16px`, `--radius-2xl 24px`; components use `rounded-2xl` (16px), `rounded-[20px]` (Testimonials/FAQ), `rounded-[22px]` (Testimonials video card), `rounded-t-3xl` (Tutors mobile drawer), `rounded-full` chips.
- **Fix:** retarget the token scale to `0 / 2 / 4 / 6` (dialogs 6px):
  - `--radius: 4px` (shadcn `lg`), `md: 2px`, `sm: 0`; keep `--radius-sm 4px`, `--radius-md 6px` for dialogs only.
  - Sweep `rounded-2xl` → `rounded-md/lg`, `rounded-[2xpx]` → token classes, `rounded-t-3xl` → `rounded-t-lg`.
- **Verification:** `grep -rn "rounded-2xl\|rounded-\[2" src/` count → 0 (only intentional dialog/`rounded-full` avatars/badges remain); screenshot pass at 320/768/1280.

### T2. Color tokens — [High] `tailwind.config.js` + component raw colors
- **Actual:** `tailwind.config.js` maps `success: '#22c55e'`, `warning: '#f59e0b'` as **raw hex** while `app.css` defines HSL `--success`/`--warning` that tailwind never maps (two sources of truth).
- Raw colors in components: `bg-slate-900` (Footer), `text-slate-400`/`border-slate-300`/`bg-slate-100` (MobileBottomNav), `bg-blue-600`/`text-gray-700` (SessionRoom), `text-amber-500` stars (TutorDetails), `#f9fafb`/`#0d1117`/`#18181b` (app.css shiki blocks), `rgba(37,99,235,…)` shadows (app.css).
- **Fix:** map `success`/`warning` to `hsl(var(--success))`/`hsl(var(--warning))` in tailwind; replace slate/gray/blue/amber raw classes with semantic tokens (`bg-background`, `text-muted-foreground`, `bg-primary`, `text-warning`); move shiki colors into the token layer (`.dark` variant).
- **Verification:** `grep -rn "bg-slate\|text-slate\|bg-gray\|text-gray\|bg-blue-\|text-amber-\|#[0-9a-fA-F]\{6\}" src/` → only token-layer + shiki (tokenized) remain; `npm run build` passes.

### T3. Spacing scale — [Medium] `app.css` + pages
- **Actual:** `--spacing-xs..xl` (4/8/16/24/32) defined but **never wired into tailwind** (config only adds `18`/`22`); pages use arbitrary gaps: `gap-12 lg:gap-16`, `py-20 md:py-28 lg:py-36` (`section-rhythm`), `mb-16`, `p-10 md:p-14`, `py-40` (PaymentHistory empty state).
- **Fix:** extend tailwind `spacing` with the mandated scale (4/8/12/16/20/24/32/40/48/64 as needed — note 12/20/40/48/64 are missing); cap `.section-rhythm` at `py-16 md:py-20`; normalize the outliers listed above to scale values.
- **Verification:** no `gap-[x]`, `p-[x]`, `py-[x]`, `m-[x]` arbitrary values except intentional; grep for `py-20|py-24|py-28|py-36|gap-12|gap-16` → audit each remaining hit.

### T4. Typography — [Medium] `app.css`
- **Actual:** `h1 3.5rem / h2 2.5rem / h3 1.875rem` fixed sizes (no `clamp()`); `text-[9px]`/`text-[10px]`/`text-[11px]` uppercase labels (PaymentHistory, OrgMembers, Navbar CTA `text-[11px]`, MobileBottomNav `text-[9px]`); three font families via blocking `@import` in CSS (Inter + Space Grotesk + JetBrains Mono).
- **Fix:** fluid headlines (`clamp()`); establish label/caption tokens (min 11px, ideally 12px); keep the two-brand-font identity (CLAUDE.md) but move the `@import` to `index.html` with `preload`/`media` so it stops blocking render; drop JetBrains Mono weights to only what shiki uses.
- **Verification:** Lighthouse font-display + FCP; visual pass at 320px (no clipped uppercase labels); grep `text-\[9px\]|text-\[10px\]` → 0.

---

## 2. Primitives / component-system consolidation

### C1. Remove the dead shadcn-registry files — [Low] `src/components/ui/`
- `ui/hero-section-8.jsx`, `ui/shuffle-grid.jsx` — zero references outside their own files (grep-verified). Delete. (Also confirms the earlier `README.md` stale-dep claim: these came from registry pastes.)
- **Verification:** `grep -rn "hero-section-8\|shuffle-grid" src/` → 0; build + lint pass.

### C2. Duplicate `SectionHeader` — [Low]
- Shared `ui/SectionHeader.jsx` exists **and** AiAssistant defines a **local** `function SectionHeader` (`AiAssistant/AssignmentCard.jsx:10`, `LessonPlanCard.jsx:7`). Same name, different API — a "named differently / implemented twice" duplicate.
- **Fix:** make the AiAssistant cards consume the shared `ui/SectionHeader` (extend its props if needed) or rename locally. Prefer extending the shared one.
- **Verification:** grep for `function SectionHeader` → 1 match.

### C3. AppleUI vs shadcn — [Medium] `src/components/shared/AppleUI/` + 6 consumers
- `AppleHeader` (+ `index.jsx` with `glass` button variants) is used by 6 dashboard components while the rest of the app uses shadcn `ui/` + `PageHeader`/`DashboardPageHeader`. Two header/button systems → inconsistent dashboard vs marketplace look.
- **Fix (audit first):** inventory what AppleHeader uniquely provides; consolidate dashboard headers onto `PageHeader`/`DashboardPageHeader` variants; delete `AppleUI/index.jsx` glass variants (or convert to token-based `variant="glass"` if a real need is proven).
- **Verification:** grep `AppleUI` → 0; dashboard pages visually consistent with marketplace pages.

### C4. Hand-rolled overlay modals bypass the Radix Dialog — [Medium] 9+ sites
- `ui/dialog.jsx` (Radix — focus trap, esc, aria) exists but TutorDetails (3 modals), TuitionDetails, ReceiptModal, SessionLogModal, HireRequests, OrgMembers, OrgRoles, SubscriptionManagement, DashSettings each hand-roll `fixed inset-0 … backdrop-blur` overlays with `onClick`-close and no focus management.
- **Fix:** replace with `ui/dialog` (or a shared `ConfirmModal`/`ReceiptModal` where one exists); add focus-trap + esc + `aria-modal` once, in the component.
- **Verification:** axe/devtools accessibility pass on each replaced modal (keyboard: tab order, esc, focus return).

### C5. Foundation vs "premium" utility language — [High] `app.css` `@layer utilities/components`
- The following utilities encode the exact anti-patterns the mandate bans and should be **removed or neutralized** (grep each for usages first; where used, replace usage with token-based styling):
  - Glass: `.glass-premium`, `.bg-elevated` (backdrop-blur)
  - Gradients: `.bg-layered` (gradient-to-b), `.bg-pattern-academic`, `.bg-dot-pattern` (dot grids)
  - Hover-chrome: `.magnetic-button`, `.card-lift`, `.card-premium-hover`, `.hover-border-animate`, `.btn-illuminate`, `.motion-lift`, `.soft-scale`, `.directional-move`, `.reveal-on-hover`, `.card-hover-elevate`
  - Perpetual animation: `.animate-float`, `.animate-sway`, `.animate-twinkle`, `.animate-robot-idle`, `.animate-draw-path`, `.highlight-pulse`, `.animate-bounce-slow`, `.animate-pulse-subtle`, `.animate-cursor-blink`
  - Slow transitions: `.transition-smooth`/`.motion-lift` (300ms), `transition-all duration-300` on hover-lift elements
- Keep: `.container-premium`, `.container-narrow`, `.skeleton-premium`, `.safe-bottom`, `.touch-target`, `.label-uppercase`, `.text-balance`, `.btn-*` → **re-homed onto shadcn `Button` variants** (`variant="primary"`, not `btn-primary` class).
- **Verification:** grep each class across `src/` before removal; after removal build + lint + screenshot pass; no `backdrop-blur` outside modal overlays/dialogs.

### C6. Animation policy — [High] `app.css` + `package.json`
- **Actual:** durations 300–600ms everywhere (`transition-all duration-300` on nearly every element; `duration-500` on the root shell; `animate-in fade-in duration-700` in PaymentHistory/BillingHistory); scroll-reveal animations (`useAnimateOnScroll` + `.animate-in-up`, `.scroll-reveal` with opacity:0 defaults — **content is invisible until JS fires**; reduced-motion block covers `.animate-fade-in-up`/`.animate-scale-in` but not `.animate-in-up`/`.scroll-reveal` — an a11y gap).
- `framer-motion` is imported only by `Home/illustrations/Decoration.jsx` + `SectionDivider.jsx` (decorative) — a heavy library for decoration.
- `tailwindcss-animate` **and** `tw-animate-css` both present (duplicate animation deps).
- **Fix:** cap transition durations at 150–200ms (100–200ms mandate); keep animation only for hover/active/focus/dialog/toast/loading/expand; remove `.scroll-reveal`/`.animate-in-up`-on-scroll (or make them instant and never hide content by default — content must render visible without JS); strip framer-motion from the two illustration components (replace with static SVG); remove the duplicate animate dep; extend the reduced-motion block to **all** animation classes (selectors list, not two).
- **Verification:** `grep -rn "duration-300\|duration-500\|duration-700\|animate-in-up\|scroll-reveal\|framer-motion" src/` → only the 150–200ms set remains; with `prefers-reduced-motion: reduce` + JS disabled, all content visible.

---

## 3. States (Loading / Empty / Error / Success)

### S1. Inventory — [Medium]
- **Already good:** `shared/skeletons` (StatCardSkeleton, TableSkeleton…), `EmptyState`, `SearchEmptyState`, `ErrorBoundary`/`RouteErrorBoundary`, Testimonials has skeleton + EmptyState + real-API fetch.
- **Gaps to verify page-by-page (fix in shared components first):**
  - `Tuitions.jsx:351` renders an **Error object as a React child** (the console crash from the earlier session — `Objects are not valid as a React child`) — error states must render `error.message` strings, never raw objects.
  - Hand-rolled spinner-only loading in several pages (no layout-preserving skeleton): verify `Tutors/Tuitions/TutorDetails/TuitionDetails/Dashboard` lists against `Skeleton` usage.
  - Unauthenticated/permission states: `OrgPermissionGate` exists; verify it's applied on all org routes and that 403s render a human message.
- **Verification:** devtools network throttle (Slow 3G) pass on Home, Tutors, Tuitions, TutorDetails, TuitionDetails, Dashboard; each shows skeleton → data or EmptyState or readable error; no raw `[object Error]`.

---

## 4. Verification checklist (run after fixes)

```bash
cd etuitionhub-frontend
npm run lint && npm run build && npm test
# greps
grep -rn "rounded-2xl\|rounded-\[2" src/ | wc -l          # → ~0
grep -rn "bg-slate\|text-slate\|bg-gray\|text-gray\|#[0-9a-fA-F]\{6\}" src/ | grep -v app.css | wc -l   # → ~0
grep -rn "backdrop-blur" src/ | wc -l                      # → only dialog overlays
grep -rn "framer-motion" src/ | wc -l                      # → 0
grep -rn "duration-300\|duration-500\|duration-700" src/ | wc -l  # → only allowed set
```
Then: live-app inspection at 320 / 375 / 768 / 1280 / 1920; axe pass on 5 key pages; reduced-motion + JS-off visibility check.

---

## 5. Backlog / product decisions needed
- Font identity: keep Inter + Space Grotesk (documented identity) — only fix loading strategy. Confirm no brand reason to switch.
- `.card-premium` is used in several places — decide: migrate to `Card` component (shadcn) rather than keep a bespoke class. (Recommendation: migrate; variant="premium" if needed.)
- AI-assistant "sparkle" icons (`Sparkles` in 10+ AI files): product-appropriate for an AI feature — **keep**, but document as intentional (anti-pattern #24 exemption).
