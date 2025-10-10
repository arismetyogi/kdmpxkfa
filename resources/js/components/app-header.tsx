import { Breadcrumbs } from '@/components/breadcrumbs';
import { CartPopover } from '@/components/cart-popover';
import { Icon } from '@/components/icon';
import NotificationSheet from '@/components/notification-sheet';
import SearchCommand from '@/components/search-command';
import DarkModeToggle from '@/components/toggle-dark-mode';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCart } from '@/context/CartContext';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { History, LayoutGrid, Menu, Package, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
    { title: 'Paket Merah Putih', href: route('packages.index'), icon: Package },
    { title: 'Products', href: route('orders.products'), icon: Package },
    { title: 'Orders History', href: route('history.index'), icon: History },
];

const rightNavItems: NavItem[] = [{ title: 'Cart', href: route('cart'), icon: ShoppingCart }];

const activeItemStyles = 'text-neutral-900 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { cartCount } = useCart();
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const response = await fetch('/notifications/unread-count', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUnreadNotificationCount(data.unread_count || 0);
                }
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        fetchNotificationCount();
        const interval = setInterval(fetchNotificationCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-sidebar-border/80 bg-background/95 backdrop-blur-sm">
                <div className="relative mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Left side: No changes here */}
                    <div className="flex items-center">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-9 w-9">
                                        <Menu className="h-5 w-5 text-foreground" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar p-0">
                                    <SheetHeader className="border-b p-4">
                                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                        <AppLogoIcon className="mx-auto size-40 fill-current text-foreground" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <nav className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center space-x-2 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <Icon iconNode={item.icon} className="h-5 w-5" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link href={route('home')} className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Center: No changes here */}
                    <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url.startsWith(item.href) && activeItemStyles,
                                                    'h-9 cursor-pointer px-3 text-foreground',
                                                )}
                                            >
                                                <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />
                                                {item.title}
                                            </Link>
                                        </NavigationMenuLink>
                                        {page.url.startsWith(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-foreground"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <SearchCommand>
                                <Button variant="ghost" size="icon" className="group h-9 w-9">
                                    <Search className="!size-5 text-foreground opacity-80 group-hover:opacity-100" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            </SearchCommand>

                            {/* Mobile cart: No changes here */}
                            <div className="relative lg:hidden">
                                <Link
                                    href={rightNavItems[0].href}
                                    className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-foreground"
                                >
                                    <Icon iconNode={ShoppingCart} className="size-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"></span>
                                    )}
                                </Link>
                            </div>

                            {/* ======================= CHANGE 4: Implement hover-triggered Popover ======================= */}
                            <div className="hidden lg:flex">
                                <CartPopover />
                            </div>

                            {/* Desktop notification: No changes here */}
                            <div className="hidden lg:flex">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <NotificationSheet newNotifications={unreadNotificationCount} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Notifications</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <DarkModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-muted-foreground md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
