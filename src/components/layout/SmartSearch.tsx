"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { searchProductsAction } from "@/app/actions";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
import { generateProductSlug } from "@/utils/slug";

export const SmartSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce manual implementation since hook might not be there
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Perform Search
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const products = await searchProductsAction(debouncedQuery);
                setResults(products);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            // In a real app, this might go to a full search results page.
            // For now, we just close or could redirect to catalog with filter.
            // router.push(`/catalog?q=${query}`);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative transition-all duration-500 ease-out",
                isOpen ? "w-full md:w-96" : "w-10 md:w-10"
            )}
        >
            <form onSubmit={handleSearchSubmit} className="relative z-50">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Поиск мебели..."
                    className={cn(
                        "w-full h-10 bg-neutral-100/50 backdrop-blur-sm border border-transparent rounded-full pr-4 text-sm outline-none transition-all duration-300",
                        isOpen ? "pl-4 bg-white border-neutral-200 shadow-sm opacity-100 cursor-text" : "pl-10 opacity-0 cursor-pointer pointer-events-none"
                    )}
                />

                {/* Search Icon Trigger */}
                <div
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className={cn(
                        "absolute top-0 left-0 w-10 h-10 flex items-center justify-center text-neutral-500 cursor-pointer transition-all duration-300 hover:text-neutral-900",
                        isOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                    )}
                >
                    {isLoading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSearch className="w-5 h-5" />}
                </div>

                {/* Clear Button */}
                {query && isOpen && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}
            </form>

            {/* Live Results Dropdown */}
            {isOpen && (query.trim().length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out] ring-1 ring-black/5">
                    {/* Results List */}
                    {results.length > 0 ? (
                        <div className="py-2">
                            <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                                Найдено {results.length} товаров
                            </p>
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${generateProductSlug(product)}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100/50 transition-colors group"
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                                        <Image
                                            src={product.thumbnail || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-neutral-900 truncate group-hover:text-red-700 transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 truncate">
                                            {product.category}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-neutral-900 block">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-xs text-neutral-400 line-through block">
                                                {formatPrice(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            <Link
                                href="/catalog"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-center text-xs font-bold text-red-700 hover:text-red-800 transition border-t border-neutral-100 mt-1"
                            >
                                Смотреть все результаты
                            </Link>
                        </div>
                    ) : (
                        !isLoading && query.trim().length >= 2 && (
                            <div className="p-8 text-center text-neutral-400">
                                <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Ничего не найдено</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};
