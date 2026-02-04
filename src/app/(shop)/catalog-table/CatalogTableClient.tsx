"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { cn } from "@/lib/utils";

interface CatalogTableClientProps {
    products: Product[];
    categories: { id: string; name: string; slug: string }[];
}

export default function CatalogTableClient({ products, categories }: CatalogTableClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

    // Filter and sort products
    const filteredProducts = React.useMemo(() => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory !== "all") {
            const category = categories.find((c) => c.slug === selectedCategory);
            if (category) {
                filtered = filtered.filter((p) => p.category === category.name);
            }
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.sku?.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortBy === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
    }, [products, categories, selectedCategory, searchQuery, sortBy]);

    const handleOrder = (product: Product) => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header Section */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-3 md:px-4 max-w-7xl py-8 md:py-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-3">
                        Каталог мебели
                    </h1>
                    <p className="text-neutral-600 text-sm md:text-base">
                        Все товары в одной таблице
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-3 md:px-4 max-w-7xl py-4">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Поиск товаров..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none w-full md:w-auto pl-4 pr-10 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition bg-white"
                            >
                                <option value="all">Все категории</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none w-full md:w-auto pl-4 pr-10 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition bg-white"
                            >
                                <option value="name">По названию</option>
                                <option value="price-asc">Цена: возр.</option>
                                <option value="price-desc">Цена: убыв.</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-3 text-sm text-neutral-600">
                        Найдено товаров: <span className="font-semibold">{filteredProducts.length}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="container mx-auto px-3 md:px-4 max-w-7xl py-6 md:py-8">
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Фото
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Название
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Категория
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Цена
                                </th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Наличие
                                </th>
                                <th className="text-right py-4 px-4 text-sm font-semibold text-neutral-700">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-neutral-100 hover:bg-neutral-50 transition"
                                >
                                    <td className="py-4 px-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-semibold text-neutral-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
                                                {product.description}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-neutral-600">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-bold text-lg text-neutral-900">
                                            {formatPrice(product.price)} ₽
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {product.stock > 0 ? (
                                            <span className="text-sm text-green-700 font-medium">
                                                В наличии ({product.stock})
                                            </span>
                                        ) : (
                                            <span className="text-sm text-neutral-400">
                                                Нет в наличии
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => handleOrder(product)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                                        >
                                            <FaWhatsapp className="w-4 h-4" />
                                            Заказать
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-neutral-500">Товары не найдены</p>
                        </div>
                    )}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="flex gap-4 p-4">
                                {/* Image */}
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-neutral-500 mb-1">
                                        {product.category}
                                    </p>
                                    <h3 className="font-bold text-neutral-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg font-bold text-neutral-900 mb-2">
                                        {formatPrice(product.price)} ₽
                                    </p>
                                    {product.stock > 0 ? (
                                        <span className="text-sm text-green-700 font-medium">
                                            В наличии ({product.stock})
                                        </span>
                                    ) : (
                                        <span className="text-sm text-neutral-400">
                                            Нет в наличии
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="px-4 pb-4">
                                <button
                                    onClick={() => handleOrder(product)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    Заказать в WhatsApp
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Товары не найдены
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
