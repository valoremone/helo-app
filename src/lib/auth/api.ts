import { User } from 'better-auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  async resetPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }
  },

  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Password update failed');
    }
  },

  async getSession(): Promise<LoginResponse | null> {
    const response = await fetch(`${API_URL}/api/auth/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },
};