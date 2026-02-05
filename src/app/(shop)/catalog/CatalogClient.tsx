"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX, FiFilter, FiChevronDown, FiHeart, FiShoppingBag, FiArrowRight } from "react-icons/fi";
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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    // Parallax logic & Scroll listener
    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    // MODERN SIDEBAR COMPONENT
    const CategorySidebar = ({ mobile = false }) => (
        <div className={cn(
            "backdrop-blur-xl bg-white/70 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden transition-all duration-500",
            mobile ? "p-5" : "p-6 sticky top-24"
        )}>
            <div className="flex items-center gap-2 mb-6 opacity-70">
                <div className="w-1 h-6 bg-amber-600 rounded-full"></div>
                <h3 className="text-lg font-bold font-serif text-neutral-900 tracking-wide">КОЛЛЕКЦИИ</h3>
            </div>

            <div className="space-y-1.5">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                        "w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                        selectedCategory === null
                            ? "text-white shadow-lg shadow-amber-900/20"
                            : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                    )}
                >
                    {selectedCategory === null && (
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-amber-950 z-0"></div>
                    )}
                    <span className="font-medium text-sm tracking-wide z-10 relative">Все товары</span>
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full z-10 relative transition-colors",
                        selectedCategory === null ? "bg-white/20 text-white" : "bg-neutral-100/50 text-neutral-400 group-hover:bg-amber-100 group-hover:text-amber-800"
                    )}>
                        {initialProducts.length}
                    </span>
                </button>
                {categories.map((category) => {
                    const count = initialProducts.filter(p => p.category === category.name).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                            className={cn(
                                "w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                                selectedCategory === category.slug
                                    ? "text-white shadow-lg shadow-amber-900/20"
                                    : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                            )}
                        >
                            {selectedCategory === category.slug && (
                                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-amber-950 z-0"></div>
                            )}
                            <span className="font-medium text-sm tracking-wide z-10 relative">{category.name}</span>
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full z-10 relative transition-colors",
                                selectedCategory === category.slug
                                    ? "bg-white/20 text-white"
                                    : "bg-neutral-100/50 text-neutral-400 group-hover:bg-amber-100 group-hover:text-amber-800"
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Decor element */}
            <div className="mt-8 pt-6 border-t border-neutral-200/50">
                <div className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-neutral-900/40 group-hover:bg-neutral-900/30 transition-colors z-10"></div>
                    <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt="Interior" />
                    <div className="absolute bottom-4 left-4 z-20">
                        <p className="text-white text-xs font-medium opacity-80 mb-1">Новая коллекция</p>
                        <p className="text-white font-serif italic text-lg">Spring 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans" style={{ paddingTop: "50px" }}>

            {/* ULTRA HERO SECTION */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] mx-auto max-w-[98%] mt-4 overflow-hidden shadow-2xl shadow-neutral-200/50 group">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80"
                        alt="Hero background"
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center max-w-7xl">
                    <div className="max-w-2xl opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium tracking-widest uppercase mb-6">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            Premium Collection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] font-serif tracking-tight">
                            Искусство <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-50 italic pr-4">жизни</span>
                            в деталях
                        </h1>
                        <p className="text-lg text-neutral-300 font-light leading-relaxed max-w-lg mb-8 backdrop-blur-sm">
                            Коллекция мебели, созданная для тех, кто ищет гармонию формы, функции и исключительного комфорта.
                        </p>

                        {/* Search Bar Floating */}
                        <div className="relative max-w-xl group/search">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl transform transition-transform group-hover/search:scale-[1.02]"></div>
                            <div className="relative flex items-center bg-white/95 rounded-2xl overflow-hidden shadow-2xl p-1.5 transition-all focus-within:ring-4 focus-within:ring-amber-500/20">
                                <FiSearch className="absolute left-6 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Найти то самое кресло..."
                                    className="w-full pl-14 pr-4 py-4 bg-transparent border-none text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0 text-base font-medium"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="p-2 mr-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400">
                                        <FiX />
                                    </button>
                                )}
                                <button className="hidden sm:flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl hover:bg-neutral-800 transition-all font-medium text-sm whitespace-nowrap">
                                    Найти
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATALOG BODY */}
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 md:py-20">
                <div className="lg:hidden mb-8">
                    <button
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-white border border-neutral-200 rounded-2xl font-medium shadow-sm active:scale-98 transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-900 text-white rounded-lg">
                                <FiFilter className="w-4 h-4" />
                            </div>
                            <span className="text-neutral-900">Категории и фильтры</span>
                        </div>
                        <div className={cn("p-2 rounded-full transition-all", isMobileFilterOpen ? "bg-neutral-100 rotate-180" : "bg-transparent")}>
                            <FiChevronDown className="w-5 h-5 text-neutral-500" />
                        </div>
                    </button>

                    <div className={cn(
                        "grid transition-all duration-300 ease-out overflow-hidden",
                        isMobileFilterOpen ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                        <div className="min-h-0">
                            <CategorySidebar mobile />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-[280px] flex-shrink-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards] opacity-0">
                        <CategorySidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Control Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div className="flex items-baseline gap-3">
                                <h2 className="text-3xl font-bold font-serif text-neutral-900">
                                    {selectedCategory
                                        ? categories.find(c => c.slug === selectedCategory)?.name
                                        : "Все товары"}
                                </h2>
                                <span className="text-neutral-400 font-medium text-sm">
                                    {filteredAndSortedProducts.length} items
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-neutral-500 hidden sm:block">Сортировать:</span>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="appearance-none bg-white border-none py-2.5 pl-5 pr-12 rounded-xl text-sm font-bold text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50 hover:bg-neutral-50 transition-colors"
                                    >
                                        <option value="popular">Популярности</option>
                                        <option value="newest">Новинкам</option>
                                        <option value="price-asc">Цене (низкая → высокая)</option>
                                        <option value="price-desc">Цене (высокая → низкая)</option>
                                    </select>
                                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none group-hover:text-amber-600 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="animate-[fadeIn_0.8s_ease-out_0.3s_forwards] opacity-0">
                                {/* Using existing ProductGrid but wrapping it to ensure styles leak correctly or pass props if needed */}
                                <ProductGrid
                                    products={filteredAndSortedProducts}
                                    onAddToCart={handleAddToCart}
                                />
                            </div>
                        ) : (
                            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-neutral-100 text-center animate-[fadeIn_0.5s_ease-out]">
                                <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <FiSearch className="w-10 h-10 text-amber-500/50" />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 mb-2 font-serif">Ничего не найдено</h3>
                                <p className="text-neutral-500 max-w-xs mx-auto mb-8">
                                    Попробуйте изменить запрос или сбросить фильтры
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                    className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 hover:shadow-lg transition-all active:scale-95"
                                >
                                    Очистить все
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add these keyframes to your global CSS or via tailwind config usually. 
// For now relying on standard tailwind animate classes or we can add style tag
