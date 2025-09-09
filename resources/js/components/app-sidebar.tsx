import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { History, Key, LayoutGrid, Package, Settings, Shield, ShoppingCart, Tag, UserCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (page.props as any).auth?.user;

    // Check if user has admin or manager role
    const isAdminOrManager = user?.roles?.some((role: { name: string }) => ['super-admin', 'admin', 'admin-apotek'].includes(role.name));

    // Define navigation items based on user role
    const mainNavItems: NavItem[] = isAdminOrManager
        ? [
              {
                  title: 'Admin Dashboard',
                  href: '/admin',
                  icon: Shield,
              },
              {
                  title: 'Category Management',
                  href: '/admin/categories',
                  icon: Tag,
              },
              {
                  title: 'Product Management',
                  href: '/admin/products',
                  icon: Package,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  href: '/dashboard',
                  icon: LayoutGrid,
              },
              {
                  title: 'Products',
                  href: '/orders/products',
                  icon: ShoppingCart,
              },
              {
                  title: 'Orders History',
                  href: '/orders/history',
                  icon: History,
              },
          ];

    const orderManagementNavItems: NavItem[] = isAdminOrManager?
        [
            {
                title: 'Orders',
                href: '/admin/orders',
                icon: ShoppingCart,
            },
        ] : [];

    const adminNavItems: NavItem[] = isAdminOrManager
        ? [
              {
                  title: 'Admin Management',
                  href: '/admin/admins',
                  icon: UserCog,
              },
            {
                  title: 'User Management',
                  href: '/admin/users',
                  icon: Users,
              },
              {
                  title: 'Role Management',
                  href: '/admin/roles',
                  icon: Settings,
              },
              {
                  title: 'Permission Management',
                  href: '/admin/permissions',
                  icon: Key,
              },
          ]
        : [];

    // Determine the logo link based on user role
    const logoHref = isAdminOrManager ? '/admin' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Home" items={mainNavItems} />
                {isAdminOrManager && <NavMain label="Orders" items={orderManagementNavItems} />}
                {isAdminOrManager && <NavMain label="System" items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
