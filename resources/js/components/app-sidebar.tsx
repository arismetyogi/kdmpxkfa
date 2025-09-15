import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { History, Key, LayoutGrid, Package, Settings, Shield, Tag, UserCog, Users, ShoppingCart } from 'lucide-react';
import AppLogo from './app-logo';
import DarkModeToggle from '@/components/toggle-dark-mode';

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
                  href: route('admin.dashboard', [], false),
                  icon: Shield,
              },
              {
                  title: 'Category Management',
                  href: route('admin.categories.index', [], false),
                  icon: Tag,
              },
              {
                  title: 'Product Management',
                  href: route('admin.products.index', [], false),
                  icon: Package,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  href: route('dashboard', [], false),
                  icon: LayoutGrid,
              },
              {
                  title: 'Products',
                  href: route('orders.products', [], false),
                  icon: ShoppingCart,
              },
              {
                  title: 'Orders History',
                  href: route('orders.history', [], false),
                  icon: History,
              },
          ];

    const orderManagementNavItems: NavItem[] = isAdminOrManager?
        [
            {
                title: 'Orders',
                href: route('admin.orders.index', [], false),
                icon: ShoppingCart,
            },
        ] : [];

    const adminNavItems: NavItem[] = isAdminOrManager
        ? [
              {
                  title: 'Admin Management',
                  href: route('admin.admins.index', [], false),
                  icon: UserCog,
              },
            {
                  title: 'User Management',
                  href: route('admin.users.index', [], false),
                  icon: Users,
              },
              {
                  title: 'Role Management',
                  href: route('admin.roles.index', [], false),
                  icon: Settings,
              },
              {
                  title: 'Permission Management',
                  href: route('admin.permissions.index', [], false),
                  icon: Key,
              },
          ]
        : [];

    // Determine the logo link based on user role
    const logoHref = isAdminOrManager ? route('admin.dashboard') : route('home');

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
                <DarkModeToggle/>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
