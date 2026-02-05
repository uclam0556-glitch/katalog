"use client";

import React from "react";
import { FiSearch, FiX, FiFilter, FiChevronDown } from "react-icons/fi";
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

    // Sidebar content component
    const CategorySidebar = ({ mobile = false }) => (
        <div className={cn(
            "bg-white rounded-xl border border-neutral-200",
            mobile ? "p-4" : "p-6 sticky top-24"
        )}>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Категории</h3>
            <div className="space-y-1">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group",
                        selectedCategory === null
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                            : "hover:bg-neutral-50"
                    )}
                >
                    <span className="font-medium text-sm">Все товары</span>
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        selectedCategory === null
                            ? "bg-white/20"
                            : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
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
                                "w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group",
                                selectedCategory === category.slug
                                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                                    : "hover:bg-neutral-50"
                            )}
                        >
                            <span className="font-medium text-sm">{category.name}</span>
                            <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                selectedCategory === category.slug
                                    ? "bg-white/20"
                                    : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50" style={{ paddingTop: "50px" }}>

            {/* Hero Section - Warm & Welcoming */}
            <div className="relative bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 border-b border-amber-200/50">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2Y1OWU0MiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
                <div className="container relative mx-auto px-4 md:px-6 max-w-7xl py-12 md:py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4 leading-tight">
                            Каталог
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> мебели</span>
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                            Откройте для себя коллекцию изящной мебели, которая превратит ваш дом в произведение искусства
                        </p>

                        {/* Premium Search */}
                        <div className="relative max-w-2xl group">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Что вы ищете? Диван, стол, кресло..."
                                className="w-full pl-14 pr-14 py-5 bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base font-medium transition-all shadow-lg shadow-amber-900/5 placeholder:text-neutral-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-900 transition-colors hover:bg-neutral-100 rounded-lg"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Sidebar + Products */}
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8">

                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-amber-200 rounded-xl font-medium text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <FiFilter className="w-4 h-4" />
                            <span>Фильтры</span>
                            {selectedCategory && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs">
                                    {categories.find(c => c.slug === selectedCategory)?.name}
                                </span>
                            )}
                        </div>
                        <FiChevronDown className={cn(
                            "w-4 h-4 transition-transform",
                            isMobileFilterOpen && "rotate-180"
                        )} />
                    </button>

                    {isMobileFilterOpen && (
                        <div className="mt-4">
                            <CategorySidebar mobile />
                        </div>
                    )}
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <CategorySidebar />
                    </aside>

                    {/* Products Area */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
                            <p className="text-sm text-neutral-600">
                                {filteredAndSortedProducts.length === initialProducts.length
                                    ? `${filteredAndSortedProducts.length} товаров`
                                    : `Найдено ${filteredAndSortedProducts.length} из ${initialProducts.length}`
                                }
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="px-4 py-2 bg-white border-2 border-amber-200 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="popular">Популярное</option>
                                <option value="newest">Новинки</option>
                                <option value="price-asc">Дешевле</option>
                                <option value="price-desc">Дороже</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <ProductGrid
                                    products={filteredAndSortedProducts}
                                    onAddToCart={handleAddToCart}
                                />
                            </div>
                        ) : (
                            <div className="py-32 text-center animate-[fadeIn_0.4s_ease-out]">
                                <div className="max-w-md mx-auto">
                                    <div className="text-6xl mb-6">🔍</div>
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-3">Ничего не найдено</h2>
                                    <p className="text-neutral-500 mb-8 leading-relaxed">
                                        Попробуйте изменить параметры поиска или выбрать другую категорию
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                                    >
                                        Сбросить фильтры
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
