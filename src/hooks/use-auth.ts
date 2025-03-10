import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Check if token exists and is valid
    const checkAuth = async () => {
      try {
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // In a real app, you would validate the token with your backend
        // For now, we'll just check if it exists
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  return {
    isAuthenticated,
    isLoading,
  };
} 