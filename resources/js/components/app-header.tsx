import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
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
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { CartItem, type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { History, LayoutGrid, Menu, Package, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

// --- Constants remain the same ---
const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
    { title: 'Paket Merah Putih', href: route('packages.index'), icon: Package },
    { title: 'Products', href: route('orders.products'), icon: Package },
    { title: 'Orders History', href: route('history.index'), icon: History },
];

const rightNavItems: NavItem[] = [
    { title: 'Cart', href: route('cart'), icon: ShoppingCart },
];

const activeItemStyles = 'text-neutral-900 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [cartCount, setCartCount] = useState(0);

    // This cart logic is good, but for better reusability, consider moving it to a custom hook like `useCart()`.
    // For this refactor, we'll keep it as is.
    useEffect(() => {
        const updateCartCount = () => {
            const storedCart = localStorage.getItem('cart');
            const cartItems: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
            const count = cartItems.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        };

        updateCartCount();

        // A custom 'cart-updated' event is often more performant than an interval.
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cart-updated', updateCartCount); // Listen for same-tab updates

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cart-updated', updateCartCount);
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-sidebar-border/80 bg-background/95 backdrop-blur-sm">
                {/* ======================= CHANGE 1: Add `relative` ======================= */}
                {/* This makes the header the positioning context for the absolutely positioned navigation menu. */}
                <div className="relative mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">

                    {/* Left side of the header */}
                    <div className="flex items-center">
                        {/* Mobile Menu */}
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
                                                    <Link key={item.title} href={item.href} className="flex items-center space-x-2 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
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

                        <Link href={ route('dashboard')} className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* ======================= CHANGE 2: Center the Navigation ======================= */}
                    {/* Positioned absolutely to the center of the `relative` parent. */}
                    {/* Hidden on mobile, visible on large screens (`lg:block`). */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
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

                    {/* Right side of the header */}
                    {/* `justify-between` on the parent pushes this group to the right. */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9">
                                <Search className="!size-5 text-foreground opacity-80 group-hover:opacity-100" />
                                <span className="sr-only">Search</span>
                            </Button>

                            {/* Mobile cart icon */}
                            <div className="relative lg:hidden">
                                <Link
                                    href={rightNavItems[0].href}
                                    className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-foreground"
                                >
                                    <Icon iconNode={ShoppingCart} className="size-5" />
                                    {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    </span>
                                    )}
                                </Link>
                            </div>

                            {/* Desktop cart icon with tooltip */}
                            <div className="hidden lg:flex">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={rightNavItems[0].href}
                                                className="group relative ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
                                            >
                                                <span className="sr-only">Cart</span>
                                                <Icon iconNode={ShoppingCart} className="size-5 text-foreground opacity-80 group-hover:opacity-100" />
                                                {cartCount > 0 && (
                                                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                </span>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Cart</p>
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
