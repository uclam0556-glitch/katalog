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
        <section className="py-12 md:py-24 bg-white">
            <div className="container mx-auto px-3 md:px-4 max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold text-neutral-900 mb-3 md:mb-4">
                        Категории мебели
                    </h2>
                    <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
                        Выберите категорию и найдите идеальную мебель для вашего дома
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.slug}`}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Category Image */}
                            <Image
                                src={categoryImages[category.slug] || "/placeholder.png"}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* Overlay with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Category Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-white font-bold text-lg md:text-2xl mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm line-clamp-2">
                                    {category.description}
                                </p>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg
                                    className="w-4 h-4 text-neutral-900"
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
