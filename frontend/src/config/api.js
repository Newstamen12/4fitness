// 1. Define your fallback URLs for development and production
const DEV_BACKEND = 'http://localhost:4000';
const PROD_BACKEND = 'https://fourfitness-backend.onrender.com';

// 2. Set fallbackBase dynamically based on the environment build mode
const fallbackBase = import.meta.env.PROD ? PROD_BACKEND : DEV_BACKEND;

// 3. Prioritize the Vercel environment variable, falling back to the correct URL string
const rawBase = import.meta.env.VITE_API_URL || fallbackBase;

// 4. Safely clean up any accidental trailing slashes
export const apiBaseUrl = rawBase.replace(/\/$/, '');

// 5. Generate the absolute endpoint URL path
export const apiUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
};