import { createAuthClient } from 'better-auth/react';

// Determine the environment and enable debug logging
const isDev = import.meta.env.DEV;
const baseApiUrl = import.meta.env.VITE_API_URL || '/api';

// Create a version of console that can be toggled on/off
const debugLog = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(`[BetterAuth] ${message}`, ...args);
  }
};

// Track request counts to detect potential loops
let requestCount = 0;
const MAX_REQUEST_THRESHOLD = 10;
const resetRequestCount = () => {
  setTimeout(() => {
    requestCount = 0;
  }, 5000); // Reset count after 5 seconds of inactivity
};

// Create a Better Auth instance with all configuration in one place
export const auth = createAuthClient({
  baseURL: baseApiUrl,
  debug: isDev,
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    session: '/auth/session',
    logout: '/auth/logout'
  },
  // Add default fetch options
  fetchOptions: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    // Add cache control headers to prevent caching issues
    cache: 'no-cache',
  },
  // Add cookie configuration
  cookies: {
    sessionToken: {
      name: 'helo_session',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    }
  },
  // Request interceptor for debugging and loop detection
  requestInterceptor: (config) => {
    requestCount++;
    debugLog(`Request to ${config.url} (${requestCount})`);
    
    // Detect potential infinite request loops
    if (requestCount > MAX_REQUEST_THRESHOLD) {
      console.warn(`[BetterAuth] Potential infinite request loop detected (${requestCount} requests in short period)`);
    } else {
      resetRequestCount();
    }
    
    return config;
  },
  // Response interceptor for debugging
  responseInterceptor: (response) => {
    debugLog(`Response from ${response.config.url}`, {
      status: response.status,
      ok: response.ok
    });
    return response;
  },
  // Add error handling
  onError: (error) => {
    console.error('[BetterAuth] Error:', error);
  }
});

// Helper for checking authentication status
export const isAuthenticated = () => {
  const session = auth.useSession();
  return !session.isPending && session.data !== null;
};

// Force clear any authentication data (for debugging or logout issues)
export const forceLogout = () => {
  // Clear cookies
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  
  // Clear storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Hard reload
  window.location.href = '/admin/login';
};