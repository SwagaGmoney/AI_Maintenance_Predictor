// In production, this should point to your deployed backend URL.
// In development, it uses the empty string to leverage the vite proxy.
export const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
    : '/api';
