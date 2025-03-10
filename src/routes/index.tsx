import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { MemberLayout } from '@/layouts/member-layout.tsx';
import { AdminLayout } from '@/layouts/admin-layout.tsx';
import { LoginPage } from '@/pages/auth/login.tsx';
import { RegisterPage } from '@/pages/auth/register.tsx';
import { MemberDashboard } from '@/pages/member/dashboard.tsx';
import { BookingPage } from '@/pages/member/booking.tsx';
import { ProfilePage } from '@/pages/member/profile.tsx';
import { AdminDashboard } from '@/pages/admin/dashboard.tsx';
import { AdminBookings } from '@/pages/admin/bookings.tsx';
import { AdminUsers } from '@/pages/admin/users.tsx';
import { AdminFleet } from '@/pages/admin/fleet.tsx';
import { AdminAnalytics } from '@/pages/admin/analytics.tsx';
import { ProtectedRoute } from '@/components/protected-route';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Member Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<MemberDashboard />} />
        <Route path={ROUTES.BOOKING} element={<BookingPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN.ROOT}
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.BOOKINGS} element={<AdminBookings />} />
        <Route path={ROUTES.ADMIN.USERS} element={<AdminUsers />} />
        <Route path={ROUTES.ADMIN.FLEET} element={<AdminFleet />} />
        <Route path={ROUTES.ADMIN.ANALYTICS} element={<AdminAnalytics />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />
    </Routes>
  );
}