"use client";

import { useState } from "react";
import { FiBell, FiSearch, FiUser, FiHome, FiPackage, FiBarChart2, FiSettings } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Товары", href: "/admin/products", icon: FiPackage },
    { name: "Аналитика", href: "/admin/analytics", icon: FiBarChart2 },
    { name: "Настройки", href: "/admin/settings", icon: FiSettings },
];

export default function TopNav() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/admin/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="h-16 px-6 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/admin" className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg">К</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">Каталог</span>
                    </div>
                </Link>

                {/* Navigation Menu - Horizontal */}
                <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Search - Center - FIXED PADDING */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск..."
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                        />
                    </div>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors">
                        <FiBell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="hidden lg:block text-sm font-semibold text-gray-900">Админ</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
