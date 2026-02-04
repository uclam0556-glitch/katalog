"use client";

import { getProducts } from "@/lib/db";
import Link from "next/link";
import { FiPlus, FiEdit, FiPackage, FiSearch, FiX } from "react-icons/fi";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Product } from "@/types/product";

interface ProductsClientProps {
    initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const searchParams = useSearchParams();
    const urlSearchQuery = searchParams.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return initialProducts;

        const query = searchQuery.toLowerCase();
        return initialProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.sku?.toLowerCase().includes(query)
        );
    }, [initialProducts, searchQuery]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
                    <p className="text-gray-600 mt-2">
                        {filteredProducts.length} из {initialProducts.length} товаров
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                >
                    <FiPlus className="w-4 h-4" />
                    Добавить товар
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по названию, категории, артикулу..."
                        className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center">
                        <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? "Ничего не найдено" : "Нет товаров"}
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            {searchQuery
                                ? "Попробуйте изменить поисковый запрос"
                                : "Добавьте первый товар в каталог"}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/admin/products/new"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                <FiPlus className="w-4 h-4" />
                                Добавить товар
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Товар
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Категория
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Цена
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Остаток
                                    </th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Статус
                                    </th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {product.thumbnail ? (
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <FiPackage className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm text-gray-900 truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {product.sku || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-sm text-gray-900">
                                                {product.price.toLocaleString("ru-RU")} ₽
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${(product.stock || 0) === 0
                                                        ? "bg-red-50 text-red-700"
                                                        : (product.stock || 0) < 10
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-emerald-50 text-emerald-700"
                                                    }`}
                                            >
                                                {product.stock || 0} шт
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${product.active
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {product.active ? "Активен" : "Неактивен"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Редактировать"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </Link>
                                                <DeleteProductButton
                                                    id={product.id}
                                                    productName={product.name}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
