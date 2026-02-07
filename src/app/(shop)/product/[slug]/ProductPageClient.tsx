"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiStar, FiShield, FiTruck, FiHeart } from "react-icons/fi";
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
    const [qty, setQty] = useState(1);

    const allImages = React.useMemo(() => {
        return product.images && product.images.length > 0
            ? product.images
            : [product.thumbnail];
    }, [product]);

    const handleOrder = () => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product); // Passing product to helper, qty would need to be handled manually or added to helper if supported
        // For now, simple open
        openWhatsApp(whatsappLink);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans pb-32">
            {/* Header Spacer - Matching Catalog's compressed feel */}
            <div className="h-32 md:h-40"></div>

            {/* Breadcrumbs - Elegant & Minimal */}
            <div className="container mx-auto px-4 md:px-8 max-w-[90rem] mb-8 animate-[fadeIn_0.6s_ease-out]">
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium tracking-widest text-neutral-400 uppercase">
                    <Link href="/" className="hover:text-amber-600 transition-colors">Главная</Link>
                    <span className="text-amber-300">•</span>
                    <Link href="/catalog" className="hover:text-amber-600 transition-colors">Каталог</Link>
                    <span className="text-amber-300">•</span>
                    <span className="text-neutral-900 border-b border-amber-200 pb-0.5">{product.category}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[90rem]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">

                    {/* LEFT: GALLERY (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6 animate-[fadeInUp_0.8s_ease-out_forwards]">
                        {/* Main Image Stage */}
                        <div
                            className="relative aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] bg-neutral-100 rounded-[2rem] overflow-hidden cursor-zoom-in shadow-2xl shadow-neutral-200/50 group"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Floating Controls */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-neutral-900 rounded-full flex items-center justify-center transition-all border border-white/30"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-neutral-900 rounded-full flex items-center justify-center transition-all border border-white/30"
                                    >
                                        <FiChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex gap-2">
                                {product.oldPrice && (
                                    <span className="bg-red-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg text-white">
                                        SALE
                                    </span>
                                )}
                                {product.stock > 0 ? (
                                    <span className="bg-green-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg text-white">
                                        В наличии
                                    </span>
                                ) : (
                                    <span className="bg-neutral-900/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg text-white">
                                        Под заказ
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImageIndex === index
                                            ? "ring-2 ring-amber-500 ring-offset-2 opacity-100 scale-95 shadow-lg"
                                            : "opacity-70 hover:opacity-100 hover:scale-105"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`View ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAILS (5 Cols) - Sticky */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32 space-y-8 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] opacity-0 pb-10">

                            {/* Title Block */}
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-neutral-900 leading-[1.1]">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                                    <span>Арт. {product.sku || "—"}</span>
                                </div>
                            </div>

                            {/* Price Block */}
                            <div className="flex items-baseline gap-4 border-b border-neutral-100 pb-8">
                                <span className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tight">
                                    {formatPrice(product.price)}
                                </span>
                                {product.oldPrice && (
                                    <span className="text-xl text-neutral-400 line-through decoration-red-500/50 decoration-2">
                                        {formatPrice(product.oldPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="prose prose-neutral max-w-none">
                                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-3">Описание</h3>
                                <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-light whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Features Grid - Improved Spacing & Logic */}
                            <div className="pt-4 border-t border-neutral-100 space-y-6">
                                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest mb-2">Характеристики</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Dimensions / Colors */}
                                    {product.colors && product.colors.length > 0 && (
                                        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Размеры / Варианты</p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.colors.map((color, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-1 bg-white rounded-md text-sm font-medium text-neutral-900 border border-neutral-200">
                                                        {color}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Materials */}
                                    {product.materials && product.materials.length > 0 && (
                                        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Материалы</p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.materials.map((material, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-1 bg-white rounded-md text-sm font-medium text-neutral-900 border border-neutral-200">
                                                        {material}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback for real Dimensions object if present */}
                                    {product.dimensions && (product.dimensions.width > 0 || product.dimensions.height > 0) && (
                                        <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Габариты</p>
                                            <p className="font-medium text-neutral-900">
                                                {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} см
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-y-4 text-sm text-neutral-600 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-full">
                                        <FiShield className="w-4 h-4" />
                                    </div>
                                    <span>Гарантия качества</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-full">
                                        <FiTruck className="w-4 h-4" />
                                    </div>
                                    <span>Бережная доставка</span>
                                </div>
                            </div>

                            {/* Actions Desktop */}
                            <div className="hidden md:flex gap-4 pt-4">
                                <button
                                    onClick={handleOrder}
                                    className="flex-1 h-16 bg-neutral-900 text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    <FaWhatsapp className="w-6 h-6" />
                                    Оформить заказ
                                </button>
                                <button className="w-16 h-16 rounded-2xl border-2 border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                                    <FiHeart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Bar - Glassmorphism */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50"></div>
                <div className="relative p-2 flex items-center gap-3">
                    <div className="pl-4">
                        <p className="text-xs text-neutral-400 font-medium uppercase">Итого</p>
                        <p className="text-lg font-bold text-neutral-900">{formatPrice(product.price)}</p>
                    </div>
                    <button
                        onClick={handleOrder}
                        className="flex-1 h-12 bg-neutral-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                        <FaWhatsapp className="w-4 h-4" />
                        Заказать
                    </button>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="mt-32 border-t border-neutral-200/50 pt-20 bg-white">
                    <div className="container mx-auto px-6 max-w-[90rem]">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold font-serif text-neutral-900">Вам может понравиться</h2>
                            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-neutral-500 hover:text-amber-600 transition font-medium">
                                Смотреть всё <FiChevronRight />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-neutral-900/95 backdrop-blur-2xl flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" onClick={() => setLightboxOpen(false)}>
                        <FiX className="w-10 h-10" />
                    </button>
                    <img src={allImages[selectedImageIndex]} className="max-w-[90vw] max-h-[90vh] object-contain drop-shadow-2xl" alt="" />
                </div>
            )}
        </div>
    );
}
