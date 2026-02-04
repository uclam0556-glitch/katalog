"use client";

import React from "react";
import Image from "next/image";
import { FiShoppingBag, FiEye, FiHeart } from "react-icons/fi";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
    product: Product;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
}

// Helper to get color code
const getColorCode = (colorName: string): string => {
    const map: Record<string, string> = {
        "Черный": "#171717",
        "Натуральное дерево": "#D4C4B7",
        "Светлый дуб": "#EAD8B1",
        "Шалфей": "#9CAF88",
        "Золотистые ножки": "#D4AF37",
        "Черный металл": "#262626",
        "Горчичный": "#E1AD01",
        "Белый мрамор": "#F5F5F5",
        "Золотистый металл": "#D4AF37",
        "Темный орех": "#4A3728",
        "Белый": "#FFFFFF",
    };
    return map[colorName] || "#E5E5E5";
};

/**
 * "Ultra-Premium" Product Card
 * Inspired by RH, Arhaus, and luxury fashion brands.
 * Features:
 * - Clean, borderless image focus (Aspect 3:4)
 * - Subtle zoom on hover
 * - "Quick Actions" bar that slides up
 * - Color swatches
 * - Elegant typography
 */
export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onProductClick,
    onAddToCart,
    onQuickView,
}) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleCardClick = () => {
        onProductClick?.(product);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart?.(product);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuickView?.(product);
    };

    return (
        <div
            className="group cursor-pointer flex flex-col gap-4"
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-[#F5F5F7] overflow-hidden w-full transition-all duration-500">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        imageLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0 scale-95"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Status Badges - Top Left */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.stock < 5 && product.stock > 0 && (
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#B45309] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            Limited
                        </span>
                    )}
                    {product.featured && (
                        <span className="px-3 py-1 bg-neutral-900/95 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            New Arrival
                        </span>
                    )}
                </div>

                {/* Quick Actions Overlay - Slides up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex gap-2 justify-center z-20 bg-gradient-to-t from-black/20 to-transparent pb-6 pt-12">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="h-10 px-6 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2"
                    >
                        <FiShoppingBag className="w-3.5 h-3.5" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                        onClick={handleQuickView}
                        className="h-10 w-10 flex items-center justify-center bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 transition-colors shadow-lg"
                        title="Быстрый просмотр"
                    >
                        <FiEye className="w-4 h-4" />
                    </button>
                </div>

                {/* Wishlist Button - Absolute Top Right (Always visible but subtle) */}
                <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/0 hover:bg-white text-neutral-900 transition-all opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); /* Wishlist logic */ }}
                >
                    <FiHeart className="w-5 h-5" />
                </button>
            </div>

            {/* Info Section */}
            <div className="space-y-1">
                {/* Title & Price Row */}
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-serif text-lg text-neutral-900 leading-tight group-hover:text-primary-800 transition-colors">
                        {product.name}
                    </h3>
                    <span className="text-sm font-medium text-neutral-900 tracking-wide tabular-nums">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Category & SKU */}
                <p className="text-xs text-neutral-500 font-medium tracking-wide">
                    {product.category}
                    {product.sku && <span className="opacity-50 ml-2 font-light">/{product.sku.split('-')[1]}</span>}
                </p>

                {/* Color Swatches (Simulated) */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {product.colors.map((color, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full border border-neutral-200 ring-1 ring-transparent hover:ring-neutral-400 hover:scale-110 transition-all cursor-help"
                                style={{ backgroundColor: getColorCode(color) }}
                                title={color}
                            />
                        ))}
                        {product.colors.length > 3 && (
                            <span className="text-[10px] text-neutral-400">+</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
