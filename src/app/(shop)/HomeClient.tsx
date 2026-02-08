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
                <div className="container-custom max-w-6xl">
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
            <section className="py-8 md:py-12 bg-neutral-50 mb-12">
                <div className="container-custom max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* High Quality */}
                        <div className="flex items-center gap-4 justify-center md:justify-start p-4 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-neutral-100">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiAward className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5 text-neutral-900">Высокое качество</h3>
                                <p className="text-xs text-neutral-500">Премиальные материалы</p>
                            </div>
                        </div>

                        {/* Warranty */}
                        <div className="flex items-center gap-4 justify-center md:justify-start p-4 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-neutral-100">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiShield className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5 text-neutral-900">Гарантия 2 года</h3>
                                <p className="text-xs text-neutral-500">На весь ассортимент</p>
                            </div>
                        </div>

                        {/* Unique Design */}
                        <div className="flex items-center gap-4 justify-center md:justify-start p-4 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-neutral-100">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <FiLayout className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm md:text-base mb-0.5 text-neutral-900">Уникальный дизайн</h3>
                                <p className="text-xs text-neutral-500">Эксклюзивные коллекции</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
