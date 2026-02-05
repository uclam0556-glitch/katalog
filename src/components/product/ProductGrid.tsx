"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
    className?: string;
}

/**
 * Professional Product Grid - divano.ru inspired spacing
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onAddToCart,
    className,
}) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-neutral-500">Товары не найдены</p>
                <p className="text-sm text-neutral-400 mt-2">
                    Попробуйте изменить фильтры или поисковый запрос
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                // Better spacing like divano.ru
                "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
                className
            )}
        >
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};
