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

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Order {
    id: string;
    grand_total: number;
    total_items: number;
    status: string;
    items: array;
    readyToShip: boolean;
    date_ordered: string;
}

export interface OrderItem {
    id: string;
    name: string,
    condition: string;
    color_id: string;
    color_name: string;
    category: string;
    category_name: string;
    order_id: string;
    inventory_id: string
    is_packed: boolean;
    total_quantity: number
    picked_quantity: number
    itemId: number;
    orderId: number;
    type: string,
    item_no: string
}

export interface BricklinkInventoryItem {
    inventory_id:string|number
    item: {
        no:string
        name:string
        type:string
        category_id:string
    }
    color_id:string
    color_name:string
    quantity:number
    new_or_used:string
    unit_price:string
    bind_id:string
    description:string
    remarks:string
    bulk:number
    is_retain:boolean
    is_stock_room:boolean
    date_created:string
    my_cost:string
    sale_rate:number
    tier_quantity1:number
    tier_price1:float
    tier_quantity2:number
    tier_price2:float
    tier_quantity3:number
    tier_price3:float
    my_weight:float
}