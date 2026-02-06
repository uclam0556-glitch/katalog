"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiPackage, FiPlus, FiExternalLink, FiTrendingUp } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TopNav() {
    const pathname = usePathname();
    const [stats, setStats] = useState({ count: 0, total: 0 });

    useEffect(() => {
        // Fetch stats from API
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(() => setStats({ count: 0, total: 0 }));
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-lg border-b border-neutral-200 z-50 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between max-w-7xl">

                {/* Logo & Brand */}
                <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-black font-serif text-neutral-900">амэа</span>
                    <span className="text-[10px] font-bold text-white bg-neutral-900 px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Admin
                    </span>
                </Link>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        href="/admin"
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                            isActive("/admin")
                                ? "bg-neutral-900 text-white shadow-md"
                                : "text-neutral-600 hover:bg-neutral-100"
                        )}
                    >
                        <FiHome className="w-4 h-4" />
                        Главная
                    </Link>
                    <Link
                        href="/admin/products"
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                            isActive("/admin/products")
                                ? "bg-neutral-900 text-white shadow-md"
                                : "text-neutral-600 hover:bg-neutral-100"
                        )}
                    >
                        <FiPackage className="w-4 h-4" />
                        Все товары
                    </Link>
                </nav>

                {/* Stats & Actions */}
                <div className="flex items-center gap-3">
                    {/* Stats Indicator */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                        <FiTrendingUp className="w-4 h-4 text-emerald-600" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-emerald-600 font-semibold uppercase">Товаров</span>
                            <span className="text-sm font-bold text-neutral-900">{stats.count} шт</span>
                        </div>
                        <div className="w-px h-8 bg-emerald-200 mx-2"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-emerald-600 font-semibold uppercase">Сумма</span>
                            <span className="text-sm font-bold text-neutral-900">{stats.total.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>

                    {/* Add Product Button */}
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-neutral-900/20 transition-all active:scale-95"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Добавить товар</span>
                    </Link>

                    {/* View Site Button */}
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-all"
                        title="Открыть сайт"
                    >
                        <FiExternalLink className="w-4 h-4" />
                        Посмотреть сайт
                    </Link>
                </div>
            </div>
        </header>
    );
}
