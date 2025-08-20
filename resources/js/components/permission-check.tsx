import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PermissionCheckProps {
    permission?: string;
    role?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export default function PermissionCheck({
    permission,
    role,
    children,
    fallback = null
}: PermissionCheckProps) {
    const { auth } = usePage().props as { auth: { user: any } };
    const user = auth.user;

    if (!user) {
        return fallback;
    }

    // Check if user has the required permission
    if (permission && !user.permissions?.some((p: any) => p.name === permission)) {
        // Also check if any of the user's roles have this permission
        const hasPermissionViaRole = user.roles?.some((r: any) =>
            r.permissions?.some((p: any) => p.name === permission)
        );

        if (!hasPermissionViaRole) {
            return fallback;
        }
    }

    // Check if user has the required role
    if (role && !user.roles?.some((r: any) => r.name === role)) {
        return fallback;
    }

    return <>{children}</>;
}

// Convenience components for common use cases
export function Can({ permission, children, fallback }: { permission: string; children: ReactNode; fallback?: ReactNode }) {
    return (
        <PermissionCheck permission={permission} fallback={fallback}>
            {children}
        </PermissionCheck>
    );
}

export function HasRole({ role, children, fallback }: { role: string; children: ReactNode; fallback?: ReactNode }) {
    return (
        <PermissionCheck role={role} fallback={fallback}>
            {children}
        </PermissionCheck>
    );
}
