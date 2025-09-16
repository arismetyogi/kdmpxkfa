import CreditLimitAlert from '@/components/credit-limit-alert';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

interface User {
    tenant_id?: string;
    // ... other user properties
}

type FlashProps = {
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        message?: string;
    };
    auth: {
        user: User;
    };
};

export default function HeaderLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash, auth } = usePage<FlashProps>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.warning(flash.warning);
        if (flash?.message) toast.info(flash.message);
    }, [flash]);

    return (
        <div className="relative">
            {auth.user?.tenant_id && (
                <div className="fixed z-50 lg:top-32 top-20 right-4 w-fit">
                    <CreditLimitAlert tenantId={auth.user.tenant_id} />
                </div>
            )}
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                <Toaster />
                <div className="container">{children}</div>
            </AppLayoutTemplate>
        </div>
    );
}
