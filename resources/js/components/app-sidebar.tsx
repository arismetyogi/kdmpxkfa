import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar,SidebarContent,SidebarFooter,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem,} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {History,Key,LayoutGrid,Package,Settings,Shield,Tag,UserCog,Users,ShoppingCart,Map,UsersIcon,} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    const user = (page.props as any).auth?.user;

    // 🔹 helper: cek apakah user punya role tertentu
    const hasRole = (roles: string[]) =>
        user?.roles?.some((r: { name: string }) => roles.includes(r.name));

    // 🔹 Main Navigation
    const mainNavItems: NavItem[] = hasRole(['super-admin', 'admin', 'admin-apotek','admin-busdev'])
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

    // 🔹 Apotek Navigation
    const orderManagementNavItems: NavItem[] = hasRole(['super-admin', 'admin-apotek'])
        ? [
              {
                  title: 'Orders',
                  href: route('admin.orders.index', [], false),
                  icon: ShoppingCart,
              },
          ]
        : [];

    // 🔹 BusDev Navigation
    const busdevNavItems: NavItem[] = hasRole(['super-admin', 'admin-busdev'])
        ? [
              {
                  title: 'Mapping',
                  href: route('admin.mapping.index', [], false),
                  icon: Map,
              },
              {
                  title: 'Account Manage',
                  href: route('admin.account.index', [], false),
                  icon: UsersIcon,
              },
          ]
        : [];
    // 🔹 Apotek Navigation
    const orderManagementNavItems: NavItem[] = hasRole(['super-admin', 'admin-apotek'])
        ? [
              {
                  title: 'Orders',
                  href: route('admin.orders.index', [], false),
                  icon: ShoppingCart,
              },
          ]
        : [];

    // 🔹 BusDev Navigation
    const busdevNavItems: NavItem[] = hasRole(['super-admin', 'admin-busdev'])
        ? [
              {
                  title: 'Mapping',
                  href: route('admin.mapping.index', [], false),
                  icon: Map,
              },
              {
                  title: 'Account Manage',
                  href: route('admin.account.index', [], false),
                  icon: UsersIcon,
              },
          ]
        : [];

    // 🔹 System Navigation (khusus super-admin)
    const adminNavItems: NavItem[] = hasRole(['super-admin'])
    // 🔹 System Navigation (khusus super-admin)
    const adminNavItems: NavItem[] = hasRole(['super-admin'])
        ? [
              {
                  title: 'Admin Management',
                  href: route('admin.admins.index', [], false),
                  icon: UserCog,
              },
              {
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

    // 🔹 Tentukan link logo sesuai role
    const logoHref = hasRole(['super-admin', 'admin', 'admin-apotek', 'admin-busdev'])
        ? route('admin.dashboard')
        : route('home');

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

                {orderManagementNavItems.length > 0 && (
                    <NavMain label="Apotek" items={orderManagementNavItems} />
                )}

                {busdevNavItems.length > 0 && (
                    <NavMain label="BusDev" items={busdevNavItems} />
                )}

                {adminNavItems.length > 0 && (
                    <NavMain label="System" items={adminNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <DarkModeToggle />
                <DarkModeToggle />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
