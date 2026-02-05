"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingBag } from "react-icons/fi";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { generateProductSlug } from "@/utils/slug";

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

/**
 * Professional Furniture Store Product Card
 * Clean, compact grid design - Links to product page
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
            className="group cursor-pointer flex flex-col"
        >
            {/* Image Container - Compact aspect ratio */}
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden mb-3 rounded-lg">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-all duration-500",
                        imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Stock Badge */}
                {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 bg-red-600/90 backdrop-blur text-white text-[9px] font-bold uppercase tracking-wider rounded">
                            Осталось {product.stock}
                        </span>
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 bg-neutral-900/90 backdrop-blur text-white text-[9px] font-bold uppercase tracking-wider rounded">
                            Нет в наличии
                        </span>
                    </div>
                )}

                {/* Hover Overlay - Add to Cart */}
                {onAddToCart && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full py-2.5 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all transform translate-y-4 group-hover:translate-y-0 disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-md shadow-lg"
                        >
                            <FiShoppingBag className="w-3.5 h-3.5 inline mr-2" />
                            {product.stock === 0 ? "Нет в наличии" : "В корзину"}
                        </button>
                    </div>
                )}
            </div>

            {/* Product Info - Compact */}
            <div className="flex flex-col gap-1">
                {/* Category */}
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                    {product.category}
                </p>

                {/* Name */}
                <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug group-hover:text-neutral-600 transition-colors">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="text-base font-semibold text-neutral-900 mt-1">
                    {formatPrice(product.price)}
                </p>
            </div>
        </Link>
    );
};
