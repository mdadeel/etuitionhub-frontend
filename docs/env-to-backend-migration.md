# Plan: Move all frontend env vars to the backend

**Status:** implemented (see verification section)
**Date:** 2026-08-17
**Affected repos:** `etuitionhub-frontend/` (primary), `etuitionhub--backend/`

## Goal

The frontend must have **zero environment variables** — no `.env`, no `VITE_*` reads.
All configuration the frontend needs lives in the backend `.env` and is served to
the browser through a public, read-only `/api/config` endpoint fetched at boot.

## Why this is safe

Everything being moved is **public by design** and is already shipped in the JS
bundle today:

- Firebase **web** config (`apiKey`, `authDomain`, `projectId`, ...) — Firebase
  security comes from server-side ID-token verification (`FIREBASE_PROJECT_ID`
  on the backend), not from hiding the web key.
- Google Analytics measurement ID — public in every page's network tab.
- `showDemoAccounts` — a UI feature flag, not a secret.

The win is **operational**, not security: one source of truth (backend env),
no per-environment frontend builds, no frontend env management on Vercel.
`/api/config` must therefore be unauthenticated and must expose **only** the
public web-config fields — never JWT secrets, SMTP, Cloudinary, Upstash, etc.

## Current frontend env vars → new home

| Frontend var (today) | Used by | New home |
|---|---|---|
| `VITE_API_URL` | `src/config/api.js`, `useSocketEvents.js`, `useChatSocket.js`, `VercelAlert.jsx` | Hardcoded constant in `src/config/api.js` (`import.meta.env.DEV` built-in picks dev URL; production URL hardcoded). **Assumption to verify:** production backend URL `https://etuitionhub-backend.vercel.app` — change in one place if the real deployment domain differs. |
| `VITE_FIREBASE_API_KEY` | `src/utils/firebase.js` | Backend `FIREBASE_WEB_API_KEY` → `/api/config` → `firebase.apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `src/utils/firebase.js` | Backend `FIREBASE_WEB_AUTH_DOMAIN` |
| `VITE_FIREBASE_PROJECT_ID` | `src/utils/firebase.js` | Reuses existing backend `FIREBASE_PROJECT_ID` (same value) |
| `VITE_FIREBASE_STORAGE_BUCKET` | `src/utils/firebase.js` | Backend `FIREBASE_WEB_STORAGE_BUCKET` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `src/utils/firebase.js` | Backend `FIREBASE_WEB_MESSAGING_SENDER_ID` |
| `VITE_FIREBASE_APP_ID` | `src/utils/firebase.js` | Backend `FIREBASE_WEB_APP_ID` |
| `VITE_GA_MEASUREMENT_ID` | `src/services/analytics.js` | Backend `GA_MEASUREMENT_ID` → `gaMeasurementId` (also returned as `firebase.measurementId`) |
| `VITE_SHOW_DEMO_ACCOUNTS` | `src/pages/AdminLogin.jsx` | Backend `SHOW_DEMO_ACCOUNTS` → `showDemoAccounts` |

`import.meta.env.DEV` (Vite built-in, requires no env file) stays in
`analytics.js`, `useChatPolling.js`, `useNotifications.js`.

## Backend changes

1. **`config/index.js`** — add:
   - `firebase.web = { apiKey, authDomain, storageBucket, messagingSenderId, appId }`
     (from `FIREBASE_WEB_*` env vars; `projectId` reused from `FIREBASE_PROJECT_ID`).
   - `ga.measurementId` (from `GA_MEASUREMENT_ID`).
   - `ui.showDemoAccounts` (from `SHOW_DEMO_ACCOUNTS === 'true'`).
   - No new required vars (all optional; endpoint degrades gracefully).
2. **`src/modules/config/routes/configRoutes.js`** (new) — `GET /` returns:
   `{ firebase: { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId }, gaMeasurementId, showDemoAccounts }`.
3. **`server.js`** — mount `app.use('/api/config', publicReadCache, configRoutes)`
   **before** `app.use('/api', ensureDb)` so the endpoint works even if MongoDB is
   down. It still passes `generalLimiter` + helmet + CORS + sanitizers.
4. **`.env` / `.env.example`** — add `FIREBASE_WEB_*`, `GA_MEASUREMENT_ID`,
   `SHOW_DEMO_ACCOUNTS` with values moved from the frontend env.

## Frontend changes

1. **`src/config/api.js`** — replace `VITE_API_URL` with a hardcoded constant:
   `import.meta.env.DEV ? 'http://localhost:5000' : 'https://etuitionhub-backend.vercel.app'`.
2. **`src/config/clientConfig.js`** (new) — single-flight cached `fetch(API_URL + '/api/config')`;
   on failure resets the cache so the next call retries. Used by all consumers.
3. **`src/utils/firebase.js`** — becomes async:
   - `initFirebase()`: fetch config → `initializeApp(config.firebase)` → `getAuth`, cache promise.
   - `getFirebase()`: returns the cached init promise (`{ app, auth }`).
   - `getStorageLazy()`: awaits init, then lazy-imports `firebase/storage`.
   - Remove the synchronous `auth`/`app` exports.
4. **`src/hooks/useAuthActions.js`** — `const { auth } = await getFirebase()` at the top of
   each action (register, login, googleLogin, googleRegister, logout, resetPassword,
   verifyResetCode, confirmReset, updateUserProfile).
5. **`src/hooks/useSessionManager.js`** — inside the listener `useEffect`, `getFirebase()`
   first, then `onAuthStateChanged(auth, ...)`; on failure set `configError` + `loading=false`.
6. **`src/contexts/AuthContext.jsx`** — expose `configError` in the read-only context value.
7. **`src/components/shared/ConfigError.jsx`** (new) — shared "couldn't load app config"
   panel with a retry (reload) button.
8. **`PrivateRoute.jsx` / `PublicRoute.jsx`** — render `ConfigError` when `configError` is set
   (prevents silent redirect loops when Firebase never initializes).
9. **`src/services/api.js`** — `reauthFromFirebase` uses `getFirebase()` instead of importing `auth`.
10. **`src/services/analytics.js`** — GA ID from `getClientConfig()` (fallback `G-XXXXXXXXXX`).
11. **`src/pages/AdminLogin.jsx`** — `showDemoAccounts` from `getClientConfig()` (state + effect).
12. **Socket/URL consumers** — `useSocketEvents.js`, `useChatSocket.js`, `VercelAlert.jsx`
    import `API_URL` from `src/config/api.js` instead of reading `VITE_API_URL`.
13. **`src/index.jsx`** — kick off `getClientConfig()` prefetch at startup.
14. **Delete** `etuitionhub-frontend/.env` and `.env.example`.
15. **`README.md`** — replace the env table with a note pointing to backend `/api/config`.

## Failure modes handled

- `/api/config` unreachable (backend down): Firebase init fails → `configError` →
  route guards show a friendly retry panel; public pages still render.
- Config fetch race on first paint: all consumers await the cached promise
  (`getFirebase()` / `getClientConfig()`), never read module-load state.
- Auth actions called before config resolves: they `await getFirebase()`, so no
  null-auth crashes.

## Verification (2026-08-17 — done)

- Backend: `node --check` passes on `config/index.js`, `server.js`,
  `src/modules/config/routes/configRoutes.js`. (Full `npm test` not run — backend
  `node_modules` not installed locally.)
- Frontend `npm run build`: ✅ (only pre-existing chunk-size warnings).
- Frontend `npm run lint` on all changed files: ✅ (7 pre-existing errors in
  untouched files: `SectionDivider.jsx`, `AiAssistantChat.jsx`, ...).
- Frontend `npm test`: 46/49 pass. 3 failures are pre-existing Shiki WASM
  timeouts in `src/components/AiAssistant/__tests__/test_render.test.jsx`,
  unrelated to this change (no firebase/config imports).
- Source sweep: zero `VITE_*` reads remain in `src/`; the only `import.meta.env`
  uses left are the built-in `DEV` flag (no env file required).
- Not yet verified live: boot backend + `curl /api/config`, then load the app
  and sign in (needs backend deps installed).
