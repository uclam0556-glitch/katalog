import { getProducts } from "@/lib/db";
import { FiPackage, FiDollarSign, FiTrendingUp, FiAlertCircle, FiPlus } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await getProducts();

    // Real Statistics from Database
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.active).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;
    const recentProducts = products.slice(0, 5);

    const stats = [
        {
            name: "Активных товаров",
            value: activeProducts,
            subtitle: `из ${totalProducts} всего`,
            icon: FiPackage,
            bgGradient: "from-blue-500 to-cyan-500",
        },
        {
            name: "Общая стоимость",
            value: `${Math.round(totalValue / 1000)}K ₽`,
            subtitle: "товаров в наличии",
            icon: FiDollarSign,
            bgGradient: "from-emerald-500 to-teal-500",
        },
        {
            name: "Низкий остаток",
            value: lowStock,
            subtitle: "требуют внимания",
            icon: FiTrendingUp,
            bgGradient: "from-amber-500 to-orange-500",
        },
        {
            name: "Нет в наличии",
            value: outOfStock,
            subtitle: "товаров",
            icon: FiAlertCircle,
            bgGradient: "from-red-500 to-rose-500",
        },
    ];

    return (
        <div className="max-w-screen-2xl mx-auto space-y-8 mt-12">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Обзор вашего магазина</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stat.subtitle}
                                    </p>
                                </div>
                                <div
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                                >
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid - Quick Actions LEFT, Products RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Card - LEFT COLUMN */}
                <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg text-white">
                    <h2 className="text-xl font-bold mb-6">Быстрые действия</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/products/new"
                            className="block w-full px-4 py-3.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <FiPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Добавить товар</p>
                                    <p className="text-xs text-white/70">Новый товар в каталог</p>
                                </div>
                            </div>
                        </Link>
                        <Link
                            href="/admin/products"
                            className="block w-full px-4 py-3.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <FiPackage className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Все товары</p>
                                    <p className="text-xs text-white/70">Управление каталогом</p>
                                </div>
                            </div>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="block w-full px-4 py-3.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    👁️
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Посмотреть сайт</p>
                                    <p className="text-xs text-white/70">Открыть в новой вкладке</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Stats Summary */}
                    <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-xs text-white/70 mb-2">Краткая сводка</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-2xl font-bold">{totalProducts}</p>
                                <p className="text-xs text-white/70">Всего товаров</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3">
                                <p className="text-2xl font-bold">{activeProducts}</p>
                                <p className="text-xs text-white/70">Активных</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Products - RIGHT 2 COLUMNS */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Последние товары</h2>
                        <Link
                            href="/admin/products"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Все товары →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentProducts.length === 0 ? (
                            <div className="py-12 text-center">
                                <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm mb-4">Нет товаров</p>
                                <Link
                                    href="/admin/products/new"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Добавить первый товар
                                </Link>
                            </div>
                        ) : (
                            recentProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}`}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {product.thumbnail ? (
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.name}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <FiPackage className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {product.category}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <p className="font-bold text-sm text-gray-900">
                                            {product.price.toLocaleString("ru-RU")} ₽
                                        </p>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium ${(product.stock || 0) === 0
                                                ? "bg-red-50 text-red-700"
                                                : (product.stock || 0) < 10
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-emerald-50 text-emerald-700"
                                                }`}
                                        >
                                            {product.stock || 0} шт
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
