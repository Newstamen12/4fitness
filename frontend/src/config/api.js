const fallbackBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
const rawBase = import.meta.env.VITE_API_URL || fallbackBase;

export const apiBaseUrl = rawBase.replace(/\/$/, '');

export const apiUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
};
