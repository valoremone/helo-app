import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthMiddleware } from '@/components/auth/AuthMiddleware';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Suspense, lazy, useEffect, useState } from 'react';
import AppLayout from '@/layouts/AppLayout';
import { auth } from '@/lib/better-auth';

// Lazy load components for code splitting
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const UsersListPage = lazy(() => import('@/pages/users/UsersListPage'));
const ProfilePage = lazy(() => import('@/pages/member/profile'));
const BookingsListPage = lazy(() => import('@/pages/bookings/BookingsListPage'));

// Debug component defined inline to avoid import issues
const AuthDebug = () => {
  const [status, setStatus] = useState('Initializing');
  const [renderCount, setRenderCount] = useState(0);
  const session = auth.useSession();
  
  // Track render counts
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    
    setStatus(session.isPending 
      ? 'Loading' 
      : session.error 
        ? `Error: ${session.error.message}` 
        : session.data 
          ? `Authenticated`
          : 'Not Authenticated');
          
    console.log(`Auth State (render #${renderCount})`, { 
      isPending: session.isPending,
      hasError: !!session.error,
      hasData: !!session.data
    });
  }, [session, renderCount]);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded z-50 max-w-xs">
      <div className="flex justify-between">
        <h3 className="font-bold">Auth: {status}</h3>
        <span className="text-xs bg-gray-700 px-2 rounded">{renderCount}</span>
      </div>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs bg-blue-600 px-2 py-1 rounded"
        >
          Reload
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/admin/login';
          }} 
          className="text-xs bg-red-600 px-2 py-1 rounded"
        >
          Clear & Login
        </button>
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-900/20">
    <div className="text-center p-6 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{error.message}</p>
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-xs overflow-auto max-h-40 mb-4">
        {error.stack}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

// Main App component
export default function App() {
  const [isDebugEnabled, setIsDebugEnabled] = useState(true);
  const [appInitialized, setAppInitialized] = useState(false);
  
  // Pre-fetch the session on app start to avoid loading flashes
  useEffect(() => {
    const prefetchSession = async () => {
      try {
        const result = await auth.getSession();
        console.log('Session prefetched:', result.data ? 'Authenticated' : 'Not authenticated');
        setAppInitialized(true);
      } catch (error) {
        console.error('Failed to prefetch session:', error);
        setAppInitialized(true);
      }
    };
    
    prefetchSession();
    
    // Debug keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press 'D' key to toggle debug mode
      if (e.key === 'd' && e.ctrlKey) {
        setIsDebugEnabled(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Don't render anything until we've attempted to load the session
  if (!appInitialized) {
    return <LoadingFallback />;
  }

  return (
    <Router basename="/admin">
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Suspense fallback={<LoadingFallback />}>
          {isDebugEnabled && <AuthDebug />}
          
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/api/auth/*" element={<div>Auth API Endpoint</div>} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <AuthMiddleware>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/users" element={<UsersListPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/bookings" element={<BookingsListPage />} />
                      {/* Fallback route for any undefined routes */}
                      <Route path="*" element={
                        <div className="flex items-center justify-center min-h-screen">
                          <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                            <p>The page you are looking for does not exist.</p>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </AppLayout>
                </AuthMiddleware>
              }
            />
          </Routes>
        </Suspense>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}