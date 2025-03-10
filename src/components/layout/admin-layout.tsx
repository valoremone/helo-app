import { useState } from 'react';
import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300",
          isSidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <SidebarNav
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </aside>
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 