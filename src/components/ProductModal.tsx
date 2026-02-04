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
 * Single view, vertical flow, high-end catalog style
 */
export const ProductModal: React.FC<ProductModalProps> = ({
    product,
    isOpen: isOpenProp,
    onClose,
}) => {
    const [isZoomed, setIsZoomed] = React.useState(false);
    // Auto-derive isOpen from product if not explicitly provided
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

            {/* Modal Container */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 transition-all duration-300",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-[scaleIn_0.3s_ease-out]">

                    {/* Close Button - High Contrast */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2.5 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full transition-all text-neutral-800 hover:scale-110 active:scale-95 sm:bg-white/90 sm:hover:bg-neutral-100 sm:text-neutral-900 shadow-sm border border-black/5"
                        aria-label="Закрыть"
                    >
                        <FiX className="w-5 h-5" />
                    </button>

                    {/* Left Column: Image - Fixed Height & Visibility */}
                    <div className="w-full md:w-[55%] h-[45vh] md:h-auto min-h-[300px] relative bg-neutral-100 group shrink-0 flex items-center justify-center overflow-hidden">
                        {/* Background placeholder in case image loads slowly */}
                        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />

                        <div
                            className={cn(
                                "relative w-full h-full cursor-zoom-in transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                                isZoomed ? "scale-150 cursor-zoom-out z-20" : "scale-100 hover:scale-105"
                            )}
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <Image
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 55vw"
                            />
                            {/* Gradient Overlay for visual depth on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none md:hidden" />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 z-10">
                            {product.stock < 5 && product.stock > 0 && (
                                <span className="inline-flex items-center px-3 py-1.5 bg-white/95 backdrop-blur text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-sm">
                                    Осталось {product.stock} шт
                                </span>
                            )}
                        </div>

                        <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300">
                            <FiMaximize2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Увеличить</span>
                        </div>
                    </div>

                    {/* Right Column: Scrollable Content */}
                    <div className="w-full md:w-[45%] h-full flex flex-col bg-white overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar">
                            {/* Header Info */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest rounded">
                                        {product.category}
                                    </span>
                                    {product.sku && (
                                        <span className="text-[10px] text-neutral-400 font-mono">
                                            ART. {product.sku}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                                    {product.name}
                                </h2>

                                <div className="flex items-baseline gap-4 pb-6 border-b border-neutral-100">
                                    <span className="text-3xl font-medium text-neutral-900 tracking-tight">
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

                            {/* Description & Specs Flow */}
                            <div className="space-y-10">
                                {/* Description Block */}
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-3 opacity-40">
                                        О товаре
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed text-base font-light">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Specs Grid Block */}
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-4 opacity-40">
                                        Детали
                                    </h3>

                                    <div className="border-t border-neutral-100 divide-y divide-neutral-100">
                                        {product.materials && product.materials.length > 0 && (
                                            <div className="py-3 flex justify-between items-start gap-4">
                                                <span className="text-sm font-medium text-neutral-900 shrink-0">Материалы</span>
                                                <div className="text-right">
                                                    {product.materials.map((m, i) => (
                                                        <span key={i} className="text-sm text-neutral-500 block">
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {product.dimensions && (
                                            <div className="py-3 flex justify-between items-center gap-4">
                                                <span className="text-sm font-medium text-neutral-900">Габариты</span>
                                                <span className="text-sm text-neutral-500 font-mono">
                                                    {product.dimensions.width}×{product.dimensions.depth}×{product.dimensions.height} см
                                                </span>
                                            </div>
                                        )}

                                        {product.colors && (
                                            <div className="py-3 flex justify-between items-center gap-4">
                                                <span className="text-sm font-medium text-neutral-900">Цвет</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-neutral-500">{product.colors.join(", ")}</span>
                                                    <div className="w-3 h-3 rounded-full bg-[#D4C4B7] border border-neutral-200" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3 pt-2 pb-6">
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                                        <FiTruck className="w-4 h-4 text-neutral-400" />
                                        Быстрая доставка
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                                        <FiShield className="w-4 h-4 text-neutral-400" />
                                        Гарантия 2 года
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Actions Footer */}
                        <div className="p-6 border-t border-neutral-100 bg-white z-10 shrink-0">
                            <Button
                                variant="whatsapp"
                                size="lg"
                                onClick={handleOrder}
                                disabled={product.stock === 0}
                                className="w-full h-14 text-base font-bold shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <FaWhatsapp className="w-6 h-6 mr-2" />
                                Оформить заказ в WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
