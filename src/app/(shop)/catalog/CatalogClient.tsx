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
        <div className="min-h-screen bg-white pt-20">

            {/* Filter Section - Clean & Static */}
            <div className="border-b border-neutral-200 bg-white">
                <div className="container mx-auto px-4 max-w-7xl py-6">

                    {/* Categories - Wrapping Grid */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === null
                                    ? "bg-neutral-900 text-white"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            )}
                        >
                            Все
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    selectedCategory === category.slug
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск мебели..."
                                className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        >
                            <option value="popular">Популярное</option>
                            <option value="newest">Новинки</option>
                            <option value="price-asc">Сначала дешевле</option>
                            <option value="price-desc">Сначала дороже</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Section - Clean Spacing */}
            <div className="container mx-auto px-4 max-w-7xl py-8">
                {filteredAndSortedProducts.length > 0 ? (
                    <ProductGrid
                        products={filteredAndSortedProducts}
                        onAddToCart={handleAddToCart}
                    />
                ) : (
                    <div className="py-32 text-center">
                        <p className="text-2xl font-medium text-neutral-300 mb-4">Ничего не найдено</p>
                        <p className="text-neutral-500 mb-8">
                            Попробуйте изменить категорию или поисковый запрос
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                            className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
