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

// Socket.IO URL — use a dedicated service in production (Railway/Fly.io).
// In dev, Socket.IO is embedded in the Express server at API_URL.
// In production, the standalone socket-server (socket-server/index.js) runs
// separately and WebSocket upgrades work without Vercel's serverless constraints.
export const SOCKET_URL = import.meta.env.DEV
    ? API_URL           // dev: embedded in Express
    : 'https://etuitionhub-socket.fly.dev'; // prod: standalone Railway/Fly.io service
