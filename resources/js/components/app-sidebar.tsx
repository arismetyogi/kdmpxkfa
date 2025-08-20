import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Shield, Users, Settings } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (page.props as any).auth?.user;

    // Check if user has admin or manager role
    const isAdminOrManager = user?.roles?.some((role: { name: string }) =>
        ['admin', 'manager'].includes(role.name)
    );

    // Define navigation items based on user role
    const mainNavItems: NavItem[] = isAdminOrManager ? [
        {
            title: 'Admin Dashboard',
            href: '/admin',
            icon: Shield,
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
    ] : [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
