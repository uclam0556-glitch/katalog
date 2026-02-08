"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPackage, FiBarChart2, FiSettings, FiLogOut, FiGrid } from "react-icons/fi";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Товары", href: "/admin/products", icon: FiPackage },
    { name: "Аналитика", href: "/admin/analytics", icon: FiBarChart2 },
    { name: "Категории", href: "/admin/categories", icon: FiGrid },
    { name: "Настройки", href: "/admin/settings", icon: FiSettings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 flex flex-col">
            {/* User Profile / Context (Optional) */}
            <div className="p-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Меню
                </div>

                {/* Navigation List */}
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 transition-colors flex-shrink-0",
                                        isActive
                                            ? "text-indigo-600"
                                            : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                <span className={cn(
                                    "font-medium text-sm",
                                    isActive && "font-semibold"
                                )}>
                                    {item.name}
                                </span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md bg-indigo-600" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-gray-200"
                >
                    <FiLogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span className="font-medium text-sm">Вернуться на сайт</span>
                </Link>
            </div>
        </aside>
    );
}
