// Centralized environment detection
// Replace scattered `e.includes('vercel')` checks with this utility

export const isVercelDeploy = () => {
  return (import.meta.env.VITE_API_URL || '').includes('vercel');
};

export const isProduction = () => {
  return import.meta.env.PROD;
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};
