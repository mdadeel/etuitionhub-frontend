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
