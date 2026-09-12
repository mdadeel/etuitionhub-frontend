// API Configuration
// The frontend deliberately has NO environment variables — every credential
// lives in the backend and is served via GET /api/config (see clientConfig.js).
// The backend URL is therefore a hardcoded constant:
//   - dev  → local Express server
//   - prod → canonical Vercel backend (change here if the real deployment
//            domain differs, e.g. a custom domain like api.e-tuitionbd.com)
const API_URL = import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://etuitionhub-backend.vercel.app';

export default API_URL;

// Socket.IO URL — use a dedicated service in production (Railway/Fly.io) if deployed.
// In dev, Socket.IO is embedded in the Express server at API_URL.
// If no dedicated socket host is available in production, return null (the app
// automatically falls back to HTTP polling / REST endpoints).
export const SOCKET_URL = import.meta.env.DEV
    ? API_URL           // dev: embedded in Express
    : null;             // prod: null unless custom socket server URL is configured

