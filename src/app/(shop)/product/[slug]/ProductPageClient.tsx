"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageClientProps {
    product: Product;
    similarProducts: Product[];
}

export default function ProductPageClient({ product, similarProducts }: ProductPageClientProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const allImages = React.useMemo(() => {
        return product.images && product.images.length > 0
            ? product.images
            : [product.thumbnail];
    }, [product]);

    const handleOrder = () => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-white pt-24 md:pt-32 pb-32 md:pb-16">
            {/* Breadcrumbs - Desktop Only */}
            <div className="border-b border-neutral-100 hidden md:block mb-8">
                <div className="container mx-auto px-6 max-w-7xl py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Link href="/" className="hover:text-red-600 transition">
                            Главная
                        </Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-red-600 transition">
                            Каталог
                        </Link>
                        <span>/</span>
                        <span className="text-neutral-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section - Premium Layout */}
            <div className="container mx-auto px-5 md:px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">

                    {/* LEFT: Gallery - Clean & Spacious */}
                    <div className="space-y-5">
                        {/* Main Image */}
                        <div
                            className="relative aspect-[3/4] md:aspect-[4/3] bg-neutral-50 rounded-3xl overflow-hidden cursor-zoom-in border border-neutral-100 group"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />

                            {/* Hover Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                                    >
                                        <FiChevronLeft className="w-5 h-5 text-neutral-800" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                                    >
                                        <FiChevronRight className="w-5 h-5 text-neutral-800" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails - Horizontal Scroll */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                ? "border-red-600 ring-2 ring-red-100"
                                                : "border-neutral-200 hover:border-neutral-300"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details - Generous Spacing */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="inline-block px-3 py-1.5 bg-neutral-100 text-neutral-600 text-xs font-semibold uppercase tracking-wider rounded-full">
                                {product.category}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-[1.2] tracking-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-4xl md:text-5xl font-bold text-red-600">
                                    {formatPrice(product.price)}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold uppercase tracking-wide rounded-full">
                                        В наличии
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 bg-neutral-100 text-neutral-500 text-sm font-bold uppercase tracking-wide rounded-full">
                                        Нет в наличии
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-t border-neutral-100 pt-8">
                            <p className="text-neutral-600 text-base leading-relaxed max-w-prose">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="border-t border-neutral-100 pt-8">
                            <h3 className="font-bold text-xl text-neutral-900 mb-6">Характеристики</h3>

                            <div className="space-y-4">
                                {product.dimensions && (product.dimensions.width > 0 || product.dimensions.height > 0) && (
                                    <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                        <span className="text-neutral-500 font-medium">Размеры (ШxГxВ)</span>
                                        <span className="font-semibold text-neutral-900 text-right">
                                            {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} см
                                        </span>
                                    </div>
                                )}

                                {product.materials && product.materials.length > 0 && (
                                    <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                        <span className="text-neutral-500 font-medium">Материалы</span>
                                        <span className="font-semibold text-neutral-900 text-right max-w-[60%]">{product.materials.join(", ")}</span>
                                    </div>
                                )}

                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex justify-between items-center py-4 border-b border-neutral-100">
                                        <span className="text-neutral-500 font-medium">Цвет</span>
                                        <span className="font-semibold text-neutral-900 text-right">{product.colors.join(", ")}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center py-4">
                                    <span className="text-neutral-500 font-medium">Артикул</span>
                                    <span className="font-mono text-sm text-neutral-400">{product.sku}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:block pt-6">
                            <button
                                onClick={handleOrder}
                                disabled={product.stock === 0}
                                className="w-full h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-neutral-300 disabled:to-neutral-300 text-white font-bold text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <FaWhatsapp className="w-6 h-6" />
                                {product.stock > 0 ? "Заказать в WhatsApp" : "Нет в наличии"}
                            </button>
                            <p className="text-center text-sm text-neutral-400 mt-4">
                                Менеджер ответит в течение 5 минут
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA - Premium */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-md border-t border-neutral-100 z-50 safe-area-pb">
                <button
                    onClick={handleOrder}
                    disabled={product.stock === 0}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-green-500 active:from-green-700 active:to-green-600 disabled:from-neutral-300 disabled:to-neutral-300 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all"
                >
                    <FaWhatsapp className="w-6 h-6 animate-pulse" />
                    <span>{product.stock > 0 ? "Заказать в WhatsApp" : "Нет в наличии"}</span>
                </button>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="bg-neutral-50 py-16 md:py-20 mt-16">
                    <div className="container mx-auto px-5 md:px-6 max-w-7xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8">Похожие товары</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                    >
                        <FiX className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative w-full max-w-6xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={allImages[selectedImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1536px) 100vw, 1536px"
                        />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-2xl"
                                >
                                    <FiChevronLeft className="w-7 h-7" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-2xl"
                                >
                                    <FiChevronRight className="w-7 h-7" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-base font-medium px-5 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </div>
    );
}
