# Design-System Audit & Fix Plan — eTuitionHub Frontend

**Status:** ✅ DONE — T1/T2/T3/T4/C6 complete 2026-08-25
- **Done & verified (lint+build+tests green 2026-08-25):** T1 radius retarget — config tokens (`--radius: 4px`, `lg: var(--radius)`, `md: calc(-2)`, `sm: calc(-4)`, `xl/2xl/3xl: 6px`) **+ component sweep**: ~101 instances across 37 files → content-tier `rounded-lg` (4px); modal/overlay shells kept at 6px; `DynamicIsland`, `ui/command|dropdown-menu|input-group|skeleton`, `EngineeringShowcase`, `MessageBubble`, `dialog.jsx` untouched. T2 color consolidation **done** — config `success`/`warning` → `hsl(var(--success))/hsl(var(--warning))`; shared-component sweep (Footer `bg-slate-900`→`bg-footer`, MobileBottomNav, avatar.jsx, ThemeToggle, SessionRoom blue/red/green controls→`primary`/`destructive`/`success`, Stat.jsx, TutorCard/TuitionCard, AppleUI) + **3 bulk deterministic sweeps (node scripts, 441 substitutions across ~60 files)** + final sweep of remaining raw hex/stacked-opacity artifacts (78 more across 11 files: `#2563EB`/`#1D4ED8`→`primary`, `#0F172E`→`footer`, `#94A3B8`→`muted-foreground`, `#E2E8F0`→`border`, stacked `success|warning/N/M`→single-opacity, TutorDetails dark rose/red badges→`destructive` family, `ring-offset-slate-950`→`ring-offset-background`). C6 animation cap in config (250/300/500/700 → 200ms); C5 premium-utility purge → `transition-smooth` (150ms) + `animate-cursor-blink` (AI loading cursor) intentionally retained; C1 dead registry files deleted.
- **T3 spacing scale done (2026-08-25):** config already retains 12/20/40/48/64 via Tailwind defaults (extend only adds 18/22); `section-rhythm` class doesn't exist in codebase. Normalized 7 off-scale section outliers: `py-20 md:py-28`→`py-16 md:py-24` (CallToAction, FAQ), `py-10 md:py-14`→`py-12 md:py-16` (Statistics), `p-10 md:p-14`→`p-10 md:p-16` (PaymentSuccess, BecomeTutor), `mt-14`→`mt-16` (PaymentHistory). One intentional `p-14` in Navbar fixed overlay — kept (it's a `top-14` off-by-one, not a spacing-scale issue).
- **T4 typography done (2026-08-25):** fonts already load via `index.html` preconnect + stylesheet + `display=swap` (no CSS `@import` — audit premise already satisfied); swept `text-[9px]`/`text-[10px]` → `text-[11px]` (65 files, 0 in-scope remaining; protected subsystems excluded); h1/h2/h3 now `clamp()` fluid (320→1920px). Lint+build+tests green.
**Mandate:** `desgin-system.md` (design-system-first: tokens → primitives → core → composite → pages)
**Scope:** `etuitionhub-frontend/` — tokens, primitives, component sets, animation policy, states, layout stability
**Date:** 2026-08-18 (updated 2026-08-25)

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

**Dark-surface judgment (2026-08-25):** deliberate standalone designs KEPT — `DynamicIsland` (own Apple-style palette incl. `rounded-[20px]`, `#020202`), `ui/tooltip` (standard always-dark shadcn), `chat/MessageBubble` (own bubble palette, `from-[#3B82F6] to-[#2563EB]` sent gradient — messaging-redesign surface, T1 do-not-touch list), `pages/SessionRoom` dark video room (grays kept as the room theme; only its blue/red/green controls were retargeted to `primary`/`destructive`/`success`). Genuine leaks FIXED — `TutorCard`/`TuitionCard` save-button icon surface (`bg-slate-100/80 dark:bg-slate-900/80` → `bg-muted/80`), `AppleUI` muted button (`dark:bg-slate-900/40 dark:text-slate-400` → `dark:bg-muted/40 dark:text-muted-foreground`). Known dead class flagged (not fixed, outside T1 do-not-touch scope): `chat/MessageBubble.jsx:418` `border-slate-150` — no such Tailwind step, renders no border.

**Categorical / brand / code-theme colors KEPT (2026-08-25):** no semantic token exists (or one would be wrong) for these, so they stay as intentional raw classes:
- **Categorical multi-hue** — `FeaturedCategories` (6 category hues: teal/rose/pink/orange/cyan + slate icon), `SuggestedActions` (7 AI-action hues), `IntentBadge` (teal/indigo intent chips), `ActivePanel` (cyan accent), `TuitionCard` "Both" chip (teal, sits beside `primary` Online / `success` Home chips — teal is the 3rd categorical member, not a leak).
- **Brand colors** — `WhatsAppShareButton` (`#25D366`/`#1DA851` WhatsApp brand green), `Checkout` payment badges (`#D12053` bKash / `#F7941D` Nagad / `#8C3494` Rocket).
- **Shiki code-block theme** — `AiAssistant/CodeBlock|SyntaxHighlighter|MarkdownRenderer` (`bg-zinc-50 dark:bg-[#0d1117]` is the code-surface palette, mirrors app.css shiki token layer; the app.css shiki hex themselves were already tokenized — only comments remain).
- **`ui/Section` `dark` variant** now `bg-footer` (was `bg-[#0F172E]` — mapped since `--footer` is the same navy `222 47% 11%`); variant is currently unused but kept for parity.

