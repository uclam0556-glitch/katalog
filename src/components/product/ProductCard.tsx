"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { generateProductSlug } from "@/utils/slug";

export interface ProductCardProps {
    product: Product;
}

/**
 * Professional Product Card - Clean link without cart button
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const productSlug = generateProductSlug(product);

    return (
        <Link
            href={`/product/${productSlug}`}
            className="group cursor-pointer flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.name || "Product"}
                    fill
                    className={cn(
                        "object-cover transition-all duration-500",
                        imageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Stock Badge */}
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

                {/* Discount Badge - Auto Calculated */}
                {product.oldPrice && product.oldPrice > product.price && (
                    <div className="absolute top-2 left-2 z-10">
                        <span className="px-2.5 py-1 bg-red-600/90 text-white text-xs font-bold rounded backdrop-blur-sm shadow-sm">
                            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col p-2.5 md:p-4">
                {/* Price - Prominent */}
                <div className="mb-1.5">
                    <span className="text-lg md:text-2xl font-bold text-red-700">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Name */}
                <h3 className="text-xs md:text-base font-medium text-neutral-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-red-700 transition-colors">
                    {product.name}
                </h3>

                {/* Category */}
                <p className="text-[10px] md:text-xs text-neutral-500">
                    {product.category}
                </p>
            </div>
        </Link>
    );
};
