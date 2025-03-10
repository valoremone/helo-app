import { AdminLayout } from '@/components/layout/admin-layout';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
} 