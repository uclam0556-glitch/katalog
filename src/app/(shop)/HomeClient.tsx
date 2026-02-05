"use client";

import React from "react";
import Link from "next/link";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";

interface HomeClientProps {
    initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
    const featuredProducts = initialProducts.filter((p) => p.featured);

    const handleAddToCart = (product: Product) => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <div className="min-h-screen bg-white pt-24">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Featured Products */}
            <section className="py-10 md:py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-2 md:mb-4">
                            Популярные товары
                        </h2>
                        <p className="text-sm md:text-base text-neutral-600 mb-3 md:mb-4">
                            Самые популярные модели нашего каталога
                        </p>
                        <Link
                            href="/catalog"
                            className="inline-block text-sm text-red-700 hover:text-red-800 font-medium underline"
                        >
                            Посмотреть весь каталог →
                        </Link>
                    </div>

                    <ProductGrid
                        products={featuredProducts}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </section>

            {/* Benefits Bar - After products */}
            <section className="py-6 md:py-8 bg-neutral-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5">Бесплатная доставка</h3>
                                <p className="text-xs text-neutral-600">При заказе от 50 000₽</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5">Гарантия 2 года</h3>
                                <p className="text-xs text-neutral-600">На всю мебель</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5">Сборка в подарок</h3>
                                <p className="text-xs text-neutral-600">Бесплатная сборка</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
