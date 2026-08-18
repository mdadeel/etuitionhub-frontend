// Firebase configuration for e-tuitionBD
//
// The frontend has NO environment variables — the Firebase WEB config is
// fetched once from the backend's public GET /api/config and applied here.
//
// SECURITY NOTE — Firebase web API key is PUBLIC BY DESIGN.
// The `apiKey` below is the *web* API key (also called "client API key"
// in the Firebase console). It is not a secret: it is bundled into every
// shipped JS bundle, served to every visitor, and trivially extractable
// from the network tab. Firebase security is enforced server-side via
// Firebase Auth + Security Rules (Firestore / Storage / Realtime DB),
// not by hiding the API key.
//
// What actually keeps the project safe:
//   1. App Check (recommended) — verifies requests come from this app,
//      not a bot. Enable in Firebase console + register your reCAPTCHA
//      key. Without it, anyone with the apiKey can hit Firebase Auth
//      endpoints directly.
//   2. Security Rules — Firestore / Storage rules must default to
//      `allow read, write: if false` and only grant access per-user.
//   3. Authorized domains — Firebase Auth only issues tokens for the
//      domains listed in the console (e.g. e-tuitionhub.vercel.app).
//   4. Backend token verification — the backend (FIREBASE_PROJECT_ID)
//      verifies the ID token signature on every privileged request.
//      The apiKey alone cannot forge a valid ID token.
//
// If this key is ever exposed (which it already is, by design), rotate
// it via Firebase console → Project Settings → General → Your apps →
// Web app → `api_key` field → "Regenerate". Note: rotation will sign
// users out (no grace period for the web API key, only for backend
// JWT secrets). Then update `FIREBASE_WEB_API_KEY` in the backend
// environment and redeploy.
//
// See: https://firebase.google.com/docs/api-keys (the official "is
// my API key a secret?" doc) and the project's secret-rotation
// runbook at docs/runbooks/secret-rotation.md.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getClientConfig } from '../config/clientConfig';

let app = null;
let auth = null;
let initPromise = null;

/**
 * Initialize Firebase once from the backend /api/config payload.
 * Cached — concurrent callers share the same promise.
 * @returns {Promise<{ app: object, auth: object }>}
 */
export const initFirebase = () => {
  if (!initPromise) {
    initPromise = getClientConfig()
      .then((config) => {
        const firebaseConfig = config.firebase;
        if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId) {
          throw new Error('Incomplete Firebase config from /api/config');
        }
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        return { app, auth };
      })
      .catch((err) => {
        initPromise = null; // allow retry on next call
        throw err;
      });
  }
  return initPromise;
};

/**
 * Resolves to { app, auth } once Firebase is initialized. Every consumer must
 * await this instead of importing a synchronous `auth` (there is none anymore —
 * the config arrives over the network).
 */
export const getFirebase = () => initFirebase();

/**
 * Lazy-load Firebase Storage — not needed on Login/Register pages.
 * @returns {Promise<Storage>}
 */
export const getStorageLazy = async () => {
  const { app: firebaseApp } = await initFirebase();
  // Dynamic import to avoid bundling firebase/storage on every page
  const { getStorage } = await import('firebase/storage');
  return getStorage(firebaseApp);
};
