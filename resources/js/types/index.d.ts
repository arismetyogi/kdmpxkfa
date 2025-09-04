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
    sku: string;
    name: string;
    slug: string;
    description: string;
    dosage: Array<string>;
    pharmacology: string;
    category_id?: number;
    category?: Category;
    base_uom: string;
    order_unit: string;
    content: number;
    price: number;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    brand?: string;
    image?: any;
    is_active: boolean;
    is_featured: boolean;
}

export interface Order {
    transaction_number: string;
    tenant_id: string; // id koperasi
    status: string;
    merchant_id: string;
    merchant_name: string;
    total_nominal: number;
    is_for_sale: boolean;
    account_no: string;
    account_bank: string;
    payment_type: string;
    payment_method: string;
    va_number: string;
    timestamp: string;
    products?: Product[];
    product_detail: {
        sku: string;
        quantity: number;
    }[]; //Relasi ke Product
}


export interface OrderProducts {
    id: number;
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

export interface Paginated<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
};
