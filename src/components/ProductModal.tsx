"use client";

import React from "react";
import Image from "next/image";
import { FiX, FiCheck, FiTruck, FiShield } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { cn } from "@/lib/utils";

export interface ProductModalProps {
    product: Product | null;
    isOpen?: boolean;
    onClose: () => void;
}

/**
 * Ultra-Premium Product Modal - Shatura-inspired
 * Clean, minimalist, elegant
 */
export const ProductModal: React.FC<ProductModalProps> = ({
    product,
    isOpen: isOpenProp,
    onClose,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const isOpen = isOpenProp !== undefined ? isOpenProp : product !== null;

    const allImages = React.useMemo(() => {
        if (!product) return [];
        return product.images && product.images.length > 0
            ? product.images
            : [product.thumbnail];
    }, [product]);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setSelectedImageIndex(0);
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!product) return null;

    const handleOrder = () => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-4 transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className={cn(
                        "bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative",
                        "max-h-[95vh] overflow-y-auto",
                        "animate-[scaleIn_0.3s_ease-out]"
                    )}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-2 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg"
                        aria-label="Закрыть"
                    >
                        <FiX className="w-5 h-5 md:w-6 md:h-6 text-neutral-900" />
                    </button>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8">
                        {/* LEFT: Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-neutral-50 rounded-xl overflow-hidden">
                                <Image
                                    src={allImages[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={cn(
                                                "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition",
                                                selectedImageIndex === index
                                                    ? "border-red-700"
                                                    : "border-neutral-200 hover:border-neutral-400"
                                            )}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Фото ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Product Info */}
                        <div className="flex flex-col">
                            {/* Title & Category */}
                            <div className="mb-4">
                                <p className="text-sm text-neutral-500 mb-1">{product.category}</p>
                                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                                    {product.name}
                                </h2>
                                <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-neutral-200">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-4xl font-bold text-neutral-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-neutral-500">₽</span>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="space-y-3 mb-6">
                                {/* Materials */}
                                {product.materials && product.materials.length > 0 && (
                                    <div className="flex gap-3">
                                        <span className="text-sm text-neutral-500 min-w-[100px]">
                                            Материалы:
                                        </span>
                                        <span className="text-sm text-neutral-900 font-medium">
                                            {product.materials.join(", ")}
                                        </span>
                                    </div>
                                )}

                                {/* Dimensions */}
                                {product.dimensions && (
                                    <div className="flex gap-3">
                                        <span className="text-sm text-neutral-500 min-w-[100px]">
                                            Размеры:
                                        </span>
                                        <span className="text-sm text-neutral-900 font-medium">
                                            {product.dimensions.width} × {product.dimensions.depth} ×{" "}
                                            {product.dimensions.height} см
                                        </span>
                                    </div>
                                )}

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex gap-3">
                                        <span className="text-sm text-neutral-500 min-w-[100px]">
                                            Цвета:
                                        </span>
                                        <span className="text-sm text-neutral-900 font-medium">
                                            {product.colors.join(", ")}
                                        </span>
                                    </div>
                                )}

                                {/* SKU */}
                                <div className="flex gap-3">
                                    <span className="text-sm text-neutral-500 min-w-[100px]">
                                        Артикул:
                                    </span>
                                    <span className="text-sm text-neutral-900 font-medium font-mono">
                                        {product.sku}
                                    </span>
                                </div>

                                {/* Stock */}
                                <div className="flex gap-3 items-center">
                                    <span className="text-sm text-neutral-500 min-w-[100px]">
                                        Наличие:
                                    </span>
                                    {product.stock > 0 ? (
                                        <span className="flex items-center gap-1.5 text-sm text-green-700 font-medium">
                                            <FiCheck className="w-4 h-4" />В наличии ({product.stock} шт.)
                                        </span>
                                    ) : (
                                        <span className="text-sm text-neutral-400">Нет в наличии</span>
                                    )}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-neutral-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <FiTruck className="w-5 h-5 text-red-700 flex-shrink-0" />
                                    <span className="text-xs text-neutral-700">Доставка</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiShield className="w-5 h-5 text-red-700 flex-shrink-0" />
                                    <span className="text-xs text-neutral-700">Гарантия 2 года</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={handleOrder}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                Заказать в WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
