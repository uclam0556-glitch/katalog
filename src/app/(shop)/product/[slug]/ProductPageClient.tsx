"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight, FiStar, FiShield, FiTruck, FiHeart, FiShare2, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { ProductCard } from "@/components/product/ProductCard";
import { InstallmentWidget } from "@/components/product/InstallmentWidget";
import { cn } from "@/lib/utils";

interface ProductPageClientProps {
    product: Product;
    similarProducts: Product[];
}

export default function ProductPageClient({ product, similarProducts }: ProductPageClientProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const allImages = React.useMemo(() => {
        const images = product.images && Array.isArray(product.images) && product.images.length > 0
            ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== "")
            : [];

        if (images.length > 0) return images;

        return product.thumbnail && typeof product.thumbnail === 'string' && product.thumbnail.trim() !== ""
            ? [product.thumbnail]
            : ["/placeholder.svg"]; // Fallback to prevent crash
    }, [product]);

    const handleOrder = () => {
        // Pass current window URL to ensure exact match and working link
        const currentUrl = typeof window !== 'undefined' ? window.location.href : undefined;
        const whatsappLink = generateWhatsAppLink("+79667422726", product, undefined, currentUrl);
        openWhatsApp(whatsappLink);
    };

    const scrollToImage = (index: number) => {
        setSelectedImageIndex(index);
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth;
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const index = Math.round(scrollLeft / width);
            setSelectedImageIndex(index);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans pb-24 md:pb-0 pt-28 md:pt-0">

            {/* Desktop Header Spacer */}
            <div className="hidden md:block h-32 md:h-40"></div>

            <div className="container-custom max-w-[90rem]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">

                    {/* --- LEFT COLUMN: IMMERSIVE GALLERY (Zara Home Style) --- */}
                    <div className="lg:col-span-7 relative">
                        {/* 
                           MOBILE: Aspect Ratio Slider 
                           - Clean 4:3 ratio (best for furniture)
                           - Snap scroll
                           - White background
                           - Object Contain (No cropping)
                        */}
                        <div className="lg:hidden w-full bg-white">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <div
                                    ref={scrollContainerRef}
                                    onScroll={handleScroll}
                                    className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar"
                                >
                                    {allImages.map((img, idx) => (
                                        <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative flex items-center justify-center p-4">
                                            <Image
                                                src={img}
                                                alt={`${product.name} - View ${idx + 1}`}
                                                fill
                                                className="object-contain"
                                                priority={idx === 0}
                                                onClick={() => setLightboxOpen(true)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Premium Pagination Dots */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                                    {allImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                                selectedImageIndex === idx
                                                    ? "bg-neutral-900 w-4"
                                                    : "bg-neutral-300"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 
                           DESKTOP: Sticky Grid / Main + Thumbs 
                           - Large main image
                           - Clean clean white canvas
                        */}
                        <div className="hidden lg:block sticky top-32">
                            <div className="bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm">
                                {/* Main Image Display */}
                                <div className="relative aspect-[4/3] w-full bg-white p-8 cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
                                    <Image
                                        src={allImages[selectedImageIndex]}
                                        alt={product.name}
                                        fill
                                        className="object-contain transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>

                                {/* Thumbnails Strip */}
                                {allImages.length > 1 && (
                                    <div className="flex gap-4 p-6 border-t border-neutral-100 overflow-x-auto">
                                        {allImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => scrollToImage(idx)}
                                                className={cn(
                                                    "relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-white p-2",
                                                    selectedImageIndex === idx
                                                        ? "border-neutral-900 opacity-100"
                                                        : "border-transparent opacity-60 hover:opacity-100 hover:bg-neutral-50"
                                                )}
                                            >
                                                <Image
                                                    src={img}
                                                    alt="thumb"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: CONTENT (Floating Sheet on Mobile) --- */}
                    <div className="lg:col-span-5 relative z-10 mt-4 lg:mt-0 mb-32">
                        <div className="bg-white rounded-[2rem] lg:rounded-none px-6 py-10 lg:px-0 lg:py-4 shadow-xl shadow-neutral-200/50 lg:shadow-none min-h-[50vh] animate-[slideUp_0.5s_ease-out]">

                            {/* Breadcrumbs (Desktop Only) */}
                            <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-400 mb-8 uppercase tracking-wider font-medium">
                                <Link href="/" className="hover:text-neutral-900">Главная</Link> /
                                <Link href="/catalog" className="hover:text-neutral-900">Каталог</Link> /
                                <span className="text-neutral-900">{product.category}</span>
                            </div>

                            {/* Header Info */}
                            <div className="mb-12 border-b border-neutral-100 pb-8">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <h1 className="text-2xl md:text-5xl font-bold font-serif text-neutral-900 leading-tight">
                                        {product.name}
                                    </h1>
                                    {/* Discount Badge */}
                                    {product.oldPrice &&
                                        typeof product.oldPrice === 'number' &&
                                        !isNaN(product.oldPrice) &&
                                        product.oldPrice > product.price && (
                                            <div className="flex flex-col items-end animate-[pulse_3s_infinite]">
                                                <span className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg shadow-red-200">
                                                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                                </span>
                                            </div>
                                        )}
                                </div>

                                <div className="flex items-center gap-4 text-sm mb-8">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <FiStar className="fill-current w-4 h-4" />
                                        <span className="font-bold text-neutral-900">5.0</span>
                                        <span className="text-neutral-400 font-normal">(12 отзывов)</span>
                                    </div>
                                    <span className="text-neutral-300">|</span>
                                    <span className={cn("font-medium", product.stock > 0 ? "text-green-600" : "text-neutral-400")}>
                                        {product.stock > 0 ? "В наличии" : "Под заказ"}
                                    </span>
                                </div>

                                {/* Price Section - Increased Visibility */}
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.oldPrice &&
                                        typeof product.oldPrice === 'number' &&
                                        !isNaN(product.oldPrice) &&
                                        product.oldPrice > product.price && (
                                            <div className="relative">
                                                <span className="text-xl md:text-2xl text-neutral-400 font-medium">
                                                    {formatPrice(product.oldPrice)}
                                                </span>
                                                {/* Diagonal Strike Line */}
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-400 -rotate-12 transform" />
                                            </div>
                                        )}
                                </div>
                                {product.oldPrice &&
                                    typeof product.oldPrice === 'number' &&
                                    !isNaN(product.oldPrice) &&
                                    product.oldPrice > product.price && (
                                        <p className="text-sm text-green-600 font-medium">
                                            Вы экономите {formatPrice(product.oldPrice - product.price)}
                                        </p>
                                    )}
                            </div>

                            {/* Actions (Desktop) */}
                            <div className="hidden lg:flex gap-4 mb-12 border-b border-neutral-100 pb-10">
                                <button
                                    onClick={handleOrder}
                                    className="flex-1 h-14 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    Оформить заказ
                                </button>
                                <button className="w-14 h-14 border border-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-50 transition-colors">
                                    <FiHeart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Description */}
                            <div className="mb-12">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-4 text-neutral-400">О модели</h3>
                                <div className={cn("prose prose-neutral max-w-none text-neutral-700 font-normal leading-relaxed text-lg", !showFullDesc && "line-clamp-4 lg:line-clamp-none")}>
                                    {product.description}
                                </div>
                                <button
                                    className="lg:hidden text-neutral-900 font-bold text-sm mt-3 underline decoration-neutral-300 underline-offset-4"
                                    onClick={() => setShowFullDesc(!showFullDesc)}
                                >
                                    {showFullDesc ? "Скрыть" : "Читать далее"}
                                </button>
                            </div>

                            {/* Characteristics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {/* Dimensions (Mapped from 'colors' field as user requested) */}
                                {product.colors && (
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-2">Размеры</p>
                                        <p className="font-bold text-neutral-900 text-lg">
                                            {product.colors}
                                        </p>
                                    </div>
                                )}

                                {product.materials && product.materials.length > 0 && (
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-2">Материал</p>
                                        <p className="font-bold text-neutral-900 text-lg">
                                            {product.materials.join(", ")}
                                        </p>
                                    </div>
                                )}

                                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-2">Гарантия</p>
                                    <p className="font-bold text-neutral-900 text-lg">12 мес.</p>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                        <FiTruck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Быстрая доставка</p>
                                        <p className="text-xs text-neutral-500">По Грозному и Чеченской Республике</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-2xl">
                                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                        <FiShield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Гарантия качества</p>
                                        <p className="text-xs text-neutral-500">Проверка перед отправкой</p>
                                    </div>
                                </div>
                            </div>

                            {/* Installment Calculator */}
                            <div className="mt-8">
                                <InstallmentWidget price={product.price} product={product} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products (Desktop Spacing) */}
                {similarProducts.length > 0 && (
                    <div className="mt-20 lg:mt-32 border-t border-neutral-200/60 pt-16 mb-10 px-6 lg:px-0">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">Вам может понравиться</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Action Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-neutral-200 lg:hidden z-40 safe-area-bottom">
                <div className="flex gap-3">
                    <button className="w-12 h-12 flex items-center justify-center border border-neutral-200 rounded-xl bg-white text-neutral-400">
                        <FiHeart className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleOrder}
                        className="flex-1 h-12 bg-neutral-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-neutral-900/20"
                    >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>Купить за {formatPrice(product.price)}</span>
                    </button>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10" onClick={() => setLightboxOpen(false)}>
                        <FiX className="w-8 h-8" />
                    </button>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={allImages[selectedImageIndex] || "/placeholder.svg"}
                            className="max-w-full max-h-full object-contain"
                            alt="Full screen"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
