import { Home, Users, Calendar } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const mainNav = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-[200px] flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <BrandLogo />
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent' : 'transparent'
                }`
              }
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full">
          Need Help?
        </Button>
      </div>
    </div>
  );
} 