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

  if (typeof window.fbq === 'function') {
    window.fbq('track', action, { label, value });
  }
}

export function trackPageView(path) {
  const url = path || window.location.pathname + window.location.search;

  if (IS_DEV) {
    console.log('[analytics] page_view:', url);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}
