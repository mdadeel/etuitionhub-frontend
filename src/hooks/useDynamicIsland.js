import { useContext } from 'react';
import { DynamicIslandContext } from '../contexts/DynamicIslandContext';

export const useDynamicIsland = () => {
  const context = useContext(DynamicIslandContext);
  if (!context) {
    throw new Error('useDynamicIsland must be used within a DynamicIslandProvider');
  }

  const { showNotification, morph, collapse, activeNotification, queueCount } = context;

  return {
    success: (title, message, options = {}) => {
      showNotification('success', { title, message }, options);
    },
    error: (title, message, options = {}) => {
      showNotification('error', { title, message }, options);
    },
    warning: (title, message, options = {}) => {
      showNotification('warning', { title, message }, options);
    },
    info: (title, message, options = {}) => {
      showNotification('info', { title, message }, options);
    },
    process: (title, percentage, options = {}) => {
      // Dynamic process updates use morph immediately instead of queuing
      morph('process', { title, percentage }, { duration: percentage >= 100 ? 3000 : null, ...options });
    },
    interactive: (contentData, options = {}) => {
      // Interactive notifications might need custom triggers, or infinite duration until action
      showNotification('interactive', contentData, { duration: null, ...options });
    },
    morph: (type, contentData, options = {}) => {
      morph(type, contentData, options);
    },
    collapse: () => {
      collapse();
    },
    activeNotification,
    queueCount,
  };
};
