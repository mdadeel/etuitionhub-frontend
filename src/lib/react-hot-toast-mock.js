import React from 'react';

// Global bridge storage
let bridge = null;

export const registerToastBridge = (b) => {
  bridge = b;
};

// Main mock toast function
const toast = (message, options = {}) => {
  if (bridge && bridge.info) {
    bridge.info(message, options);
  } else {
    console.log('[Toast Info Fallback]:', message);
  }
};

// Static helper methods
toast.success = (message, options = {}) => {
  if (bridge && bridge.success) {
    bridge.success(message, options);
  } else {
    console.log('[Toast Success Fallback]:', message);
  }
};

toast.error = (message, options = {}) => {
  if (bridge && bridge.error) {
    bridge.error(message, options);
  } else {
    console.log('[Toast Error Fallback]:', message);
  }
};

toast.warning = (message, options = {}) => {
  if (bridge && bridge.warning) {
    bridge.warning(message, options);
  } else {
    console.log('[Toast Warning Fallback]:', message);
  }
};

toast.loading = (message, options = {}) => {
  if (bridge && bridge.loading) {
    bridge.loading(message, options);
  } else {
    console.log('[Toast Loading Fallback]:', message);
  }
};

toast.dismiss = () => {
  if (bridge && bridge.dismiss) {
    bridge.dismiss();
  } else {
    console.log('[Toast Dismiss Fallback]');
  }
};

// Toaster component (renders nothing, replaces react-hot-toast Toaster)
export const Toaster = () => {
  return null;
};

export { toast };
export default toast;
