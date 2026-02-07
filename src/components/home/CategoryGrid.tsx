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
        <section className="py-6 md:py-16 bg-white">
            <div className="container-custom max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-4 md:mb-12">
                    <h2 className="text-lg md:text-4xl font-bold text-neutral-900 mb-1 md:mb-4">
                        Категории
                    </h2>
                    <p className="text-xs md:text-base text-neutral-600 max-w-xl mx-auto px-4">
                        Выберите категорию
                    </p>
                </div>

                {/* Ultra-Quality Mobile Grid: 2 columns, Perfect Spacing */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6 max-w-6xl mx-auto">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.slug}`}
                            className="group relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden bg-neutral-100 shadow-sm active:scale-95 transition-all duration-200"
                        >
                            {/* Category Image - High Quality fill */}
                            <Image
                                src={categoryImages[category.slug] || "/placeholder.png"}
                                alt={category.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                priority={category.order <= 4}
                            />

                            {/* Pro Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                            {/* Text Content - Readable & Clean */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-white font-bold text-sm md:text-xl leading-tight mb-1 drop-shadow-md">
                                    {category.name}
                                </h3>
                                <p className="text-white/80 text-[10px] md:text-sm font-medium line-clamp-1 opacity-90">
                                    {category.description}
                                </p>
                            </div>

                            {/* Mobile Tap Highlight (optional visual feedback) */}
                            <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
