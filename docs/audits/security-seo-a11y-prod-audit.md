# Security / SEO / Accessibility / Production Readiness Audit & Fix — eTuitionHub Frontend

**Status:** 📝 PLAN — in progress
**Mandate:** `Full Security, SEO, Accessibility & Production Readiness Audit-Fix Prompt.md`
**Scope:** `etuitionhub-frontend/` only — backend security is in the sibling repo
**Date:** 2026-08-26

> **Priority order (per mandate):** Critical security → AuthN/AuthZ → Data exposure → Input/injection → Production/runtime → A11y → SEO/crawlability → Performance → Cleanup

---

## 0. Scope notes

This is a **frontend SPA** (React 19 + Vite + Tailwind + Firebase Auth). The backend (`etuitionhub--backend/`) handles server-side authN/Z, DB security, file uploads, rate limiting, CORS, and CSP headers. Frontend audit covers only what lives in this repo:
- Client-side secrets exposure
- Firebase config / `VITE_*` vars
- XSS vectors (dangerouslySetInnerHTML, URL injection)
- Auth pattern review (cookie handling, localStorage)
- Runtime errors, console noise
- SEO: titles, descriptions, OG, Twitter cards, canonical, structured data, headings, lang
- A11y: alt text, labels, keyboard, focus, contrast, landmarks, reduced motion
- Crawlability: sitemap, robots.txt, favicon
- Bundle size, lazy loading, dependency audit
- Production config: Vite config, env vars, build config, source maps
- 404 / routing fallback

---

## 1. Security audit

### 1.1 Secrets & API keys
- [ ] Check `.env` / `.env.example` / `.env.production` for secrets
- [ ] Check `VITE_*` vars — are any private values exposed?
- [ ] Check `src/utils/firebase.js` — Firebase config (public by design, but verify)
- [ ] Check `src/services/api.js` for hardcoded tokens/keys
- [ ] Check `index.html` for inline config/keys
- [ ] Check `vite.config.js` for env handling
- [ ] Search entire src/ for hardcoded `sk-`, `api_key`, `secret`, `password`, `token`

### 1.2 Authentication & sessions
- [ ] Verify Firebase config is public-only (API key, project ID, auth domain — these are safe)
- [ ] Verify no session tokens in localStorage
- [ ] Verify JWT cookie handling (HttpOnly/Secure is backend's job, but check frontend doesn't read it)
- [ ] Check logout clears state correctly
- [ ] Check `PrivateRoute` / `PublicRoute` / `AdminRoute` guard logic

### 1.3 XSS & injection (frontend)
- [ ] Search for `dangerouslySetInnerHTML`
- [ ] Search for `innerHTML` assignments
- [ ] Search for `document.write`
- [ ] Search for `eval(` / `new Function(`
- [ ] Check URL/href injection vectors (user-supplied URLs in `<a href>`)
- [ ] Check rich-text rendering (if any)

### 1.4 Dependencies
- [ ] Run `npm audit` for known vulnerabilities
- [ ] Check for unused dependencies
- [ ] Check for duplicate icon/animation libraries

---

## 2. Production / runtime audit

### 2.1 Source rendering
- [ ] Review `index.html` — meaningful meta tags, lang, script loading
- [ ] Verify SPA fallback is configured for Vercel

### 2.2 Routing
- [ ] Verify 404 page works
- [ ] Verify direct navigation to nested routes works

### 2.3 Runtime errors
- [ ] Run build and check for warnings
- [ ] Check for console.log remnants in production code

### 2.4 Source maps
- [ ] Check Vite config for sourcemap generation in production

### 2.5 Production config
- [ ] Check `vite.config.js` for dev-vs-prod settings
- [ ] Check `vercel.json` for routing/headers
- [ ] Check environment variable validation

---

## 3. SEO & metadata audit

### 3.1 Titles
- [ ] Every public page has a unique `<title>` via `<SEO>` component
- [ ] Inventory all pages and their SEO titles

### 3.2 Meta descriptions
- [ ] Every public page has a meaningful description

### 3.3 Open Graph / Twitter
- [ ] Check OG tags in `<SEO>` component
- [ ] Verify `og:image` points to a real asset
- [ ] Add Twitter card tags where missing

### 3.4 Canonical URLs
- [ ] Check canonical URL implementation
- [ ] Verify correct production domain

### 3.5 Structured data (JSON-LD)
- [ ] Check if any pages have structured data
- [ ] Add where appropriate (Organization, WebSite, BreadcrumbList)

### 3.6 Headings
- [ ] Check H1 presence on every page
- [ ] Check heading hierarchy (H1 → H2 → H3)

### 3.7 Language
- [ ] Verify `lang` attribute on `<html>`
- [ ] Check it updates with i18n locale

---

## 4. Crawlability

### 4.1 Sitemap
- [ ] Verify `sitemap.xml` is valid and complete
- [ ] Remove any orphaned entries (already done: `/blog`)

### 4.2 Robots.txt
- [ ] Verify `robots.txt` is correct
- [ ] Check sitemap reference

### 4.3 Favicon
- [ ] Verify favicon loads
- [ ] Check for broken favicon requests

---

## 5. Accessibility audit

### 5.1 Images
- [ ] Search for `<img>` without `alt`
- [ ] Check decorative images use `alt=""`

### 5.2 Labels & names
- [ ] Check icon-only buttons have aria-labels
- [ ] Check form controls have labels
- [ ] Check interactive elements have accessible names

### 5.3 Keyboard & focus
- [ ] Check visible focus states
- [ ] Check dialog focus management
- [ ] Check skip-to-content link

### 5.4 Headings & landmarks
- [ ] Check heading hierarchy
- [ ] Check landmark regions (nav, main, banner, etc.)

### 5.5 Color contrast
- [ ] Spot-check key text/background combinations

### 5.6 Reduced motion
- [ ] Verify `prefers-reduced-motion` is respected (already done in anti-vibe sweep)

---

## 6. Bundle & performance audit

### 6.1 Bundle analysis
- [ ] Record production build sizes (before)
- [ ] Identify largest chunks
- [ ] Check for unnecessary dependencies
- [ ] Check for code splitting / lazy loading

### 6.2 Performance
- [ ] Check for large libraries loaded on every page
- [ ] Verify lazy loading of heavy routes (AI Assistant, dashboard)

---

## 7. Verification

```bash
cd etuitionhub-frontend
npm run build
npm run lint
npm test
npm audit
```

---

## 8. Report format

### Fixed
### Not Applicable
### Requires External Action
### Remaining Risks
### Verification results