import { User } from './config';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseUrl = '/api/auth';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Auth request failed');
    }

    return response.json();
  }

  async signIn(credentials: { email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signUp(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signOut(): Promise<void> {
    await this.request('/signout', {
      method: 'POST',
    });
  }

  async getSession(): Promise<AuthResponse | null> {
    try {
      return await this.request<AuthResponse>('/session');
    } catch {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      await this.request(`/verify-reset/${token}`);
      return true;
    } catch {
      return false;
    }
  }

  async updatePassword(token: string, newPassword: string): Promise<void> {
    await this.request('/update-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

export const authService = new AuthService();