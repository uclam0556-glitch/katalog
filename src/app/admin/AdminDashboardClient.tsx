"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import {
    FiSearch, FiPlus, FiFilter, FiDownload, FiGrid, FiList,
    FiTrendingUp, FiPackage, FiDollarSign, FiAlertCircle,
    FiEdit2, FiTrash2, FiEye, FiBox, FiChevronDown, FiX,
    FiCheck, FiMoreVertical, FiSliders
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

interface Props {
    initialProducts: Product[];
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "price" | "stock" | "recent";

export default function AdminDashboardClient({ initialProducts }: Props) {
    const [products] = useState(initialProducts);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

    // Calculate stats
    const stats = useMemo(() => {
        const total = products.length;
        const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
        const inStock = products.filter(p => (p.stock || 0) > 0).length;
        const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
        return { total, totalValue, inStock, lowStock };
    }, [products]);

    // Filter and sort
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(p => {
            const matchesSearch = !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || p.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        // Sort
        switch (sortBy) {
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "price":
                filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "stock":
                filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
                break;
            default:
                // recent - keep original order
                break;
        }

        return filtered;
    }, [products, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="min-h-screen pb-20 pt-4 px-2 md:px-0">
            {/* Stats Cards - Horizontal Scroll on Mobile */}
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 mb-4 gap-3 md:grid md:grid-cols-4 md:gap-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                <div className="min-w-[160px] md:min-w-0 snap-center">
                    <StatsCard
                        icon={<FiPackage />}
                        label="Товаров"
                        value={stats.total.toString()}
                        trend="+12%"
                        color="blue"
                    />
                </div>
                <div className="min-w-[160px] md:min-w-0 snap-center">
                    <StatsCard
                        icon={<FiDollarSign />}
                        label="Сумма"
                        value={`${(stats.totalValue / 1000).toFixed(0)}K ₽`}
                        trend="+8%"
                        color="emerald"
                    />
                </div>
                <div className="min-w-[160px] md:min-w-0 snap-center">
                    <StatsCard
                        icon={<FiTrendingUp />}
                        label="В наличии"
                        value={stats.inStock.toString()}
                        trend={`${Math.round(stats.inStock / stats.total * 100)}%`}
                        color="green"
                    />
                </div>
                <div className="min-w-[160px] md:min-w-0 snap-center">
                    <StatsCard
                        icon={<FiAlertCircle />}
                        label="Мало"
                        value={stats.lowStock.toString()}
                        trend="остаток"
                        color="amber"
                    />
                </div>
            </div>

            {/* Main Panel */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="border-b border-neutral-100 bg-white sticky top-0 z-20">
                    <div className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                            {/* Title & Mobile Actions */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 leading-tight">
                                        Товары
                                    </h1>
                                    <p className="text-xs md:text-sm text-neutral-500 mt-1">
                                        {filteredProducts.length} позиций
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all border border-neutral-200",
                                            showFilters ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 hover:bg-neutral-50"
                                        )}
                                    >
                                        <FiSliders className="w-4 h-4" />
                                        <span className="hidden sm:inline">Фильтры</span>
                                    </button>
                                </div>
                            </div>

                            {/* Collapsible Filters */}
                            <div className={cn(
                                "grid gap-4 transition-all duration-300 ease-in-out overflow-hidden",
                                showFilters ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="min-h-0 space-y-4 pt-2">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск по названию, артикулу..."
                                            className="w-full px-4 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                                        />
                                        {searchQuery ? (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-200 rounded-full transition-colors"
                                            >
                                                <FiX className="w-4 h-4 text-neutral-500" />
                                            </button>
                                        ) : (
                                            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        )}
                                    </div>

                                    {/* Category Filters */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                                                !selectedCategory
                                                    ? "bg-neutral-900 text-white border-neutral-900"
                                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                                            )}
                                        >
                                            Все
                                        </button>
                                        {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                                                    selectedCategory === cat
                                                        ? "bg-neutral-900 text-white border-neutral-900"
                                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort & View Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                                            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium focus:outline-none focus:border-neutral-900"
                                        >
                                            <option value="recent">Сначала новые</option>
                                            <option value="name">По названию</option>
                                            <option value="price">По цене</option>
                                            <option value="stock">По остатку</option>
                                        </select>

                                        <div className="flex bg-neutral-100 rounded-lg p-1">
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={cn(
                                                    "p-1.5 rounded-md transition-all",
                                                    viewMode === "list" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
                                                )}
                                            >
                                                <FiList className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={cn(
                                                    "p-1.5 rounded-md transition-all",
                                                    viewMode === "grid" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
                                                )}
                                            >
                                                <FiGrid className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Display */}
                <div className="p-4 md:p-6 bg-neutral-50/30 min-h-[500px]">
                    {filteredProducts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredProducts.map(product => (
                                        <ProductListItem key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Stats Card Component - Optimized using whitespace
function StatsCard({ icon, label, value, trend, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend: string;
    color: string;
}) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        green: "text-green-600 bg-green-50 border-green-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
    };

    return (
        <div className={cn("h-full rounded-xl border p-3 md:p-4 flex flex-col justify-between transition-all hover:shadow-sm bg-white", colors[color as keyof typeof colors].replace('text-', 'border-').split(' ')[2])}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
                <div className={cn("p-1.5 rounded-lg", colors[color as keyof typeof colors])}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">{value}</p>
                <p className={cn("text-xs font-medium mt-1 inline-flex items-center gap-1", colors[color as keyof typeof colors].split(' ')[0])}>
                    {trend.includes('+') ? <FiTrendingUp className="w-3 h-3" /> : null}
                    {trend}
                </p>
            </div>
        </div>
    );
}

// Product Card (Grid View)
function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group bg-white border border-neutral-100 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all flex flex-col h-full">
            <Link href={`/admin/products/${product.id}`} className="block relative aspect-square bg-neutral-100 overflow-hidden">
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 600px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <FiBox className="w-8 h-8" />
                    </div>
                )}
                {(product.stock || 0) <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded uppercase">Нет в наличии</span>
                    </div>
                )}
            </Link>

            <div className="p-3 flex flex-col flex-1">
                <div className="mb-auto">
                    <div className="text-[10px] text-neutral-500 font-medium mb-1 truncate">{product.category}</div>
                    <Link href={`/admin/products/${product.id}`}>
                        <h3 className="font-bold text-neutral-900 text-xs md:text-sm leading-snug line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-50/50 flex items-end justify-between">
                    <span className="font-bold text-sm md:text-base text-neutral-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <div className="flex gap-2">
                        <Link href={`/admin/products/${product.id}`} className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-600 transition-colors">
                            <FiEdit2 className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Product List Item (List View) - Mobile Optimized
function ProductListItem({ product }: { product: Product }) {
    return (
        <div className="group bg-white border border-neutral-100 rounded-xl p-3 hover:border-neutral-300 hover:shadow-md transition-all flex items-center gap-3 md:gap-4">
            {/* Thumbnail */}
            <Link href={`/admin/products/${product.id}`} className="flex-shrink-0 relative w-16 h-16 md:w-20 md:h-20 bg-neutral-100 rounded-lg overflow-hidden">
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <FiBox className="w-6 h-6" />
                    </div>
                )}
                {(product.stock || 0) <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <div className="text-[10px] text-neutral-500 font-medium truncate">{product.category}</div>
                        <Link href={`/admin/products/${product.id}`}>
                            <h3 className="font-bold text-neutral-900 text-sm truncate leading-tight group-hover:text-amber-600 transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <span className="font-bold text-sm text-neutral-900 whitespace-nowrap">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                        (product.stock || 0) > 0
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                    )}>
                        {(product.stock || 0) > 0 ? `${product.stock} шт` : '0 шт'}
                    </span>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                        >
                            Изменить
                        </Link>
                        <DeleteProductButton id={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Empty State
function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBox className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Товары не найдены
            </h3>
            <p className="text-neutral-500 text-sm mb-6">
                Попробуйте изменить фильтры или добавить новый товар
            </p>
            <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95"
            >
                <FiPlus className="w-4 h-4" />
                Добавить товар
            </Link>
        </div>
    );
}
