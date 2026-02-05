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
        <div className="min-h-screen bg-white pt-28 md:pt-40 pb-24 md:pb-0">
            {/* Breadcrumbs */}
            <div className="border-b border-neutral-200 hidden md:block">
                <div className="container mx-auto px-4 max-w-7xl py-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Link href="/" className="hover:text-red-700 transition">
                            Главная
                        </Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-red-700 transition">
                            Каталог
                        </Link>
                        <span>/</span>
                        <span className="text-neutral-900">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section - Ultra-Quality Mobile Layout */}
            <div className="container mx-auto px-0 md:px-4 max-w-7xl py-0 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-10">

                    {/* LEFT: Gallery (Mobile Swipe / Desktop Grid) */}
                    <div className="relative group">
                        {/* Mobile: Native Scroll Snap Carousel */}
                        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:hidden aspect-[4/3] w-full bg-neutral-100">
                            {allImages.map((image, index) => (
                                <div key={index} className="snap-center shrink-0 w-full h-full relative">
                                    <Image
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Mobile: Dots Indicator */}
                        {allImages.length > 1 && (
                            <div className="flex md:hidden justify-center gap-1.5 absolute bottom-4 left-0 right-0 z-10 pointer-events-none">
                                {allImages.map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Desktop: Classic Gallery */}
                        <div
                            className="hidden md:block relative aspect-[4/3] bg-neutral-50 rounded-lg overflow-hidden cursor-zoom-in border border-neutral-100"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                priority
                                sizes="50vw"
                            />
                        </div>

                        {/* Desktop: Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="hidden md:grid grid-cols-5 gap-3 mt-4">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? "border-neutral-900 opacity-100"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="px-4 md:px-0 py-6 md:py-0 space-y-6">
                        {/* Title & Price Block */}
                        <div>
                            <div className="text-xs md:text-sm text-neutral-500 mb-2 uppercase tracking-wide font-medium">
                                {product.category}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 leading-tight mb-3">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-3 pb-4 border-b border-neutral-100">
                                <span className="text-3xl md:text-5xl font-bold text-red-600">
                                    {formatPrice(product.price)}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                        В наличии
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                        Нет в наличии
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm text-neutral-600 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Specifications - Corrected Dimensions */}
                        <div className="pt-4 border-t border-neutral-100">
                            <h3 className="font-bold text-lg mb-4">Характеристики</h3>

                            <div className="space-y-3 text-sm">
                                {product.dimensions && (product.dimensions.width > 0 || product.dimensions.height > 0) && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                                        <span className="text-neutral-500">Размеры (ШxГxВ)</span>
                                        <span className="font-medium text-neutral-900">
                                            {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} см
                                        </span>
                                    </div>
                                )}

                                {product.materials && product.materials.length > 0 && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                                        <span className="text-neutral-500">Материалы</span>
                                        <span className="font-medium text-neutral-900 text-right">{product.materials.join(", ")}</span>
                                    </div>
                                )}

                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                                        <span className="text-neutral-500">Цвет</span>
                                        <span className="font-medium text-neutral-900 text-right">{product.colors.join(", ")}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                                    <span className="text-neutral-500">Артикул</span>
                                    <span className="font-mono text-neutral-400">{product.sku}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop CTA (Hidden on mobile) */}
                        <div className="hidden md:block pt-6">
                            <button
                                onClick={handleOrder}
                                disabled={product.stock === 0}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 text-white font-bold text-lg rounded-lg transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.99] transform"
                            >
                                <FaWhatsapp className="w-6 h-6" />
                                {product.stock > 0 ? "Заказать в WhatsApp" : "Нет в наличии"}
                            </button>
                            <p className="text-center text-xs text-neutral-400 mt-3">
                                Менеджер ответит в течение 5 минут
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-neutral-200 z-50 safe-area-pb">
                <button
                    onClick={handleOrder}
                    disabled={product.stock === 0}
                    className="w-full py-3.5 bg-green-600 active:bg-green-700 disabled:bg-neutral-300 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>{product.stock > 0 ? "Заказать в WhatsApp" : "Нет в наличии"}</span>
                </button>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="bg-neutral-50 py-10 md:py-16 mt-8 md:mt-0">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8">Похожие товары</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                    className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                    >
                        <FiX className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-[4/3] animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={allImages[selectedImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1280px) 100vw, 1280px"
                        />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-lg"
                                >
                                    <FiChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition shadow-lg"
                                >
                                    <FiChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-medium px-4 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </div>
    );
}
