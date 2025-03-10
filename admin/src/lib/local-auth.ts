import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipTier: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface StoredUser extends User {
  password: string;
}

// Constants
const USER_STORAGE_KEY = 'auth_users';
const SESSION_STORAGE_KEY = 'auth_session';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateToken(): string {
  // Simulate JWT structure with header.payload.signature
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: generateId(),
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY,
  }));
  const signature = btoa(Math.random().toString(36).substring(2));
  
  return `${header}.${payload}.${signature}`;
}

function getUsers(): StoredUser[] {
  const users = localStorage.getItem(USER_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

function getSession(): { user: User | null; token: string | null } {
  const session = localStorage.getItem(SESSION_STORAGE_KEY);
  return session ? JSON.parse(session) : { user: null, token: null };
}

function saveSession(user: User, token: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, token }));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

// Initialize demo users
function initializeUsers(): void {
  const users = getUsers();
  
  if (users.length === 0) {
    // Add demo users if none exist
    const adminUser: StoredUser = {
      id: generateId(),
      email: 'admin@demo.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      membershipTier: 'Platinum',
      createdAt: new Date().toISOString(),
    };
    
    const memberUser: StoredUser = {
      id: generateId(),
      email: 'user@demo.com',
      password: 'user123',
      name: 'Regular User',
      role: 'member',
      membershipTier: 'Standard',
      createdAt: new Date().toISOString(),
    };
    
    saveUsers([adminUser, memberUser]);
    console.log('Demo users initialized:', [adminUser.email, memberUser.email]);
  }
}

// Auth functions
export async function checkAuth(): Promise<boolean> {
  try {
    const { user, token } = getSession();
    
    if (!user || !token) {
      return false;
    }
    
    // Simulate token verification & expiry check
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp < Date.now()) {
        clearSession();
        return false;
      }
    } catch (e) {
      clearSession();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Generate auth token
    const token = generateToken();
    
    // Create session
    const sessionUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      membershipTier: user.membershipTier,
      createdAt: user.createdAt,
    };
    
    saveSession(sessionUser, token);
    
    return { user: sessionUser, token };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Invalid email or password');
  }
}

export async function registerUser(email: string, password: string, fullName: string): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Validate inputs
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: StoredUser = {
      id: generateId(),
      email: email.trim(),
      password: password,
      name: fullName.trim(),
      role: 'member', // Default role
      membershipTier: 'Standard', // Default tier
      createdAt: new Date().toISOString(),
    };
    
    // Save user
    users.push(newUser);
    saveUsers(users);
    
    // Generate token
    const token = generateToken();
    
    // Create session (auto-login)
    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      membershipTier: newUser.membershipTier,
      createdAt: newUser.createdAt,
    };
    
    saveSession(sessionUser, token);
    
    return { user: sessionUser, token };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logout(): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    clearSession();
    toast.success('Logged out successfully');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export async function getUserRole(userId: string): Promise<string> {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user?.role || 'member';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'member';
  }
}

export async function getProfile(userId: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    if (!userId) {
      console.error('getProfile called with no userId');
      return null;
    }

    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      console.error('No profile found for user:', userId);
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      full_name: user.name,
      membership_tier: user.membershipTier,
      status: 'active',
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

// Update user profile
export async function updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...(updates.name && { name: updates.name }),
      ...(updates.membershipTier && { membershipTier: updates.membershipTier }),
    };
    
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    // Update session if this is the current user
    const session = getSession();
    if (session.user && session.user.id === userId) {
      const sessionUser: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        membershipTier: updatedUser.membershipTier,
        createdAt: updatedUser.createdAt,
      };
      
      saveSession(sessionUser, session.token!);
    }
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      membershipTier: updatedUser.membershipTier,
      createdAt: updatedUser.createdAt,
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Initialize demo users on import
try {
  initializeUsers();
  console.log('Demo users initialized successfully');
} catch (error) {
  console.error('Failed to initialize demo users:', error);
  // Continue execution even if initialization fails
}