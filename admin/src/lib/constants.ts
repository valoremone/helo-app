export const BRAND = {
  name: 'HELO',
  appName: 'HELO Demo App',
  description: 'Luxury Air Mobility',
  colors: {
    primary: '#000000',
    secondary: '#1A1A1A',
    accent: '#C4B087',
    background: '#0A0A0A',
    text: '#FFFFFF',
  },
} as const;

export const MEMBERSHIP_TIERS = {
  PLATINUM: 'Platinum',
  BLACK: 'Black',
  ELITE: 'Elite',
  STANDARD: 'Standard',
} as const;

export const TEST_USERS = {
  ADMIN: {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  MEMBER: {
    email: 'user@demo.com',
    password: 'user123',
    name: 'Regular User',
    role: 'member',
    membershipTier: 'Standard',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin',
    // User Management
    USERS: {
      ROOT: '/admin/users',
      LIST: '/admin/users/list',
      ROLES: '/admin/users/roles',
      ACTIVITY: '/admin/users/activity',
      MEMBERSHIPS: '/admin/users/memberships',
    },
    // Booking Management
    BOOKINGS: {
      ROOT: '/admin/bookings',
      LIST: '/admin/bookings',
      CALENDAR: '/admin/bookings/calendar',
      PENDING: '/admin/bookings/pending',
      HISTORY: '/admin/bookings/history',
    },
    // Fleet Management
    FLEET: {
      ROOT: '/admin/fleet',
      LIST: '/admin/fleet',
      MAINTENANCE: '/admin/fleet/maintenance',
      SCHEDULE: '/admin/fleet/schedule',
      ROUTES: '/admin/fleet/routes',
    },
    // Content Management
    CONTENT: {
      ROOT: '/admin/content',
      MEMBERSHIPS: '/admin/content/memberships',
      ROUTES: '/admin/content/routes',
      PRICING: '/admin/content/pricing',
      SERVICES: '/admin/content/services',
    },
    // System Settings
    SETTINGS: {
      ROOT: '/admin/settings',
      GENERAL: '/admin/settings',
      NOTIFICATIONS: '/admin/settings/notifications',
      SECURITY: '/admin/settings/security',
      LOGS: '/admin/settings/logs',
      PERFORMANCE: '/admin/settings/performance',
    },
    // Reports
    REPORTS: {
      ROOT: '/admin/reports',
      FLIGHTS: '/admin/reports/flights',
      FINANCIAL: '/admin/reports/financial',
      MAINTENANCE: '/admin/reports/maintenance',
      ANALYTICS: '/admin/reports/analytics',
    },
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
  },
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    ACTIVITY: (id: string) => `/api/users/${id}/activity`,
  },
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
    APPROVE: (id: string) => `/api/bookings/${id}/approve`,
    REJECT: (id: string) => `/api/bookings/${id}/reject`,
  },
  FLEET: {
    LIST: '/api/fleet',
    CREATE: '/api/fleet',
    UPDATE: (id: string) => `/api/fleet/${id}`,
    DELETE: (id: string) => `/api/fleet/${id}`,
    MAINTENANCE: {
      SCHEDULE: '/api/fleet/maintenance/schedule',
      LOG: (id: string) => `/api/fleet/${id}/maintenance`,
    },
  },
  CONTENT: {
    MEMBERSHIPS: '/api/content/memberships',
    ROUTES: '/api/content/routes',
    PRICING: '/api/content/pricing',
    SERVICES: '/api/content/services',
  },
  SETTINGS: {
    GENERAL: '/api/settings',
    NOTIFICATIONS: '/api/settings/notifications',
    SECURITY: '/api/settings/security',
    LOGS: '/api/settings/logs',
  },
} as const;