"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { generateProductSlug } from "@/utils/slug";

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

/**
 * Professional Product Card - divano.ru inspired
 * Clean design with proper sizing and spacing
 */
export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
}) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const productSlug = generateProductSlug(product);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product);
    };

    return (
        <Link
            href={`/product/${productSlug}`}
            className="group cursor-pointer flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            {/* Image Container - Better aspect ratio like divano.ru */}
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-all duration-500",
                        imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Stock Badge - Top right like divano.ru */}
                {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            Осталось {product.stock}
                        </span>
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 z-10">
                        <span className="px-2.5 py-1 bg-neutral-700 text-white text-xs font-bold rounded">
                            Нет в наличии
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info - Better spacing */}
            <div className="flex flex-col p-3 md:p-4">
                {/* Price - Prominent */}
                <div className="mb-2">
                    <span className="text-xl md:text-2xl font-bold text-red-700">
                        {formatPrice(product.price)} ₽
                    </span>
                </div>

                {/* Name */}
                <h3 className="text-sm md:text-base font-medium text-neutral-900 line-clamp-2 leading-snug mb-2 group-hover:text-red-700 transition-colors">
                    {product.name}
                </h3>

                {/* Category */}
                <p className="text-xs text-neutral-500 mb-3">
                    {product.category}
                </p>

                {/* CTA Button - Only if onAddToCart provided */}
                {onAddToCart && (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-neutral-300 text-white text-sm font-semibold rounded transition-colors disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? "Нет в наличии" : "В корзину"}
                    </button>
                )}
            </div>
        </Link>
    );
};
