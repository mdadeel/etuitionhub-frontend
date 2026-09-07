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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
