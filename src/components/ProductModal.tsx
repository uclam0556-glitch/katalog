"use client";

import React from "react";
import Image from "next/image";
import { FiX, FiCheck, FiTruck, FiShield, FiMaximize2, FiInfo, FiBox, FiLayers } from "react-icons/fi";
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
 * Premium "Architectural" Product Modal
 * Mobile-first, optimized for all screen sizes
 */
export const ProductModal: React.FC<ProductModalProps> = ({
    product,
    isOpen: isOpenProp,
    onClose,
}) => {
    const [isZoomed, setIsZoomed] = React.useState(false);
    const isOpen = isOpenProp !== undefined ? isOpenProp : product !== null;

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setIsZoomed(false);
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
                    "fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Modal Container - MOBILE OPTIMIZED */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] flex items-end sm:items-center justify-center transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className={cn(
                    "bg-white w-full overflow-hidden flex flex-col relative",
                    "max-h-[95vh] rounded-t-3xl sm:rounded-2xl", // Mobile: rounded only top, Desktop: all corners
                    "sm:max-w-4xl sm:max-h-[85vh]", // Desktop constraints
                    "animate-[slideUp_0.3s_ease-out] sm:animate-[scaleIn_0.3s_ease-out]"
                )}>

                    {/* Close Button - Always visible, mobile-friendly */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-50 p-2 bg-white/95 hover:bg-neutral-100 backdrop-blur-sm rounded-full transition-all shadow-md active:scale-95"
                        aria-label="Закрыть"
                    >
                        <FiX className="w-5 h-5 text-neutral-900" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Product Image - Mobile: smaller, Desktop: larger */}
                        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] bg-neutral-100 group">
                            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />

                            <div
                                className={cn(
                                    "relative w-full h-full cursor-zoom-in transition-transform duration-500",
                                    isZoomed ? "scale-125 cursor-zoom-out z-20" : "scale-100"
                                )}
                                onClick={() => setIsZoomed(!isZoomed)}
                            >
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 sm:p-6"
                                    priority
                                    sizes="(max-width: 640px) 100vw, 90vw"
                                />
                            </div>

                            {/* Stock Badge */}
                            {product.stock < 5 && product.stock > 0 && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="inline-flex items-center px-2.5 py-1 bg-white/95 backdrop-blur text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                                        Осталось {product.stock} шт
                                    </span>
                                </div>
                            )}

                            {/* Zoom hint */}
                            <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <FiMaximize2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Увеличить</span>
                            </div>
                        </div>

                        {/* Product Details - Mobile-optimized padding */}
                        <div className="p-4 sm:p-6 md:p-8">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider rounded">
                                        {product.category}
                                    </span>
                                    {product.sku && (
                                        <span className="text-[10px] text-neutral-400 font-mono">
                                            ART. {product.sku}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-neutral-900 mb-3 leading-tight">
                                    {product.name}
                                </h2>

                                <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-100">
                                    <span className="text-2xl sm:text-3xl font-medium text-neutral-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.stock > 0 && (
                                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-wide">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            В наличии
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
                                        <FiInfo className="w-3.5 h-3.5" />
                                        Описание
                                    </h3>
                                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Specifications - Compact on mobile */}
                            {(product.material || product.dimensions || product.color) && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                                        <FiLayers className="w-3.5 h-3.5" />
                                        Характеристики
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {product.material && (
                                            <div className="flex items-start gap-2">
                                                <FiBox className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-neutral-400 text-xs">Материал:</span>
                                                    <p className="text-neutral-900 font-medium">{product.material}</p>
                                                </div>
                                            </div>
                                        )}
                                        {product.dimensions && (
                                            <div className="flex items-start gap-2">
                                                <FiMaximize2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-neutral-400 text-xs">Размеры:</span>
                                                    <p className="text-neutral-900 font-medium">{product.dimensions}</p>
                                                </div>
                                            </div>
                                        )}
                                        {product.color && (
                                            <div className="flex items-start gap-2">
                                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="text-neutral-400 text-xs">Цвет:</span>
                                                    <p className="text-neutral-900 font-medium">{product.color}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Benefits - Compact */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 bg-neutral-50 rounded-xl">
                                <div className="flex items-center gap-2 text-xs">
                                    <FiTruck className="w-4 h-4 text-neutral-500" />
                                    <span className="text-neutral-700">Быстрая доставка</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <FiShield className="w-4 h-4 text-neutral-500" />
                                    <span className="text-neutral-700">Гарантия качества</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <FiCheck className="w-4 h-4 text-neutral-500" />
                                    <span className="text-neutral-700">Оригинальный товар</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Bottom CTA - Mobile-friendly */}
                    <div className="sticky bottom-0 p-4 bg-white border-t border-neutral-100 shadow-lg">
                        <Button
                            onClick={handleOrder}
                            disabled={product.stock === 0}
                            className="w-full h-12 sm:h-14 text-sm sm:text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-md"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            {product.stock === 0 ? "Нет в наличии" : "Заказать в WhatsApp"}
                        </Button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                
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
            `}</style>
        </>
    );
};
