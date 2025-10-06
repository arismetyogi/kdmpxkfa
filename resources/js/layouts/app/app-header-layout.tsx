import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <CartProvider>
            <AppShell>
                <AppHeader breadcrumbs={breadcrumbs} />
                <AppContent>
                    <Toaster />
                    {children}
                </AppContent>
            </AppShell>
        </CartProvider>
    );
}
