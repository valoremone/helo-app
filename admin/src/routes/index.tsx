import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminLayout } from '@/layouts/admin-layout';
import { MemberLayout } from '@/layouts/member-layout';
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminFleet } from '@/pages/admin/fleet';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import BookingsPage from '@/pages/bookings/BookingsListPage';
import LoginPage from '@/pages/login';
import { MemberDashboard } from '@/pages/member/dashboard';
import ProfilePage from '@/pages/member/profile';
import RegisterPage from '@/pages/register';
import UsersPage from '@/pages/users/UsersListPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/fleet" element={<AdminFleet />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Member Routes */}
      <Route
        path="/member/*"
        element={
          <ProtectedRoute requiredRole="member">
            <MemberLayout>
              <Routes>
                <Route path="/" element={<MemberDashboard />} />
                <Route path="/dashboard" element={<MemberDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
              </Routes>
            </MemberLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export { AppRoutes };

export default AppRoutes;