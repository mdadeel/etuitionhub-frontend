import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';

// Defer i18n initialization — only needed when a component calls useTranslation().
// All such components (Navbar, Dashboard, Register) are lazy-loaded, so this
// runs before they render but after the app shell is painted.
import('./i18n');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
