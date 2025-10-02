import { usePage } from '@inertiajs/react';

type AuthProps = {
    auth?: {
        user: User;
    };
};

interface User {
    id: number;
    name: string;
    roles: string[];
    permissions: string[];
}
export function usePermission() {
    const { props } = usePage<AuthProps>();
    const user = props.auth?.user;
    const permissions = props.auth?.user?.permissions || [];
    const roles = props.auth?.user?.roles || [];

    const can = (permission: string): boolean => permissions.includes(permission);

    const hasRole = (role: string) => {
        return roles?.includes(role) ?? false;
    };

    const hasAnyPermission = (checkPermissions: string[]): boolean =>
        checkPermissions.some((perm) => permissions.includes(perm));

    const hasAnyRole = (checkRoles: string[]): boolean =>
        checkRoles.some((role) => roles.includes(role));

    return { can, hasRole, hasAnyRole, hasAnyPermission, user };
}
