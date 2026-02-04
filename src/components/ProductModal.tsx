"use client";

import React from "react";
import Image from "next/image";
import { FiX, FiCheck, FiTruck, FiShield, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { cn } from "@/lib/utils";

export interface ProductModalProps {
    product: Product | null;
    isOpen?: boolean;
    onClose: () => void;
}

/**
 * Professional Product Modal with Image Gallery
 * Main image + thumbnail selector below
 */
export const ProductModal: React.FC<ProductModalProps> = ({
    product,
    isOpen: isOpenProp,
    onClose,
}) => {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const isOpen = isOpenProp !== undefined ? isOpenProp : product !== null;

    // Get all images from product
    const allImages = React.useMemo(() => {
        if (!product) return [];
        // If product has images array, use it; otherwise use thumbnail
        return product.images && product.images.length > 0
            ? product.images
            : [product.thumbnail];
    }, [product]);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setSelectedImageIndex(0); // Reset to first image
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

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className={cn(
                    "bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col",
                    "max-h-[95vh] md:max-h-[90vh]",
                    "md:flex-row",
                    "animate-[scaleIn_0.3s_ease-out]"
                )}>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white hover:bg-neutral-100 rounded-full transition-all shadow-lg active:scale-95"
                        aria-label="Закрыть"
                    >
                        <FiX className="w-5 h-5 text-neutral-900" />
                    </button>

                    {/* LEFT: Image Gallery - LARGER ON MOBILE */}
                    <div className="w-full md:w-[60%] bg-neutral-50 flex flex-col p-4 md:p-6 min-h-[60vh] md:min-h-0">
                        {/* Main Image - Larger on mobile */}
                        <div className="relative flex-1 bg-white rounded-xl overflow-hidden group mb-4 min-h-[50vh] md:min-h-0">
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={`${product.name} - фото ${selectedImageIndex + 1}`}
                                fill
                                className="object-contain p-4"
                                priority
                                sizes="(max-width: 768px) 100vw, 60vw"
                            />

                            {/* Image Navigation Arrows (if multiple images) */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                                        aria-label="Предыдущее фото"
                                    >
                                        <FiChevronLeft className="w-5 h-5 text-neutral-900" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                                        aria-label="Следующее фото"
                                    >
                                        <FiChevronRight className="w-5 h-5 text-neutral-900" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur text-white text-xs font-medium rounded-full">
                                        {selectedImageIndex + 1} / {allImages.length}
                                    </div>
                                </>
                            )}

                            {/* Stock Badge */}
                            {product.stock < 5 && product.stock > 0 && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow">
                                        Осталось {product.stock} шт
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery - Below main image */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            "relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white transition-all",
                                            selectedImageIndex === index
                                                ? "ring-2 ring-neutral-900 opacity-100"
                                                : "opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Превью ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="w-full md:w-[40%] flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            {/* Header */}
                            <div className="mb-6">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                                    {product.category}
                                    {product.sku && <span className="ml-2 text-neutral-400">• {product.sku}</span>}
                                </p>

                                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4 leading-tight">
                                    {product.name}
                                </h2>

                                <div className="flex items-baseline gap-4 pb-4 border-b border-neutral-200">
                                    <span className="text-3xl font-semibold text-neutral-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.stock > 0 && (
                                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            В наличии
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                                        Описание
                                    </h3>
                                    <p className="text-sm text-neutral-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Characteristics */}
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                {product.materials && product.materials.length > 0 && (
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase mb-1">Материалы</p>
                                        <p className="text-sm text-neutral-900 font-medium">
                                            {product.materials.join(", ")}
                                        </p>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase mb-1">Размеры</p>
                                        <p className="text-sm text-neutral-900 font-medium">
                                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} см
                                        </p>
                                    </div>
                                )}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase mb-1">Цвета</p>
                                        <p className="text-sm text-neutral-900 font-medium">
                                            {product.colors.join(", ")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-1 gap-3 mb-6 p-4 bg-neutral-50 rounded-xl">
                                <div className="flex items-center gap-3 text-sm text-neutral-700">
                                    <FiTruck className="w-5 h-5 text-neutral-500" />
                                    Бесплатная доставка
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-700">
                                    <FiShield className="w-5 h-5 text-neutral-500" />
                                    Гарантия 2 года
                                </div>
                                <div className="flex items-center gap-3 text-sm text-neutral-700">
                                    <FiCheck className="w-5 h-5 text-neutral-500" />
                                    Сертифицированный товар
                                </div>
                            </div>
                        </div>

                        {/* Sticky CTA Button */}
                        <div className="p-6 border-t border-neutral-200 bg-white">
                            <Button
                                onClick={handleOrder}
                                disabled={product.stock === 0}
                                className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-lg"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                {product.stock === 0 ? "Нет в наличии" : "Заказать в WhatsApp"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scaleIn {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d4d4d4;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a3a3a3;
                }
                
                .scrollbar-thin::-webkit-scrollbar {
                    height: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d4d4d4;
                    border-radius: 2px;
                }
            `}</style>
        </>
    );
};
