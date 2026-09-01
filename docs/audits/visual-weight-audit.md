# Visual Weight Audit & Fix Plan

**Date:** 2026-08-25
**Scope:** Frontend homepage + shared components
**Issue:** UI feels bulky and heavy
**Verdict:** 7 systemic causes identified, 8-phase fix plan

---

## Root Causes

### 1. Hero Section is Massive
- `min-h-[85vh]` on `HomeBanner` — nearly full viewport on laptop
- 4 content blocks inside: heading + subtitle, search card (3 dropdowns + button + trust badges), tutor card carousel, bottom stats bar
- Global `h1` forced to `3.5rem / line-height: 0.95` + per-component overrides to `text-5xl lg:text-7xl`
- On a 900px laptop: barely room to see the search form without scrolling

### 2. Eight Decorative Section Dividers Add Dead Space
- `Home.jsx` inserts 8 `<SectionDivider>` SVGs between sections
- Each is `h-6` to `h-14` plus margins — ~80-120px total dead whitespace
- Pure decorative, invisible to the eye but the body scrolls past them
- Variants: `paper-path`, `book-edge`, `campus-skyline`, `learning-route`, `notebook-tear`, `minimal-wave`

### 3. Two Competing Card Systems
- `src/components/ui/card.jsx` — shadcn-style, `rounded-xl`, 4 variants (default/elevated/subtle/dark)
- `src/components/shared/AppleUI/index.jsx` — `AppleCard`, `rounded-none`, separate variant logic
- `FeaturedCategories` uses no Card wrapper but has its own 6-layer hover system
- `HomeBanner` uses `<Card>` with `rounded-xl`
- `WhyChooseUs` uses raw `div` with `rounded-xl border`
- `Statistics` uses `rounded-2xl`
- No consistent shape = visual chaos = bulk

### 4. Shadow System is Over-Amplified
Three shadow tiers in `tailwind.config.js` (`premium`, `premium-md`, `premium-lg`) plus CSS utility classes in `app.css` (`shadow-premium`, `shadow-premium-lg`) plus inline shadows throughout:
- Hero search card: `shadow-[0_20px_50px_rgba(0,0,0,0.05)]` — 50px blur
- Tutor card stack: `shadow-[0_20px_40px_rgba(0,0,0,0.06)]`
- TutorCard hover: `shadow-[0_0_20px_hsl(var(--primary)/0.15)]` — colored glow
- MobileBottomNav: `shadow-[0_-4px_20px_rgba(0,0,0,0.03)]`
- FloatingChat window: `shadow-lg`

Multiple overlapping shadows create muddy, heavy visual weight.

### 5. Excessive Border + Ring + Background Layering
Components stack border + ring + background tint on the same element:
- `FeaturedCategories` CategoryCard: **6 overlay layers** (gradient bg, border color, ring, tag badge, icon bg, content bg)
- TutorCard bookmark/compare buttons: double-wrapped (`button > div > icon`) with separate bg/border/hover states
- `FeaturedCategories` header pill: `border border-primary/20 bg-primary/5` + inner animated dot + text — 3 layers for a label
- Footer social links: `bg-white/5 border-white/10` — each link has its own card-like treatment

Every interactive element has a border, a background, a hover shadow, AND an active scale transform — 4 state layers where 2 would suffice.

### 6. Typography Scale is Flat + Heavy
- `h1` global: `3.5rem / 0.95 / font-weight: 700` — but `HomeBanner` overrides to `text-5xl lg:text-7xl` with `font-bold`
- `h2` global: `2.5rem / 1.05 / 600` — every section overrides to `text-2xl md:text-3xl` or `text-3xl md:text-4xl`
- Body text: `font-medium` / `font-semibold` / `font-bold` everywhere — no thin/light weight for relief
- `font-label` applies `uppercase tracking-widest` to many labels — makes every label feel like a billboard
- `Space Grotesk` at 700/900 weight is inherently heavy
- **No visual relief** — nothing is light enough to contrast against the headings

### 7. Five Redundant Trust Signal Blocks
The homepage repeats "we're trustworthy, tutors are verified" in 5 separate visual treatments:
1. Hero badge: "Bangladesh's #1 Tutor Marketplace" (animated ping dot + badge)
2. Hero search card bottom: "Verified Credentials / Direct Messaging / No Platform Fees"
3. Hero bottom stats: "Verified tutors online / ID-verified Every tutor"
4. `FinalTrustStrip`: "Verified / Direct contact"
5. `WhyChooseUs`: 3 feature cards with sub-feature checkmarks

