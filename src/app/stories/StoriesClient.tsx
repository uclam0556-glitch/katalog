"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiX, FiShoppingBag, FiShare2, FiHeart } from "react-icons/fi";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";

interface StoriesClientProps {
    products: Product[];
}

import { generateProductSlug } from "@/utils/slug";

export default function StoriesClient({ products }: StoriesClientProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const STORY_DURATION = 5000; // 5 seconds per slide
    const UPDATE_INTERVAL = 50; // update progress every 50ms

    // Handle Auto-Play Progress
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    // Next slide
                    if (currentIndex < products.length - 1) {
                        scrollToSlide(currentIndex + 1);
                        return 0; // Reset progress for next slide
                    } else {
                        // End of stories - loop back or stop?
                        scrollToSlide(0);
                        return 0;
                    }
                }
                return prev + (100 / (STORY_DURATION / UPDATE_INTERVAL));
            });
        }, UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, products.length]);

    const scrollToSlide = (index: number) => {
        if (containerRef.current) {
            const height = containerRef.current.offsetHeight;
            containerRef.current.scrollTo({
                top: height * index,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
            setProgress(0); // Reset progress manually
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const height = containerRef.current.offsetHeight;
            const scrollTop = containerRef.current.scrollTop;
            const index = Math.round(scrollTop / height);
            if (index !== currentIndex) {
                setCurrentIndex(index);
                setProgress(0); // Reset progress manually
            }
        }
    };

    // Touch handlers for better control (optional, native snap works well but this ensures logic sync)
    // We rely mostly on native snap-mandatory for the UI feel, and onScroll to sync state.

    const togglePause = () => setIsPaused(!isPaused);

    const getProductUrl = (product: Product) => {
        // ALWAYS generate the slug on the fly to ensure it matches the 
        // expected format "transliterated-name---id" that the product page needs.
        // relying on product.slug from DB is risky if DB has raw names like "Столы и стулья"
        return `/product/${generateProductSlug(product)}`;
    };

    const handleShare = async (product: Product) => {
        setIsPaused(true);
        const url = window.location.origin + getProductUrl(product);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Посмотри ${product.name} в каталоге!`,
                    url: url,
                });
            } catch { console.log('Share cancelled'); }
        } else {
            // Clipboard fallback could go here
            console.log("Sharing not supported", url);
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black z-[100] text-white">

            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 z-20 pt-safe-top px-4 pb-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">

                {/* Progress Bars */}
                <div className="flex gap-1 mb-4 pointer-events-auto pt-4">
                    {products.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full bg-white transition-all duration-100 ease-linear",
                                    idx < currentIndex ? "w-full" :
                                        idx === currentIndex ? "w-full" : "w-0"
                                )}
                                style={{
                                    width: idx === currentIndex ? `${progress}%` : undefined
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pointer-events-auto">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    <div className="flex gap-4">

                    </div>
                </div>
            </div>

            {/* Main Snap Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {products.map((product, idx) => {
                    const isActive = idx === currentIndex;
                    // Product image priority: logic to use main image
                    const imageSrc = (product.images && product.images[0]) || product.thumbnail || "/placeholder.svg";
                    const productUrl = getProductUrl(product);

                    return (
                        <div
                            key={product.id}
                            className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black overflow-hidden"
                            onClick={togglePause} // Tap to pause/resume
                        >
                            {/* 1. Ambient Background (Blurred) */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={imageSrc}
                                    alt="background"
                                    fill
                                    className="object-cover blur-3xl opacity-40 scale-125"
                                    priority={idx <= 1}
                                />
                                <div className="absolute inset-0 bg-black/40" /> {/* Dimmer */}
                            </div>

                            {/* 2. Main Image - Click to Open */}
                            <Link
                                href={productUrl}
                                className="relative z-10 w-full h-[70vh] flex flex-col pt-safe-top px-4 active:scale-95 transition-transform"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={cn(
                                    "relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out",
                                    isActive && !isPaused ? "scale-100" : "scale-95 opacity-80"
                                )}>
                                    <Image
                                        src={imageSrc}
                                        alt={product.name}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority={idx <= 1}
                                        sizes="(max-width: 768px) 100vw, 500px"
                                    />
                                </div>
                            </Link>

                            {/* Content Overlay - "Glass Bottom Sheet" */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-[calc(1rem+env(safe-area-inset-bottom))] px-6 flex flex-col gap-4 pointer-events-none z-30">

                                <div className="pointer-events-auto w-full max-w-md mx-auto">
                                    <Link href={productUrl} className="block" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-end justify-between mb-4">
                                            <div className="flex-1 pr-4">
                                                {product.category && (
                                                    <div className="inline-flex px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-medium uppercase tracking-wider mb-2 text-white/90">
                                                        {product.category}
                                                    </div>
                                                )}

                                                <h2 className="text-2xl font-bold leading-tight mb-2 text-white font-sans">
                                                    {product.name}
                                                </h2>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-bold text-white">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-white/50 line-through">
                                                            {formatPrice(product.oldPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 pb-1">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Logic */ }}
                                                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 border border-white/10"
                                                >
                                                    <FiHeart className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShare(product); }}
                                                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 border border-white/10"
                                                >
                                                    <FiShare2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Main CTA */}
                                    <div className="flex justify-center w-full">
                                        <Link
                                            href={productUrl}
                                            className="inline-block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button className="px-8 w-auto h-12 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-black/80 transition-all active:scale-95 shadow-lg shadow-black/20">
                                                <FiShoppingBag className="w-4 h-4" />
                                                <span>Подробнее</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Desktop Hint */}
            <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-2 items-center text-white/30 pointer-events-none">
                <div className="text-xs uppercase tracking-widest rotate-90 origin-center mb-8">Скролл</div>
                <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="w-full bg-white/50 rounded-full transition-all duration-300"
                        style={{
                            height: `${((currentIndex + 1) / products.length) * 100}%`
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
