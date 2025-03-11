import { Link } from 'react-router-dom';
import React from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import { NavigationMenuList } from '@/components/ui/navigation-menu';
import { UserMenu } from '@/components/user-menu';
import { ROUTES } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.ADMIN.ROOT} className="flex items-center gap-2">
              <BrandLogo className="h-8 w-8" />
              <span className="text-xl font-bold">HELO Admin</span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to={ROUTES.ADMIN.BOOKINGS.ROOT} 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Bookings
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to={ROUTES.ADMIN.USERS.ROOT} 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Users
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to={ROUTES.ADMIN.FLEET.ROOT} 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Fleet
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link 
                    to={ROUTES.ADMIN.ANALYTICS} 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Analytics
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <UserMenu />
        </div>
      </nav>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}