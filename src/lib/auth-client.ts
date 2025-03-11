// Auth client functions for direct API calls

// Mock user data for development testing
const mockUsers = [
  {
    id: "usr-admin",
    name: "HELO Admin",
    email: "admin@flyhelo.one",
    password: "admin123",
    role: "admin",
    status: "active",
    membershipTier: "PLATINUM",
    lastActive: new Date().toISOString(),
  },
  {
    id: "usr-member",
    name: "HELO Member",
    email: "member@flyhelo.one",
    password: "member123",
    role: "member",
    status: "active",
    membershipTier: "ELITE",
    lastActive: new Date().toISOString(),
  }
];

// Create mock session data
const createMockSession = (email: string, password: string) => {
  // Check for specific user with matching email and password
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Don't include password in the returned user object
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: "mock-jwt-token",
    };
  }
  
  return null;
};

// Auth client functions
export const auth = {
  signIn: async (credentials: { email: string; password: string }) => {
    // Check for mock users in development
    const mockSession = createMockSession(credentials.email, credentials.password);
    if (mockSession) {
      return { user: mockSession.user, error: null };
    }
    
    // Proceed with actual API call if not a mock user
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      if (!response.ok) {
        return { user: null, error: data.message || 'Login failed' };
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: 'Network error during login' };
    }
  },
  
  // Sign up with email
  signUp: {
    email: async (userData: any, options?: any) => {
      try {
        if (options?.onRequest) options.onRequest();
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (options?.onResponse) options.onResponse();
        
        if (!response.ok) {
          const error = await response.json();
          if (options?.onError) options.onError({ error });
          throw new Error(error.message || 'Registration failed');
        }
        
        const data = await response.json();
        
        if (options?.onSuccess) options.onSuccess({ data });
        
        return data;
      } catch (error) {
        if (options?.onError) options.onError({ error });
        throw error;
      }
    }
  },

  // Sign out
  signOut: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }
    
    return true;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
    
    return true;
  },

  // Update password
  updatePassword: async (oldPassword: string, newPassword: string) => {
    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password update failed');
    }
    
    return true;
  },

  // Get current session
  getSession: async () => {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  }
}; 