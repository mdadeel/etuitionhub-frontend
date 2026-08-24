// Client config — fetched once from the backend's public GET /api/config.
// This is how the frontend gets its Firebase web config, GA id and UI flags
// with ZERO environment variables. All values here are public by design.
import API_URL from './api';

let configPromise = null;

/**
 * Returns a promise resolving to the client config:
 * { firebase: { apiKey, authDomain, projectId, storageBucket,
 *               messagingSenderId, appId, measurementId },
 *   gaMeasurementId }
 *
 * Single-flight: concurrent callers share one fetch. On failure the cache is
 * cleared so the next call retries (used by auth bootstrap + retry UI).
 */
export const getClientConfig = () => {
  // The inline bootstrap in index.html already fetched /api/config (for GA4)
  // and cached it — reuse it to avoid a duplicate request on first load.
  if (window.__ETUITION_CONFIG__) {
    return Promise.resolve(window.__ETUITION_CONFIG__);
  }
  if (!configPromise) {
    configPromise = fetch(`${API_URL}/api/config`)
      .then((res) => {
        if (!res.ok) throw new Error(`Config request failed (${res.status})`);
        return res.json();
      })
      .catch((err) => {
        configPromise = null; // allow retry on next call
        throw err;
      });
  }
  return configPromise;
};
