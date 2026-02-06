"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiLogOut, FiPackage, FiPlus } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function TopNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-50">
            <div className="container mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo & Section Title */}
                <div className="flex items-center gap-8">
                    <Link href="/admin" className="hover:opacity-80 transition-opacity">
                        <span className="text-2xl font-black font-serif text-neutral-900">амэа</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-2 uppercase tracking-wide border border-amber-100">
                            Админ
                        </span>
                    </Link>

                    {/* Simple Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/admin"
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                                isActive("/admin")
                                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            <FiHome className="w-4 h-4" />
                            Главная
                        </Link>
                        <Link
                            href="/admin/products"
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                                isActive("/admin/products")
                                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            <FiPackage className="w-4 h-4" />
                            Все товары
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products/new"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        Добавить товар
                    </Link>

                    <div className="h-8 w-px bg-neutral-100 mx-2"></div>

                    <Link
                        href="/"
                        target="_blank"
                        className="p-2.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 rounded-xl transition-all"
                        title="Открыть сайт"
                    >
                        <FiLogOut className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
