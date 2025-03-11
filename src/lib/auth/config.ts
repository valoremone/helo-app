import { createAuthClient } from 'better-auth/react';
import { jwtVerify } from 'jose';
import { SignJWT } from 'jose';
// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.VITE_JWT_SECRET || 'your-secret-key'
);

const JWT_ALGORITHM = 'HS256';

const JWT_EXPIRES_IN = '1h';

// Session Configuration
const SESSION_COOKIE_NAME = 'helo_auth_session';

const SESSION_MAX_AGE = 3600; // 1 hour in seconds

// Security Configuration
// Prefix with underscore to indicate these are defined but not currently used
const _PASSWORD_MIN_LENGTH = 8;
const _MAX_LOGIN_ATTEMPTS = Number(process.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
const _LOGIN_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

// Role Configuration
const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

// Define Role type
export type Role = typeof ROLES[keyof typeof ROLES];

// Permission Configuration
const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  
  // Fleet Management
  VIEW_FLEET: 'view_fleet',
  MANAGE_FLEET: 'manage_fleet',
  
  // Bookings
  VIEW_BOOKINGS: 'view_bookings',
  MANAGE_BOOKINGS: 'manage_bookings',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  
  // Settings
  MANAGE_SETTINGS: 'manage_settings',
} as const;

// Define Permission type
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-Permission Mapping
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_FLEET,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.VIEW_REPORTS,
  ],
};

// JWT Helper Functions
const createToken = async (payload: Record<string, unknown>): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
};

const verifyToken = async (token: string): Promise<Record<string, unknown> | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    return payload;
  } catch (error) {
    return null;
  }
};

// Session Helper Functions
const getSession = (): string | null => {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${SESSION_COOKIE_NAME}=`)
  );
  return sessionCookie ? sessionCookie.split('=')[1] : null;
};

const setSession = (token: string): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + SESSION_MAX_AGE * 1000);
  
  document.cookie = `${SESSION_COOKIE_NAME}=${token};expires=${expires.toUTCString()};path=/;${process.env.NODE_ENV === 'production' ? 'secure;samesite=lax' : ''}`;
};

const clearSession = (): void => {
  document.cookie = `${SESSION_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Permission Helper Functions
const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

const hasAnyPermission = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

const hasAllPermissions = (userRole: Role, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// User Interface
export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: Permission[];
  password?: string;
}

// Auth State Interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial Auth State
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the auth client
const auth = createAuthClient({
  baseURL: '/api/auth',
  fetchOptions: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  },
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      maxAge: SESSION_MAX_AGE,
      path: '/'
    }
  }
});

export {
  auth,
  ROLES,
  PERMISSIONS,
  createToken,
  verifyToken,
  getSession,
  setSession,
  clearSession,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  initialAuthState,
};