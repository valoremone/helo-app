import { Activity } from 'lucide-react';
import { BarChart3 } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { FileText } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Menu } from 'lucide-react';
import { PlaneTakeoff } from 'lucide-react';
import { Settings } from 'lucide-react';
import { User } from 'lucide-react';
import { Users } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth/context';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AppDispatch } from '@/store';
import { RootState } from '@/store';
import { logoutAsync } from '@/store/slices/auth';

interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  submenu?: NavItem[];
  requiredRole?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    icon: Users,
    requiredRole: 'admin',
    submenu: [
      {
        title: 'All Users',
        href: ROUTES.ADMIN.USERS.ROOT,
      },
      {
        title: 'Roles & Permissions',
        href: ROUTES.ADMIN.USERS.ROLES,
      },
      {
        title: 'Activity Logs',
        href: ROUTES.ADMIN.USERS.ACTIVITY,
      },
      {
        title: 'Memberships',
        href: ROUTES.ADMIN.USERS.MEMBERSHIPS,
      },
    ],
  },
  {
    title: 'Bookings',
    icon: Calendar,
    submenu: [
      {
        title: 'All Bookings',
        href: ROUTES.ADMIN.BOOKINGS.ROOT,
      },
      {
        title: 'Calendar View',
        href: ROUTES.ADMIN.BOOKINGS.CALENDAR,
      },
      {
        title: 'Pending Approvals',
        href: ROUTES.ADMIN.BOOKINGS.PENDING,
        requiredRole: 'admin',
      },
      {
        title: 'Booking History',
        href: ROUTES.ADMIN.BOOKINGS.HISTORY,
      },
    ],
  },
  {
    title: 'Fleet Management',
    icon: PlaneTakeoff,
    submenu: [
      {
        title: 'Aircraft List',
        href: ROUTES.ADMIN.FLEET.ROOT,
      },
      {
        title: 'Maintenance',
        href: ROUTES.ADMIN.FLEET.MAINTENANCE,
        requiredRole: 'admin',
      },
      {
        title: 'Flight Schedule',
        href: ROUTES.ADMIN.FLEET.SCHEDULE,
      },
      {
        title: 'Routes',
        href: ROUTES.ADMIN.FLEET.ROUTES,
      },
    ],
  },
  {
    title: 'Content Management',
    icon: FileText,
    requiredRole: 'admin',
    submenu: [
      {
        title: 'Membership Tiers',
        href: ROUTES.ADMIN.CONTENT.MEMBERSHIPS,
      },
      {
        title: 'Routes & Destinations',
        href: ROUTES.ADMIN.CONTENT.ROUTES,
      },
      {
        title: 'Pricing',
        href: ROUTES.ADMIN.CONTENT.PRICING,
      },
      {
        title: 'Services',
        href: ROUTES.ADMIN.CONTENT.SERVICES,
      },
    ],
  },
  {
    title: 'Reports',
    icon: BarChart3,
    submenu: [
      {
        title: 'Analytics Dashboard',
        href: ROUTES.ADMIN.REPORTS.ANALYTICS,
        icon: BarChart3,
        requiredRole: 'admin',
      },
      {
        title: 'Financial Reports',
        href: ROUTES.ADMIN.REPORTS.FINANCIAL,
        icon: DollarSign,
        requiredRole: 'admin',
      },
      {
        title: 'Flight Reports',
        href: ROUTES.ADMIN.REPORTS.FLIGHTS,
        icon: Activity,
      },
      {
        title: 'Maintenance Reports',
        href: ROUTES.ADMIN.REPORTS.MAINTENANCE,
        icon: Wrench,
        requiredRole: 'admin',
      },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    requiredRole: 'admin',
    submenu: [
      {
        title: 'General',
        href: ROUTES.ADMIN.SETTINGS.ROOT,
      },
      {
        title: 'Notifications',
        href: ROUTES.ADMIN.SETTINGS.NOTIFICATIONS,
      },
      {
        title: 'Security',
        href: ROUTES.ADMIN.SETTINGS.SECURITY,
      },
      {
        title: 'System Logs',
        href: ROUTES.ADMIN.SETTINGS.LOGS,
      },
      {
        title: 'Performance',
        href: ROUTES.ADMIN.SETTINGS.PERFORMANCE,
      },
    ],
  },
];

interface SidebarNavProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarNav({ className, isCollapsed, onToggleCollapse }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync());
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isPathActive = (href: string) => {
    if (href === ROUTES.ADMIN.DASHBOARD) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const canViewItem = (item: NavItem) => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === 'admin') return isAdmin;
    return false;
  };

  const hasAccessibleSubmenu = (item: NavItem) => {
    if (!item.submenu) return false;
    return item.submenu.some(subitem => canViewItem(subitem));
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    if (!canViewItem(item)) return null;

    const isActive = item.href ? isPathActive(item.href) : false;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const hasViewableSubmenu = hasSubmenu && hasAccessibleSubmenu(item);
    const isSubmenuOpen = openSubmenus[item.title] || (hasViewableSubmenu && item.submenu?.some(subitem => isPathActive(subitem.href || '')));

    if (hasSubmenu && !openSubmenus[item.title] && item.submenu?.some(subitem => isPathActive(subitem.href || ''))) {
      toggleSubmenu(item.title);
    }

    const Icon = item.icon;

    const content = (
      <div className={cn("flex flex-col", level > 0 && "ml-4")}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
            isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
            !item.href && "cursor-pointer",
            isCollapsed && level === 0 && "justify-center px-2"
          )}
          onClick={() => {
            if (hasViewableSubmenu) {
              toggleSubmenu(item.title);
            }
          }}
        >
          {Icon && (
            <Icon className={cn("h-4 w-4", isCollapsed && "h-5 w-5")} />
          )}
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {hasViewableSubmenu && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isSubmenuOpen && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </div>
        {hasViewableSubmenu && !isCollapsed && isSubmenuOpen && item.submenu && (
          <div className="mt-1 space-y-1">
            {item.submenu.map((subitem) => (
              <NavItemComponent key={subitem.title} item={subitem} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );

    return item.href ? (
      <Link to={item.href} className="block">
        {content}
      </Link>
    ) : (
      content
    );
  };

  const renderSidebarContent = () => {
    return (
      <div className={cn("flex h-full flex-col border-r", className)}>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 px-4">
            {!isCollapsed && (
              <span className="text-xl font-bold">HELO</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems
              .filter(item => canViewItem(item))
              .map(item => (
                <NavItemComponent key={item.title} item={item} />
              ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto border-t p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name || user?.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {isAdmin ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex h-full flex-col justify-between py-4", className)}>
      {renderSidebarContent()}
    </div>
  );
}