// Centralized API Configuration
// Auto-detects environment and uses correct URL

const getApiBaseUrl = (): string => {
  // Check environment variable (nullish coalescing preserves empty string for relative paths)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl !== undefined) {
    return envUrl;
  }

  // Fallback to localhost for local development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

export default API_BASE_URL;
