/**
 * Product Type Definitions
 */

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice?: number;
    category: string;
    images: string[]; // Array of image URLs
    thumbnail: string; // Main image (first in images array)
    stock: number;
    sku?: string;
    materials?: string[];
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    colors?: string[];
    featured?: boolean;
    active?: boolean;
    status?: 'active' | 'draft' | 'out_of_stock';
    createdAt?: string;
    updatedAt?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    order: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}