### T3. Spacing scale — [Medium] `app.css` + pages — **DONE 2026-08-25**
- **Actual:** `--spacing-xs..xl` (4/8/16/24/32) defined but **never wired into tailwind**; config only adds `18`/`22` — but Tailwind **defaults are retained** (extend merges, doesn't replace), so `12/20/40/48/64` all exist. `section-rhythm` class does **not** exist anywhere. Audit's premise was stale.
- **Fix (applied):** normalized the 7 genuinely off-scale section outliers to mandate values (`py-28`→`py-24`, `py-14`→`py-16`, `p-14`→`p-16`, `mt-14`→`mt-16`); unified Home section rhythm to `py-16 md:py-24` (CallToAction, FAQ, Statistics).
- **Verification:** `grep p|m|gap-[14|28|36|44|52|56|60|72|80|96]` → 0 in scope (only intentional `top-14` Navbar overlay offset remains — positional, not rhythm); lint+build+tests green.

### T4. Typography — [Medium] `app.css` — **DONE 2026-08-25**
- **Actual (corrected):** no blocking `@import` — fonts already load via `index.html` `<link rel="preconnect">` + Google Fonts stylesheet with `display=swap`; h1 3.5rem / h2 2.5rem / h3 1.875rem were fixed-size; `text-[9px]`/`text-[10px]` labels existed (below the 11px floor).
- **Fix (applied):** h1/h2/h3 → `clamp()` fluid (`clamp(2rem,1rem+3.2vw,3.5rem)` / `clamp(1.5rem,1.1rem+1.8vw,2.5rem)` / `clamp(1.25rem,1.05rem+1vw,1.875rem)`); swept all `text-[9px]`→`text-[11px]` and `text-[10px]`→`text-[11px]` across 65 files (in-scope count → 0; Dashboard/Docs/MessageBubble/DynamicIsland/SVG illustrations excluded as separate subsystems).
- **Verification:** grep `text-[9px]|text-[10px]` → 0 in scope; `clamp()` present; fonts verified non-blocking in index.html; lint+build+tests green.

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

**C6 DONE 2026-08-25 — verified against config, source, and build:**
- **Duration cap enforced globally:** `tailwind.config.js` `transitionDuration` map retargets 250/300/500/700 → 200ms (extend overrides same-key defaults), so every `duration-300/500/700` class — including `animate-in fade-in duration-700` page entrances (Blog, Checkout, AdminAuditLogs, AiAssistantSettings) — emits 200ms. The 9 source-level `animate-in…duration-3/5/700` matches are all functionally 200ms.
- **Dead classes removed:** `animate-pulse-subtle` (ChatInput usage-quota Zap icon), `animate-spin-slow` (PostTuition publish spinner — `animate-spin` retained), `duration-355` (FloatingChat — not in the duration map, generated nothing → the open transition was instant; now `duration-200`). `animate-bounce-slow` already purged in C5.
- **Unused over-cap config entry capped:** `slide-up` 250ms → 200ms (unused anywhere, but kept aligned to policy).
- **Perpetual animation = loading indicators only:** `animate-bounce` (AI typing dots ×3), `animate-spin` (submit/publish), `animate-ping` (FeaturedCategories/HomeBanner/Home radial pulse), `animate-cursor-blink` (AI loading cursor), `animate-shimmer`/`animate-[shimmer…]` (skeletons), `animate-pulse` + `animate-duration-1000` (ChatSidebarItem unread-count badge — notification signal, documented). All legitimate per mandate.
- **Entrances:** `animate-fade-in-up`/`animate-scale-in` (app.css, 200ms forwards, ends visible) + tailwindcss-animate `animate-in fade-in zoom-in…` on dialog/popover/tooltip/select — dialog/toast/expand set, all reduced-motion safe.
- **Already satisfied (verified, no change needed):** framer-motion absent from package.json/src; tw-animate-css absent (tailwindcss-animate retained — it powers the Radix dialog/popover entrances); `useAnimateOnScroll` returns a plain `useRef(null)` (no class mutation, never hides content); zero `.scroll-reveal`/`.animate-in-up`-on-scroll content-hiding classes; app.css `prefers-reduced-motion` block uses a universal `*` selector + explicit `opacity: 1`/`transform: none` for all entrance classes, covering every animation.
- **Verify:** lint clean, build passes, 25 test files / 158 tests green.

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
