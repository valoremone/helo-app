import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/better-auth';
import { useEffect, useState, useRef } from 'react';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const location = useLocation();
  const sessionRef = useRef<ReturnType<typeof auth.useSession> | null>(null);
  const session = auth.useSession();
  
  useEffect(() => {
    if (session.isPending === false && 
        (sessionRef.current === null || 
         sessionRef.current.isPending !== session.isPending || 
         sessionRef.current.error !== session.error || 
         JSON.stringify(sessionRef.current.data) !== JSON.stringify(session.data))) {
      
      console.log("Session state changed:", {
        isPending: session.isPending,
        hasError: !!session.error,
        hasData: !!session.data
      });
      
      sessionRef.current = session;
    }
  }, [session]);

  const publicRoutes = ['/login', '/register', '/api/auth'];
  if (publicRoutes.some(route => location.pathname.startsWith(route))) {
    return <>{children}</>;
  }

  if (session.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (session.error) {
    console.error('Authentication error:', session.error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg font-medium">Authentication Error</p>
          <p className="mt-2">{session.error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!session.data) {
    console.log("No session data - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 