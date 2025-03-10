import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserMenu } from '@/components/user-menu';
import { ROUTES } from '@/lib/constants';
import { BrandLogo } from '@/components/brand-logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to={ROUTES.ADMIN.DASHBOARD}>
              <BrandLogo size="sm" />
            </Link>
            <NavigationMenu className="max-w-none">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to={ROUTES.ADMIN.DASHBOARD} className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={ROUTES.ADMIN.BOOKINGS} className={navigationMenuTriggerStyle()}>
                    Bookings
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={ROUTES.ADMIN.USERS} className={navigationMenuTriggerStyle()}>
                    Users
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={ROUTES.ADMIN.FLEET} className={navigationMenuTriggerStyle()}>
                    Fleet
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={ROUTES.ADMIN.ANALYTICS} className={navigationMenuTriggerStyle()}>
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
        <Outlet />
      </main>
    </div>
  );
}