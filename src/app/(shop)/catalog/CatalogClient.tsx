"use client";

import React from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { cn } from "@/lib/utils";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

interface CatalogClientProps {
    initialProducts: Product[];
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const [sortBy, setSortBy] = React.useState<SortOption>("popular");

    // Filter and sort logic
    const filteredAndSortedProducts = React.useMemo(() => {
        let filtered = initialProducts.filter((product) => {
            const matchesSearch =
                searchQuery === "" ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                !selectedCategory ||
                product.category === categories.find((c) => c.slug === selectedCategory)?.name;

            return matchesSearch && matchesCategory;
        });

        switch (sortBy) {
            case "price-asc": filtered.sort((a, b) => a.price - b.price); break;
            case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
            case "newest": filtered.reverse(); break;
            default: break;
        }
        return filtered;
    }, [searchQuery, selectedCategory, sortBy, initialProducts]);

    const handleAddToCart = (product: Product) => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50">

            {/* Filter Section - Premium Design */}
            <div className="bg-white border-b border-neutral-100 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">

                    {/* Section Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">Каталог мебели</h1>

                    {/* Categories - Premium Pills with Smooth Animations */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95",
                                selectedCategory === null
                                    ? "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shadow-lg shadow-neutral-900/20"
                                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:shadow-md"
                            )}
                        >
                            Все товары
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95",
                                    selectedCategory === category.slug
                                        ? "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shadow-lg shadow-neutral-900/20"
                                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:shadow-md"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort Row - Premium Inputs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search - Elegant with Icon */}
                        <div className="relative flex-1 group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Найти идеальную мебель..."
                                className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white text-sm font-medium transition-all placeholder:text-neutral-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Sort - Premium Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white hover:bg-neutral-100 transition-all"
                        >
                            <option value="popular">🔥 Популярное</option>
                            <option value="newest">✨ Новинки</option>
                            <option value="price-asc">💰 Сначала дешевле</option>
                            <option value="price-desc">💎 Сначала дороже</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-neutral-500 mt-6">
                        {filteredAndSortedProducts.length === initialProducts.length
                            ? `Показано ${filteredAndSortedProducts.length} товаров`
                            : `Найдено ${filteredAndSortedProducts.length} из ${initialProducts.length} товаров`
                        }
                    </p>
                </div>
            </div>

            {/* Products Section - Ultra Clean */}
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12">
                {filteredAndSortedProducts.length > 0 ? (
                    <div className="animate-[fadeIn_0.6s_ease-out]">
                        <ProductGrid
                            products={filteredAndSortedProducts}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                ) : (
                    <div className="py-32 text-center animate-[fadeIn_0.4s_ease-out]">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-6">😔</div>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Ничего не найдено</h2>
                            <p className="text-neutral-500 mb-8 leading-relaxed">
                                Попробуйте изменить категорию или поисковый запрос
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                className="px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-neutral-900/20"
                            >
                                Сбросить все фильтры
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
