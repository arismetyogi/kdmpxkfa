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

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
        {
        title: 'Paket Merah Putih',
        href: '/packages',
        icon: Package,
    },
    {
        title: 'Products',
        href: '/orders/products',
        icon: Package,
    },
    {
        title: 'Orders History',
        href: '/orders/history',
        icon: History,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Cart',
        href: route('cart'),
        icon: ShoppingCart,
    },
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

    // Load cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const cartItems: CartItem[] = JSON.parse(storedCart);
                const count = cartItems.reduce((total, item) => total + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        };

        // Initial load
        updateCartCount();

        // Listen for storage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart') {
                updateCartCount();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check for changes in the same tab
        const interval = setInterval(updateCartCount, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-sidebar-border/80 bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
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
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === item.href && activeItemStyles,
                                                    'h-9 cursor-pointer px-3 text-foreground',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                        </NavigationMenuLink>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-foreground"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9">
                                <Search className="!size-5 text-foreground opacity-80 group-hover:opacity-100" />
                                <span className="sr-only">Search</span>
                            </Button>
                                        <div className="flex flex-col space-y-4 lg:hidden">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={item.href}
                                                    rel="noopener noreferrer"
                                                    className="flex items-center rounded-md py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    {item.title === 'Cart' && cartCount > 0 && (
                                                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                                        </span>
                                                    )}
                                                </a>
                                            ))}
                                        </div>
                            <div className="hidden lg:flex">
                                {rightNavItems.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-foreground/80 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    <span className="sr-only">{item.title}</span>
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="size-5 text-foreground opacity-80 group-hover:opacity-100"
                                                        />
                                                    )}
                                                    {item.title === 'Cart' && cartCount > 0 && (
                                                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"></span>
                                                    )}
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
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
