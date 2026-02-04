"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiTruck, FiAward, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import { generateWhatsAppLink, generateConsultationLink, openWhatsApp } from "@/utils/whatsapp";

// Client Component Wrapper
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

    const handleConsultation = () => {
        const link = generateConsultationLink("+79667422726");
        openWhatsApp(link);
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section - Strictly Centered */}
            <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-50 via-white to-primary-50/30 pt-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-200 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_2s]"></div>
                </div>

                <div className="relative z-10 w-full px-4 flex flex-col items-center">
                    <div className="w-full max-w-[1200px] flex flex-col items-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex justify-center px-6 py-3 bg-white rounded-full shadow-md border border-neutral-100 animate-[fadeIn_0.6s_ease-out]">
                            <span className="text-sm font-bold text-primary-600 tracking-wide uppercase text-center">
                                ✨ Новая коллекция 2026
                            </span>
                        </div>

                        {/* Title - Fixed Spacing and Size */}
                        <div className="space-y-4 py-4 animate-[slideUp_0.8s_ease-out]">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-neutral-900 tracking-tighter leading-[1.1]">
                                Премиальная <br className="sm:hidden" /> мебель
                            </h1>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-600 tracking-tight leading-[1.1]">
                                для вашего дома
                            </h2>
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-[slideUp_0.8s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
                            Современный дизайн, натуральные материалы и безупречное качество.
                            <br className="hidden sm:block" />
                            Создайте пространство вашей мечты уже сегодня.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 animate-[slideUp_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
                            <Link href="/catalog" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Смотреть каталог
                                    <FiArrowRight className="w-6 h-6" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleConsultation}
                                className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-neutral-50"
                            >
                                Получить консультацию
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Категории мебели
                        </h2>
                        <p className="text-lg text-neutral-600">
                            Выберите идеальную мебель для каждой комнаты
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/catalog?category=${category.slug}`}
                                className="group bg-neutral-50 hover:bg-white border-2 border-neutral-200 hover:border-primary-500 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                style={{
                                    animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                                }}
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold text-lg text-neutral-900 mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-neutral-600 mb-3">
                                    {initialProducts.filter((p) => p.category === category.name).length} товаров
                                </p>
                                <span className="inline-flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    Смотреть
                                    <FiArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-neutral-50">
                <div className="container-custom">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                                Популярные товары
                            </h2>
                            <p className="text-lg text-neutral-600">
                                Самые востребованные позиции нашего каталога
                            </p>
                        </div>
                        <Link href="/catalog" className="hidden md:block">
                            <Button variant="outline">
                                Весь каталог
                                <FiArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <ProductGrid
                        products={featuredProducts}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                    />

                    <div className="text-center mt-8 md:hidden">
                        <Link href="/catalog">
                            <Button variant="outline" size="lg">
                                Весь каталог
                                <FiArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Почему выбирают нас
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FiTruck className="w-8 h-8" />,
                                title: "Быстрая доставка",
                                description: "Доставка по всей России в течение 3-5 дней",
                                color: "primary",
                            },
                            {
                                icon: <FiAward className="w-8 h-8" />,
                                title: "Премиальное качество",
                                description: "Только натуральные материалы и проверенное производство",
                                color: "success",
                            },
                            {
                                icon: <FiShield className="w-8 h-8" />,
                                title: "Гарантия 2 года",
                                description: "Официальная гарантия и бесплатный сервис",
                                color: "neutral",
                            },
                        ].map((benefit, index) => (
                            <div
                                key={benefit.title}
                                className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 group"
                                style={{
                                    animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`,
                                }}
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${benefit.color === "primary" ? "bg-primary-100 text-primary-600" :
                                    benefit.color === "success" ? "bg-success-100 text-success-600" :
                                        "bg-neutral-200 text-neutral-700"
                                    }`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold text-xl text-neutral-900 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-neutral-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
