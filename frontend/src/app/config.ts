/**
 * Production-ready configuration for API endpoints.
 * Automatically switches between local development (IP) and production (domain).
 */
const getApiUrl = (): string => {
    const hostname = window.location.hostname;

    // Local Development
    if (hostname === 'localhost' || hostname.startsWith('10.')) {
        // Fallback to local IP if backend is running on a different machine in the same network
        return `http://${hostname}:5000/api`;
    }

    // Production (Same-domain hosting or proxy)
    // If you host the backend on a different domain (e.g., api.ods-tech.com), 
    // change window.location.origin + '/api' to 'https://api.yourdomain.com/api'
    return window.location.origin + '/api';
};

export const API_URL = getApiUrl();
