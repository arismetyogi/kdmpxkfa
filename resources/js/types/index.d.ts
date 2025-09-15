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
    digikopUrl: string;
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
    apotek_id?: number;
    apotek?: Apotek;
    phone?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Apotek {
    id: number;
    branch: string;
    sap_id: string;
    name: string;
    address?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    zipcode?: string;
    is_active?: boolean;
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
    dosage: any;
    pharmacology: any;
    category_id: number;
    category: any;
    base_uom: string;
    order_unit: string;
    content: number;
    price: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    brand: string;
    image: string;
    is_active: boolean;
    is_featured: boolean;
}

export interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    qty_delivered?: number;
    unit_price: number;
    total_price: number;
    product: Product;
}

export interface Order {
    id: number;
    transaction_number: string;
    user: User;
    apotek: Apotek;
    status: string;
    payment_status: string;
    total_price: number;
    billing_name: string;
    billing_email: string;
    billing_phone: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    billing_zip: string;
    shipping_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    created_at: string;
    shipped_at: string;
    delivered_at: string;
    order_items: OrderItem[];
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    discount_amount: number;
}

export interface CartItem {
    id: number | string;
    product_id: number;
    name: string;
    slug: string;
    quantity: number;
    price: number;
    base_price: number;
    image: string;
    order_unit: string;
    base_uom: string;
    content: number;
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
}
