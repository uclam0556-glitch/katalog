"use client";

import React from "react";
import Link from "next/link";
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

/**
 * Professional Header Component - Clean Minimal Design
 */
export const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Главная" },
        { href: "/catalog", label: "Каталог" },
        { href: "/about", label: "О нас" },
        { href: "/contacts", label: "Контакты" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${isScrolled ? "shadow-md" : "border-b border-neutral-200"
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🪑</span>
                        </div>
                        <span className="font-bold text-2xl text-neutral-900">
                            амэа
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center gap-6">
                        <button
                            className="hidden md:block p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                            aria-label="Поиск"
                        >
                            <FiSearch className="w-6 h-6" />
                        </button>

                        <button
                            className="hidden md:block p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
                            aria-label="Избранное"
                        >
                            <FiHeart className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

                        <button
                            className="hidden md:block p-2 text-neutral-700 hover:text-neutral-900 transition-colors relative"
                            aria-label="Корзина"
                        >
                            <FiShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-neutral-700"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Меню"
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-200">
                    <nav className="container-custom py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-3 px-4 text-neutral-700 hover:bg-neutral-50 rounded-lg font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-4 px-4 pt-4 border-t border-neutral-200">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors">
                                <FiSearch className="w-5 h-5" />
                                <span>Поиск</span>
                            </button>
                            <button className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
                                <FiHeart className="w-5 h-5" />
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
