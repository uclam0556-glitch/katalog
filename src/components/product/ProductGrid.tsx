"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    className?: string;
}

/**
 * Professional Product Grid - 3 Columns
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    onProductClick,
    onAddToCart,
    onQuickView,
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
                // FIXED 3 COLUMNS ON DESKTOP
                "grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10",
                className
            )}
        >
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className="animate-[fadeIn_0.4s_ease-out]"
                    style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "backwards",
                    }}
                >
                    <ProductCard
                        product={product}
                        onProductClick={onProductClick}
                        onAddToCart={onAddToCart}
                        onQuickView={onQuickView}
                    />
                </div>
            ))}
        </div>
    );
};
