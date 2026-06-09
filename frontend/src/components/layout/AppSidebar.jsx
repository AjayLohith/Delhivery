import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Settings,
  Package,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: ShoppingBag },
  { label: 'My Cart', path: '/cart', icon: ShoppingCart },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Admin', path: '/admin', icon: Package },
];

export function AppSidebar() {
  const location = useLocation();
  const { userId } = useUser();
  const { totalItems } = useCart(userId);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Brand */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <span className="heading-sm text-foreground group-data-[collapsible=icon]:hidden">
            EcomDash
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isCart = item.path === '/cart';
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="relative"
                    >
                      <Link to={item.path} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                        {isCart && totalItems > 0 && (
                          <Badge
                            className="ml-auto h-5 min-w-5 px-1 text-xs bg-primary text-primary-foreground group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-top-1 group-data-[collapsible=icon]:-right-1"
                          >
                            {totalItems}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: user info */}
      <SidebarSeparator />
      <SidebarFooter className="px-4 py-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {userId ? userId.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">{userId || 'Guest'}</span>
            <span className="text-xs text-muted-foreground truncate">User</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
