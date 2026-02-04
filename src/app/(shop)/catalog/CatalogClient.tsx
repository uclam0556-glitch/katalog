"use client";

import React from "react";
import { FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
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
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [sortBy, setSortBy] = React.useState<SortOption>("popular");
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

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

    const handleProductClick = (product: Product) => setSelectedProduct(product);
    const handleAddToCart = (product: Product) => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900 pointer-events-auto">
            {/* Elegant Header */}
            <div className="pt-40 pb-12 text-center bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4 block animate-[fadeIn_0.6s]">
                        Каталог 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-neutral-900 mb-6 tracking-tight leading-tight animate-[slideUp_0.6s_0.1s_both]">
                        Коллекция <span className="italic font-light text-neutral-500">Мебели</span>
                    </h1>
                </div>
            </div>

            {/* Sticky Minimalist Filter Bar */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4 md:gap-8">

                        {/* Categories - Minimal Text Links */}
                        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide mask-fade-right justify-center md:justify-start">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "text-sm font-medium tracking-wide uppercase transition-all duration-300 relative py-2 shrink-0 group",
                                    selectedCategory === null ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                                )}
                            >
                                Все
                                <span className={cn(
                                    "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-neutral-900 transition-all duration-300",
                                    selectedCategory === null ? "w-full" : "w-0 group-hover:w-1/3"
                                )} />
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                                    className={cn(
                                        "text-sm font-medium tracking-wide uppercase transition-all duration-300 relative py-2 shrink-0 group",
                                        selectedCategory === category.slug ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                                    )}
                                >
                                    {category.name}
                                    <span className={cn(
                                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-neutral-900 transition-all duration-300",
                                        selectedCategory === category.slug ? "w-full" : "w-0 group-hover:w-1/3"
                                    )} />
                                </button>
                            ))}
                        </div>

                        {/* Search & Sort - Elegant Icons */}
                        <div className="flex items-center gap-6 shrink-0 relative">
                            {/* Search */}
                            <div className={cn(
                                "flex items-center transition-all duration-300 border-b border-transparent",
                                isSearchOpen ? "w-full md:w-64 border-neutral-200" : "w-auto"
                            )}>
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="p-2 hover:opacity-70 transition-opacity"
                                >
                                    <FiSearch className="w-5 h-5 text-neutral-900" />
                                </button>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск..."
                                    className={cn(
                                        "bg-transparent outline-none text-sm font-medium placeholder:text-neutral-400 transition-all duration-300",
                                        isSearchOpen ? "w-full pl-2 opacity-100" : "w-0 pl-0 opacity-0 bg-transparent"
                                    )}
                                    style={{ visibility: isSearchOpen ? 'visible' : 'hidden' }}
                                />
                                {searchQuery && isSearchOpen && (
                                    <button onClick={() => setSearchQuery("")} className="p-2 text-neutral-400 hover:text-neutral-900">
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-px h-4 bg-neutral-200" />

                            {/* Sort */}
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-transparent pr-6 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 cursor-pointer outline-none hover:opacity-70 transition-opacity"
                                >
                                    <option value="popular">Популярное</option>
                                    <option value="newest">Новинки</option>
                                    <option value="price-asc">Сначала дешевле</option>
                                    <option value="price-desc">Сначала дороже</option>
                                </select>
                                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-900 pointer-events-none group-hover:rotate-180 transition-transform duration-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container-custom py-16">

                {/* Products Grid */}
                {filteredAndSortedProducts.length > 0 ? (
                    <div className="animate-[fadeIn_0.8s_ease-out]">
                        <ProductGrid
                            products={filteredAndSortedProducts}
                            onProductClick={handleProductClick}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                ) : (
                    <div className="py-32 text-center animate-[fadeIn_0.5s_ease-out]">
                        <p className="text-2xl font-serif text-neutral-300 mb-4 italic">No results found</p>
                        <p className="text-neutral-500 max-w-sm mx-auto mb-8 font-light">
                            Попробуйте изменить категорию или поисковый запрос
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                            className="text-xs font-bold uppercase tracking-widest border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-all"
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
