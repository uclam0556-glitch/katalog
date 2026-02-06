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
    FiCheck, FiMoreVertical
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
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
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

    const toggleProductSelection = (id: string) => {
        const newSet = new Set(selectedProducts);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedProducts(newSet);
    };

    const selectAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    icon={<FiPackage />}
                    label="Всего товаров"
                    value={stats.total.toString()}
                    trend="+12%"
                    color="blue"
                />
                <StatsCard
                    icon={<FiDollarSign />}
                    label="Общая стоимость"
                    value={`${(stats.totalValue / 1000).toFixed(0)}K ₽`}
                    trend="+8%"
                    color="emerald"
                />
                <StatsCard
                    icon={<FiTrendingUp />}
                    label="В наличии"
                    value={stats.inStock.toString()}
                    trend={`${Math.round(stats.inStock / stats.total * 100)}%`}
                    color="green"
                />
                <StatsCard
                    icon={<FiAlertCircle />}
                    label="Низкий остаток"
                    value={stats.lowStock.toString()}
                    trend="требует внимания"
                    color="amber"
                />
            </div>

            {/* Main Panel */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Title & Quick Stats */}
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                                    Управление товарами
                                </h1>
                                <p className="text-sm text-neutral-500">
                                    {filteredProducts.length} из {products.length} товаров
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/products/new"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-neutral-900/10 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Добавить товар</span>
                                    <span className="sm:hidden">Добавить</span>
                                </Link>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="mt-6 space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск по названию, категории или артикулу..."
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-4 h-4 text-neutral-400" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Category Filters */}
                                <div className="flex-1 flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                            !selectedCategory
                                                ? "bg-neutral-900 text-white shadow-sm"
                                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        )}
                                    >
                                        Все
                                    </button>
                                    {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                                selectedCategory === cat
                                                    ? "bg-neutral-900 text-white shadow-sm"
                                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Sort & View */}
                                <div className="flex items-center gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                                        className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-900 cursor-pointer"
                                    >
                                        <option value="recent">Последние</option>
                                        <option value="name">По названию</option>
                                        <option value="price">По цене</option>
                                        <option value="stock">По остатку</option>
                                    </select>

                                    <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                viewMode === "grid"
                                                    ? "bg-white shadow-sm text-neutral-900"
                                                    : "text-neutral-500 hover:text-neutral-900"
                                            )}
                                        >
                                            <FiGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                viewMode === "list"
                                                    ? "bg-white shadow-sm text-neutral-900"
                                                    : "text-neutral-500 hover:text-neutral-900"
                                            )}
                                        >
                                            <FiList className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Display */}
                <div className="p-6">
                    {filteredProducts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
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

// Stats Card Component
function StatsCard({ icon, label, value, trend, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend: string;
    color: string;
}) {
    const colors = {
        blue: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-600",
        emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-600",
        green: "from-green-500/10 to-emerald-500/10 border-green-200 text-green-600",
        amber: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-600",
    };

    return (
        <div className={cn("rounded-2xl border bg-gradient-to-br p-5 transition-all hover:shadow-md", colors[color as keyof typeof colors])}>
            <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-xl bg-white/80 text-lg", colors[color as keyof typeof colors])}>
                    {icon}
                </div>
            </div>
            <p className="text-sm font-semibold text-neutral-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{value}</p>
            <p className="text-xs text-neutral-500 font-medium">{trend}</p>
        </div>
    );
}

// Product Card (Grid View)
function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group bg-white border-2 border-neutral-100 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all">
            <Link href={`/admin/products/${product.id}`}>
                <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiBox className="w-12 h-12 text-neutral-300" />
                        </div>
                    )}
                    {product.oldPrice && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                            SALE
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/admin/products/${product.id}`}>
                    <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-neutral-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-neutral-900">
                        {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    {product.oldPrice && (
                        <span className="text-sm text-neutral-400 line-through">
                            {product.oldPrice.toLocaleString('ru-RU')} ₽
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-lg",
                        (product.stock || 0) > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    )}>
                        {(product.stock || 0) > 0 ? `${product.stock} в наличии` : 'Нет в наличии'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/products/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all"
                    >
                        <FiEdit2 className="w-3 h-3" />
                        Редактировать
                    </Link>
                    <DeleteProductButton id={product.id} />
                </div>
            </div>
        </div>
    );
}

// Product List Item (List View)
function ProductListItem({ product }: { product: Product }) {
    return (
        <div className="group flex items-center gap-4 p-4 bg-white border-2 border-neutral-100 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all">
            <Link href={`/admin/products/${product.id}`} className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-neutral-50 relative overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiBox className="w-6 h-6 text-neutral-300" />
                        </div>
                    )}
                </div>
            </Link>

            <Link href={`/admin/products/${product.id}`} className="flex-1 min-w-0">
                <h3 className="font-bold text-neutral-900 text-sm truncate mb-1 group-hover:text-neutral-600 transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.sku || 'Без артикула'}</span>
                </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
                <span className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-lg",
                    (product.stock || 0) > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                )}>
                    {product.stock || 0} шт
                </span>
            </div>

            <div className="hidden md:block text-right">
                <div className="font-bold text-neutral-900">
                    {product.price.toLocaleString('ru-RU')} ₽
                </div>
                {product.oldPrice && (
                    <div className="text-xs text-neutral-400 line-through">
                        {product.oldPrice.toLocaleString('ru-RU')} ₽
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                    href={`/admin/products/${product.id}`}
                    className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                    title="Редактировать"
                >
                    <FiEdit2 className="w-4 h-4 text-neutral-600" />
                </Link>
                <DeleteProductButton id={product.id} />
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl font-semibold text-sm transition-all"
            >
                <FiPlus className="w-4 h-4" />
                Добавить товар
            </Link>
        </div>
    );
}
