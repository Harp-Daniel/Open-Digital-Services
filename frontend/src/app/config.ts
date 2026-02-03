/**
 * Production-ready configuration for API endpoints.
 * Automatically switches between local development (IP) and production (domain).
 */
const getApiUrl = (): string => {
    const hostname = window.location.hostname;

    // Local Development
    if (hostname === 'localhost' || hostname.startsWith('10.')) {
        return 'http://10.172.91.230:5000/api';
    }

    // Production (Same-domain hosting or proxy)
    // If you host the backend on a different domain (e.g., api.ods-tech.com), 
    // change '/api' to 'https://api.yourdomain.com/api'
    return '/api';
};

export const API_URL = getApiUrl();
