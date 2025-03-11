export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipTier: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
} 