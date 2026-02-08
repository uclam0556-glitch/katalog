"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiPackage, FiPlus, FiExternalLink, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TopNav() {
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



    // Close mobile menu when path changes - Removed useEffect to avoid set-state-in-effect lint error
    // Instead, we close the menu when a link is clicked.

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/admin", label: "Главная", icon: FiHome },
        { href: "/admin/products", label: "Все товары", icon: FiPackage },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 z-50 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between max-w-7xl">

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors active:scale-95"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Меню"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>

                        <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                            <span className="text-xl md:text-2xl font-black font-serif text-neutral-900 tracking-tight group-hover:tracking-normal transition-all duration-300">амэа</span>
                            <span className="text-[10px] font-bold text-white bg-neutral-900 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md shadow-neutral-900/20">
                                Admin
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Menu - Desktop */}
                    <nav className="hidden lg:flex items-center gap-2 bg-neutral-100/50 p-1.5 rounded-2xl border border-neutral-200/50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                                    isActive(link.href)
                                        ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                                        : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                                )}
                            >
                                <link.icon className={cn("w-4 h-4", isActive(link.href) ? "text-neutral-900" : "text-neutral-400")} />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* View Site Button - Desktop only */}
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-sm font-bold transition-all active:scale-95"
                            title="Открыть сайт"
                        >
                            <span className="hidden lg:inline">Открыть сайт</span>
                            <FiExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Add Product Button - Always visible */}
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-neutral-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 active:scale-95"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Добавить товар</span>
                            <span className="sm:hidden">Создать</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-16 left-0 w-full bg-white z-40 lg:hidden border-b border-neutral-200 shadow-xl animate-[slideDown_0.3s_ease-out] overflow-hidden rounded-b-3xl">
                        <div className="p-4 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)} // Close on click
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98]",
                                        isActive(link.href)
                                            ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                                            : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                                    )}
                                >
                                    <link.icon className={cn("w-5 h-5", isActive(link.href) ? "text-neutral-400" : "text-neutral-400")} />
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-px bg-neutral-100 my-1" />

                            <Link
                                href="/"
                                target="_blank"
                                className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-neutral-600 hover:bg-neutral-50 active:scale-[0.98] transition-all"
                            >
                                <FiExternalLink className="w-5 h-5 text-neutral-400" />
                                Перейти на сайт
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
