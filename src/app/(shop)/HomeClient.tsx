"use client";

import React from "react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/types/product";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";

interface HomeClientProps {
    initialProducts: Product[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
    const featuredProducts = initialProducts.filter((p) => p.featured);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleAddToCart = (product: Product) => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Slider */}
            <HeroSlider />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Benefits Bar */}
            <section className="py-8 bg-neutral-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Бесплатная доставка</h3>
                            <p className="text-sm text-neutral-600">При заказе от 50 000₽</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Гарантия 2 года</h3>
                            <p className="text-sm text-neutral-600">На всю мебель</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Сборка в подарок</h3>
                            <p className="text-sm text-neutral-600">Бесплатная сборка мебели</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4">
                            Популярные товары
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Самые популярные модели нашего каталога
                        </p>
                    </div>

                    <ProductGrid
                        products={featuredProducts}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </section>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
