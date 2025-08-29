import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    ssoBaseUrl: string;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    permissions?: Permission[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    main_category: string;
    subcategory1?: string;
    subcategory2?: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    category_id?: number;
    category?: Category;
    base_uom: string;
    price: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    image_url: string;
    image_alt: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrderProducts {
    name: string;
    description: string;
    category: string;
    price: number;
    inventory: number;
    order_unit: string;
    base_uom: string;
    content: number;
    image: string;
}

export interface CartItem {
    name: string;
    image: string;
    qty: string;
    packaging: string;
    price: number;
    quantity: number;
}
