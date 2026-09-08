import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';

// Prefetch the backend /api/config as early as possible (the frontend has no
// env vars — Firebase + GA config arrive over the network). Single-flight and
// cached, so auth bootstrap awaits the same promise.
import { getClientConfig } from './config/clientConfig';
getClientConfig().catch(() => {});

// Initialize i18n synchronously so navigation labels and translation dictionaries
// are available immediately when the app shell mounts without suspending.
import './i18n';

// Hydrate TanStack Query with the tutor data prefetched in index.html.
// index.html fires fetch('/api/tutors') before the JS bundle even parses —
// by the time we reach this line, the response may already be done.
// Setting the cache now means PopularTutors + HomeBanner render with data
// on first mount instead of showing a skeleton and waiting for a fresh fetch.
import { queryClient } from './lib/queryClient';
if (window.__ETUITION_TUTORS__) {
    try {
        const raw = window.__ETUITION_TUTORS__.data
            || window.__ETUITION_TUTORS__.tutors
            || window.__ETUITION_TUTORS__;
        const tutors = Array.isArray(raw) ? raw.slice(0, 4) : [];
        if (tutors.length > 0) {
            queryClient.setQueryData(['tutors', 'featured'], tutors);
        }
    } catch { /* hydration optional — never block boot */ }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