Same message, 5 visual treatments, cumulative weight.

---

## Fix Plan

### Phase 1: Hero Section — Slim Down
**Files:** `src/components/Home/HomeBanner.jsx`, `src/app.css` (global h1)

| Change | Before | After |
|--------|--------|-------|
| Hero height | `min-h-[85vh]` | `min-h-[60vh] lg:min-h-[70vh]` |
| Heading scale | `text-5xl lg:text-7xl` | `text-4xl lg:text-5xl` |
| Global h1 | `3.5rem` hardcoded in app.css | Remove global override; let components control their own h1 |
| Search card padding | `p-6` | `p-4 md:p-5` |
| Trust badges row | 3 badges below search | Remove — trust is stated 4 other places |
| Bottom stats bar | 2 stat blocks with icons | Remove entirely — stats are in `FinalTrustStrip` |
| Tutor card carousel max-height | `h-[340px] sm:h-[400px] md:h-[420px]` | `h-[280px] sm:h-[320px] md:h-[360px]` |
| Gap between content and search | `space-y-10` | `space-y-6` |

**Net effect:** ~30vh reclaimed. Hero fits above the fold on most laptops.

---

### Phase 2: Remove Section Dividers
**File:** `src/pages/Home.jsx`

Delete all 8 `<SectionDivider>` imports and usages:
```
<SectionDivider variant="paper-path" />
<SectionDivider variant="book-edge" />
<SectionDivider variant="campus-skyline" />
<SectionDivider variant="learning-route" />
<SectionDivider variant="notebook-tear" />
<SectionDivider variant="minimal-wave" />
```

Also remove the import:
```js
import SectionDivider from '../components/Home/illustrations/SectionDivider';
```

