"use strict";
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

    const handleShare = async (product: Product) => {
        // Stop playback when sharing
        setIsPaused(true);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Посмотри ${product.name} в каталоге!`,
                    url: window.location.origin + `/product/${product.slug}`,
                });
            } catch { console.log('Share cancelled'); }
        } else {
            // Fallback
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black z-[100] text-white">

            {/* Header / Controls */}
            <div className="absolute top-0 left-0 right-0 z-20 pt-4 px-4 pb-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">

                {/* Progress Bars */}
                <div className="flex gap-1 mb-4 pointer-events-auto">
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

                    return (
                        <div
                            key={product.id}
                            className="h-[100dvh] w-full snap-start relative flex items-center justify-center bg-neutral-900 overflow-hidden"
                            onClick={togglePause} // Tap to pause/resume
                        >
                            {/* Background Image with Zoom Effect */}
                            <div className={cn(
                                "absolute inset-0 w-full h-full transition-transform duration-[10000ms] ease-out",
                                isActive && !isPaused ? "scale-110" : "scale-100" // Slow zoom when active
                            )}>
                                <Image
                                    src={imageSrc}
                                    alt={product.name}
                                    fill
                                    className="object-cover opacity-90"
                                    priority={idx <= 1} // Prioritize first two
                                />
                                <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}
                            </div>

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 md:pb-10 flex flex-col gap-4 pointer-events-none animate-[slideUp_0.3s_ease-out]">

                                <div className="pointer-events-auto">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {/* Category Tag */}
                                            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                                                {product.category}
                                            </div>
                                            <h2 className="text-3xl font-bold leading-tight mb-2 drop-shadow-md font-serif max-w-[80%]">
                                                {product.name}
                                            </h2>
                                            <div className="flex items-baseline gap-3 mb-4">
                                                <span className="text-2xl font-bold text-white">
                                                    {formatPrice(product.price)}
                                                </span>
                                                {product.oldPrice && (
                                                    <span className="text-lg text-white/60 line-through">
                                                        {formatPrice(product.oldPrice)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Short Description Limit */}
                                            <p className="text-sm text-white/80 line-clamp-2 max-w-md mb-6">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Side Actions */}
                                        <div className="flex flex-col gap-4 items-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); /* Add Like Logic */ }}
                                                className="flex flex-col items-center gap-1 group"
                                            >
                                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <FiHeart className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold">Like</span>
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleShare(product); }}
                                                className="flex flex-col items-center gap-1 group"
                                            >
                                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                    <FiShare2 className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold">Share</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main CTA */}
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="block w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button className="w-full h-14 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-neutral-200 transition-transform active:scale-95 shadow-lg shadow-white/10">
                                            <FiShoppingBag className="w-5 h-5" />
                                            Смотреть детали
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
