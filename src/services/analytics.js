import { getClientConfig } from '../config/clientConfig';

const IS_DEV = import.meta.env.DEV;

export function trackEvent(action, label, value) {
  const event = {
    action,
    label: label || '',
    value: value || 1,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  };

  if (IS_DEV) {
    console.log('[analytics]', event);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_label: label,
      value: value,
      page_path: window.location.pathname,
    });
  }
}

export async function trackPageView(path) {
  const url = path || window.location.pathname + window.location.search;

  if (IS_DEV) {
    console.log('[analytics] page_view:', url);
  }

  if (typeof window.gtag === 'function') {
    // GA measurement id comes from the backend /api/config (no frontend env).
    const config = await getClientConfig().catch(() => null);
    window.gtag('config', config?.gaMeasurementId || 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
}
