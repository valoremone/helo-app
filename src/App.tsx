import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { AdminLayout } from '@/components/layout/admin-layout';
import { LoginPage } from '@/pages/auth/login';
import { ProtectedRoute } from '@/components/protected-route';
import { ROUTES } from '@/lib/constants';

// Import actual page components
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminFleet } from '@/pages/admin/fleet';
import { AdminBookings } from '@/pages/admin/bookings';
import { AdminUsers } from '@/pages/admin/users';
import { AdminAnalytics } from '@/pages/admin/analytics';
import { AdminSettings } from '@/pages/admin/settings';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="helo-theme">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Root redirect to login */}
              <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
              
              {/* Auth routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              
              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminLayout>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/fleet"
                        element={
                          <ProtectedRoute>
                            <AdminFleet />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/fleet/maintenance"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <div>Maintenance</div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/bookings"
                        element={
                          <ProtectedRoute>
                            <AdminBookings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/bookings/calendar"
                        element={
                          <ProtectedRoute>
                            <AdminBookings view="calendar" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminUsers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/users/roles"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <div>Roles & Permissions</div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports/flights"
                        element={
                          <ProtectedRoute>
                            <AdminAnalytics type="flights" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports/financial"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminAnalytics type="financial" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports/maintenance"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminAnalytics type="maintenance" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminSettings />
                          </ProtectedRoute>
                        }
                      />
                      {/* Catch all route - redirect to admin dashboard */}
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                  </AdminLayout>
                }
              />
              {/* Catch all route - redirect to login */}
              <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;