The file `src/components/Home/illustrations/SectionDivider.jsx` stays (it's a reusable utility), but Home.jsx no longer uses it.

**Net effect:** ~100-120px of dead space removed from the page scroll.

---

### Phase 3: Unify Card System
**Files:** `src/components/shared/AppleUI/index.jsx`, `src/components/Home/FeaturedCategories.jsx`, `src/components/Home/WhyChooseUs.jsx`, `src/components/Home/Statistics.jsx`

#### 3a. Remove AppleUI from global use
- `AppleCard`, `AppleButton`, `AppleInput`, `AppleBadge`, `AppleHeader` are only used in a handful of dashboard pages
- Mark them as `@deprecated` in a comment — do NOT delete yet (dashboard pages still import them)
- Stop any new Home page imports from using them

#### 3b. Standardize Home page card shapes
| Component | Current shape | Target |
|-----------|--------------|--------|
| CategoryCard (FeaturedCategories) | No wrapper, `rounded-lg`, 6-layer hover | `rounded-lg` (keep), simplify to: border + bg, hover: border-primary/30 only |
| Search card (HomeBanner) | `<Card>` with `rounded-xl` | `rounded-lg` — match category cards |
| Feature cards (WhyChooseUs) | `rounded-xl border` | `rounded-lg border` |
| Statistics cards | `rounded-2xl` | `rounded-lg` |
| Testimonial cards | `rounded-lg border` | Already correct |

**Target radius:** `rounded-lg` (6px) everywhere on the Home page. No `rounded-xl`, no `rounded-2xl`.

#### 3c. Simplify CategoryCard hover
Remove the 6-layer hover system:
```jsx
// REMOVE these overlay divs from each CategoryCard:
<div className="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 ..." />
<div className="pointer-events-none absolute inset-0 rounded-lg border border-transparent ..." />
<div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ..." />
```

Replace with simple CSS:
```jsx
// Single hover state on the card div:
className="... hover:border-primary/30 hover:shadow-sm transition-all duration-200"
```

---

### Phase 4: Flatten Shadow System
**Files:** `src/app.css`, `tailwind.config.js`, multiple component files

#### 4a. Shadow tokens
Keep only ONE tier:
```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
```

Remove from `tailwind.config.js`:
```js
// DELETE these:
'premium': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
'premium-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
'premium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
```

Remove from `app.css`:
```css
/* DELETE these: */
.shadow-premium { ... }
.shadow-premium-lg { ... }
```

#### 4b. Kill inline mega-shadows
Find and replace all `shadow-[0_*px_*px_...]` with `shadow-sm` or remove entirely:
- `HomeBanner` search card: `shadow-[0_20px_50px_rgba(0,0,0,0.05)]` → `shadow-sm`
- Tutor card stack wrappers: `shadow-[0_20px_40px_rgba(0,0,0,0.06)]` → `shadow-sm`
- TutorCard hover: `hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]` → `hover:shadow-sm`
- MobileBottomNav: `shadow-[0_-4px_20px_rgba(0,0,0,0.03)]` → `border-t` only (remove shadow)
- FloatingChat: `shadow-lg` → `shadow-sm`
- FloatingChat header: `shadow-sm` → keep

#### 4c. Clean up remaining `shadow-premium-*` references
Grep for `shadow-premium` and replace with `shadow-sm` across:
- TutorCard
- FeaturedCategories
- Testimonials
- CallToAction

**Rule:** No element on the page should have a shadow blur radius > 6px.

---

### Phase 5: Reduce Border/Ring/Background Stacking
**Files:** `src/components/Home/FeaturedCategories.jsx`, `src/components/shared/TutorCard.jsx`, `src/components/shared/Footer.jsx`, `src/components/shared/Navbar.jsx`

#### 5a. CategoryCard simplification
Each card currently has:
1. Card div: `border border-border/70 bg-card`
2. Gradient overlay div (absolute)
3. Border overlay div (absolute)
4. Ring overlay div (absolute)
5. Tag badge
6. Content div

**After:** Card div with border + bg + single hover state. Remove all 3 overlay divs.

#### 5b. TutorCard button simplification
Current bookmark button:
```jsx
<button className="... size-11 ...">
  <div className="size-8 ... bg-slate-100/80 hover:bg-primary/10 ...">
    <Bookmark size={16} />
  </div>
</button>
```

**After:** Flatten to single element:
```jsx
<button className="size-8 flex items-center justify-center rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
  <Bookmark size={16} className={cn(isSaved && "fill-primary text-primary")} />
</button>
```

Apply same treatment to compare button.

#### 5c. Footer social links
Current: each link has `bg-white/5 border-white/10` (card treatment for a 36px icon button).
**After:** Remove bg and border. Use `text-white/40 hover:text-white hover:bg-white/10 rounded-lg` — just color shift on hover.

#### 5d. FeaturedCategories header pill
Current: `border border-primary/20 bg-primary/5` + animated ping dot + text
**After:** `bg-primary/5 text-primary` — no border, no animated dot. The pill is a label, not a live status indicator.

---

### Phase 6: Fix Typography Hierarchy
**Files:** `src/app.css`, `src/components/Home/HomeBanner.jsx`, `src/components/Home/FeaturedCategories.jsx`, `src/components/Home/WhyChooseUs.jsx`, `src/components/Home/FAQ.jsx`, `src/components/Home/CallToAction.jsx`, `src/components/Home/Testimonials.jsx`

#### 6a. Remove global h1/h2/h3 hard-sizes from app.css
The global rules force every h1/h2/h3 to specific sizes, but every component overrides them anyway. This creates confusion and inconsistency.

**Remove from app.css `@layer components`:**
```css
h1 { font-size: 3.5rem; line-height: 0.95; ... }
h2 { font-size: 2.5rem; line-height: 1.05; ... }
h3 { font-size: 1.875rem; line-height: 1.15; ... }
```

**Replace with:**
```css
h1 { @apply font-semibold; font-family: 'Space Grotesk', system-ui, sans-serif; }
h2 { @apply font-semibold; font-family: 'Space Grotesk', system-ui, sans-serif; }
h3 { @apply font-semibold; font-family: 'Space Grotesk', system-ui, sans-serif; }
```

Let each component control its own size via Tailwind classes.

#### 6b. Reduce heading sizes on Home page
| Component | Before | After |
|-----------|--------|-------|
| Hero h1 | `text-5xl lg:text-7xl` | `text-4xl lg:text-5xl` |
| FeaturedCategories h2 | `text-2xl md:text-3xl` | `text-xl md:text-2xl` |
| PopularTutors h2 | `text-2xl` | `text-xl md:text-2xl` |
| WhyChooseUs h2 | `text-2xl md:text-3xl` | `text-xl md:text-2xl` |
| PoruaTeaser h2 | `text-3xl md:text-4xl lg:text-5xl` | `text-2xl md:text-3xl lg:text-4xl` |
| Testimonials h2 | `text-2xl md:text-3xl lg:text-4xl` | `text-xl md:text-2xl lg:text-3xl` |
| FAQ h2 | `text-3xl md:text-4xl` | `text-2xl md:text-3xl` |
| CallToAction h2 | `text-3xl md:text-5xl lg:text-6xl` | `text-2xl md:text-4xl lg:text-5xl` |

#### 6c. Introduce weight contrast
- Section headings: `font-semibold` (600) — NOT `font-bold` (700)
- Hero heading: `font-bold` (700) — keep, it's the one exception
- Body text: `font-normal` (400) — remove `font-medium` overrides
- Labels/badges: `font-medium` (500) — not `font-bold`
- Sub-headings in cards: `font-semibold` (600)

**Rule of thumb:** Only 1 element per viewport should be `font-bold` or heavier.

#### 6d. Reduce label uppercase tracking
`font-label` and `.label-uppercase` use `tracking-widest` / `0.06em`. This makes every label shout.
**After:** `tracking-wider` (0.05em) for section eyebrows, no uppercase on card labels.

---

### Phase 7: Deduplicate Trust Signals
**Files:** `src/components/Home/HomeBanner.jsx`, `src/components/Home/FinalTrustStrip.jsx`, `src/components/Home/WhyChooseUs.jsx`

#### 7a. Keep ONE hero trust indicator
- **Keep:** Hero badge ("Bangladesh's #1 Tutor Marketplace") — it's the positioning statement
- **Remove:** Search card bottom trust badges (Verified Credentials / Direct Messaging / No Platform Fees) — redundant
- **Remove:** Hero bottom stats bar (Verified tutors online / ID-verified) — redundant

#### 7b. Keep FinalTrustStrip as the single footer trust bar
- It's compact, minimal, appears once at the bottom — this is the right place
- No changes needed

#### 7c. WhyChooseUs — reframe as features, not trust
The 3 cards already say "Why parents trust us" with feature details. That's fine — it's a feature section, not a trust badge repetition. No change needed here.

**Net result:** Trust signals reduced from 5 → 3 (hero badge, WhyChooseUs features, FinalTrustStrip). Each serves a distinct purpose.

---

### Phase 8: Verify
After all changes:

1. **Build:** `cd etuitionhub-frontend && npm run build` — must pass with no errors
2. **Lint:** `npm run lint` — must pass
3. **Test:** `npm test` — must pass
4. **Visual spot-check:**
   - Hero fits above fold on 1280x800 viewport
   - No section divider dead space
   - Category cards have clean hover (no multi-layer overlay flash)
   - Shadows are subtle and consistent
   - Typography has clear hierarchy (1 bold thing per viewport, rest is medium/normal)
   - Trust signals appear exactly 3 times with distinct roles
   - No horizontal overflow on mobile (320px)
   - Dark mode still works (no broken contrast)

---

## Estimated Impact

| Metric | Before | After |
|--------|--------|-------|
| Homepage scroll length | ~8-9 viewport heights | ~6-7 viewport heights |
| Hero height | 85vh | 60-70vh |
| Dead decorative space | ~120px | 0px |
| Shadow blur max | 50px | 6px |
| Card hover layers | 6 | 1-2 |
| Trust signal repetitions | 5 | 3 |
| Bold elements per viewport | 6-8 | 2-3 |

---

## Execution Order

1. **Phase 2** (Section Dividers) — zero risk, instant win
2. **Phase 4** (Shadows) — low risk, high impact
3. **Phase 1** (Hero) — medium risk, highest impact
4. **Phase 6** (Typography) — medium risk, high impact
5. **Phase 5** (Border/ring stacking) — medium risk, medium impact
6. **Phase 3** (Card unification) — higher risk, medium impact
7. **Phase 7** (Trust dedup) — low risk, low impact
8. **Phase 8** (Verify) — required after each phase
