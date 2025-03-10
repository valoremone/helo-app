import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth-provider';
import { ROUTES } from '@/lib/constants';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, checkingAuth } = useAuth();
  const location = useLocation();

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Verifying authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the login page, but save where they were trying to go
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    // If they need to be an admin but aren't, redirect to the dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}