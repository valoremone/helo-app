import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from '@/lib/auth/context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'member';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return a loading spinner or placeholder
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard if role doesn't match
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Example usage:
// <ProtectedRoute requiredRole="admin">
//   <AdminDashboard />
// </ProtectedRoute>