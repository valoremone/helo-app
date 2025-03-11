import { User } from './types';

export type AuthError = {
  message: string;
  status: number;
};

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const data = await response.json();
    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during sign in',
        status: 401
      }
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during sign out',
        status: 500
      }
    };
  }
}

export async function getSession(): Promise<{ session: any | null; error: AuthError | null }> {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      throw new Error('No active session');
    }
    const data = await response.json();
    return { session: data, error: null };
  } catch (error) {
    return {
      session: null,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get session',
        status: 401
      }
    };
  }
}

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send reset password email');
    }
    
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to reset password',
        status: 500
      }
    };
  }
}

export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  try {
    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update password');
    }
    
    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to update password',
        status: 500
      }
    };
  }
}