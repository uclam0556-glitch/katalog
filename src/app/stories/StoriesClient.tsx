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
        // WhatsApp style: slug is primary, id is fallback. 
        // Ensure we don't end up with /product/undefined or /product/
        if (product.slug && product.slug.trim().length > 0) {
            return `/product/${product.slug}`;
        }
        return `/product/${product.id}`; // Fallback to ID which [slug] page handles
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

                            {/* 2. Main Image (Contain) - iOS Style */}
                            <Link
                                href={productUrl}
                                className="relative z-10 w-full h-full flex flex-col pt-24 pb-[calc(14rem+env(safe-area-inset-bottom))] px-10 md:px-0 md:max-w-[85%] mx-auto active:scale-95 transition-transform"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={cn(
                                    "relative w-full flex-1 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out bg-black/20 backdrop-blur-sm border border-white/10",
                                    isActive && !isPaused ? "scale-100" : "scale-95 opacity-80"
                                )}>
                                    <Image
                                        src={imageSrc}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4"
                                        priority={idx <= 1}
                                        sizes="(max-width: 768px) 100vw, 500px"
                                    />
                                </div>
                            </Link>

                            {/* Gradient Overlay for Text Readability - Minimal */}
                            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 pb-[calc(5rem+env(safe-area-inset-bottom))] flex flex-col gap-4 pointer-events-none animate-[slideUp_0.3s_ease-out] z-30 w-full md:max-w-md mx-auto">

                                <div className="pointer-events-auto px-10 w-full max-w-[400px] mx-auto">
                                    <Link href={productUrl} className="block" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-end justify-between mb-6">
                                            <div className="flex-1 pr-4">
                                                {/* Category Tag */}
                                                {product.category && (
                                                    <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 text-white/90 shadow-sm">
                                                        {product.category}
                                                    </div>
                                                )}

                                                <h2 className="text-2xl font-bold leading-tight mb-3 text-white drop-shadow-lg font-serif">
                                                    {product.name}
                                                </h2>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-bold text-white bg-white/10 px-3 py-1 rounded-xl backdrop-blur-md border border-white/10">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-white/60 line-through decoration-white/60 decoration-1">
                                                            {formatPrice(product.oldPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Side Actions (Like/Share) */}
                                            <div className="flex flex-col gap-4 pb-1">
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
                                    <Link
                                        href={productUrl}
                                        className="block w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button className="w-full h-14 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all active:scale-95 shadow-xl shadow-black/20">
                                            <FiShoppingBag className="w-5 h-5" />
                                            <span>Подробнее</span>
                                        </button>
                                    </Link>
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
