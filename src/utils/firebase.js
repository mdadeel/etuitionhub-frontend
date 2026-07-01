// Firebase configuration for e-tuitionBD
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
// JWT secrets). Then update `VITE_FIREBASE_API_KEY` in your Vercel
// environment variables and redeploy.
//
// See: https://firebase.google.com/docs/api-keys (the official "is
// my API key a secret?" doc) and the project's secret-rotation
// runbook at docs/runbooks/secret-rotation.md.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
};


if (!firebaseConfig.apiKey) {
    console.warn('Firebase API key missing! Create .env.local with VITE_FIREBASE_API_KEY');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Lazy-load Storage — not needed on Login/Register pages
let _storage;
export const getStorageLazy = () => {
  if (!_storage) {
    // Dynamic import to avoid bundling firebase/storage on every page
    return import('firebase/storage').then(({ getStorage }) => {
      _storage = getStorage(app);
      return _storage;
    });
  }
  return Promise.resolve(_storage);
};

export default app;
