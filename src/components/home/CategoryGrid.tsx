"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

// Map category slugs to generated images
const categoryImages: Record<string, string> = {
    "stulya": "/category_chairs.png",
    "stoly": "/category_tables.png",
    "divany": "/category_sofas.png",
    "stellazhi": "/category_shelves.png",
    "kitchen-furniture": "/category_kitchen.png",
    "chandeliers": "/category_lights.png",
    "bedroom-furniture": "/category_bedroom.png",
    "decor": "/category_decor.png",
};

export const CategoryGrid: React.FC = () => {
    return (
        <section className="py-8 md:py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-6 md:mb-12">
                    <h2 className="text-xl md:text-4xl font-bold text-neutral-900 mb-2 md:mb-4">
                        Категории
                    </h2>
                    <p className="text-sm md:text-base text-neutral-600 max-w-xl mx-auto px-4">
                        Выберите категорию
                    </p>
                </div>

                {/* Category Grid - 3 cols mobile, 4 cols desktop, centered */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.slug}`}
                            className="group relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-neutral-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Category Image */}
                            <Image
                                src={categoryImages[category.slug] || "/placeholder.png"}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 33vw, 25vw"
                            />

                            {/* Overlay with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Category Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                                <h3 className="text-white font-bold text-xs md:text-lg mb-0.5 md:mb-1">
                                    {category.name}
                                </h3>
                                <p className="hidden md:block text-white/80 text-xs line-clamp-2">
                                    {category.description}
                                </p>
                            </div>

                            {/* Hover Arrow - desktop only */}
                            <div className="hidden md:flex absolute top-3 right-3 w-7 h-7 bg-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                    className="w-3.5 h-3.5 text-neutral-900"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
