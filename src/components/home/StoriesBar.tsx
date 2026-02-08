"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn, translateCategory } from "@/lib/utils";

interface StoriesBarProps {
    products: Product[];
}

import { FiGrid } from "react-icons/fi";

export function StoriesBar({ products }: StoriesBarProps) {
    // 1. Get unique categories that have products with images
    const validProducts = products.filter(p => (p.images && p.images.length > 0) || p.thumbnail);

    const categoriesMap = new Map<string, Product>();
    validProducts.forEach(p => {
        if (p.category) {
            const displayCategory = translateCategory(p.category);
            // Group by the DISPLAY name (Translated)
            if (!categoriesMap.has(displayCategory)) {
                categoriesMap.set(displayCategory, p);
            }
        }
    });

    const categories = Array.from(categoriesMap.entries());

    if (categories.length === 0 && validProducts.length === 0) return null;

    return (
        <div className="w-full bg-white py-2 border-b border-neutral-100/50 sticky top-[68px] z-40 shadow-sm/50">
            {/* Added sticky positioning to stay visible but below header. 
                Moved down to top-[70px] (slightly higher) and increased pt-4 for better spacing.
            */}
            <div className="container-custom overflow-x-auto scrollbar-hide py-1">
                <div className="flex gap-4 md:gap-6 min-w-max px-4">

                    {/* "ALL" Stories - Premium Icon */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer group">
                        <Link href="/stories">
                            <div className="w-[64px] h-[64px] p-[3px] rounded-full border-2 border-transparent bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:scale-105 transition-transform duration-300 shadow-md">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-[2px]">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
                                        <FiGrid className="w-6 h-6 text-neutral-800" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <span className="text-xs text-neutral-800 font-medium max-w-[64px] truncate text-center">
                            Все
                        </span>
                    </div>

                    {/* Category Circles */}
                    {categories.map(([categoryName, coverProduct]) => {
                        const imageSrc = (coverProduct.images && coverProduct.images[0]) || coverProduct.thumbnail || "/placeholder.svg";
                        const displayCategory = translateCategory(categoryName);

                        return (
                            <Link
                                key={categoryName}
                                href={`/stories?category=${encodeURIComponent(categoryName)}`}
                                className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
                            >
                                {/* Gradient Ring */}
                                <div className="w-[64px] h-[64px] p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                                    {/* White gap */}
                                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                                        {/* Image Container */}
                                        <div className="w-full h-full rounded-full overflow-hidden relative bg-neutral-100">
                                            <Image
                                                src={imageSrc}
                                                alt={displayCategory}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-neutral-800 font-medium max-w-[74px] truncate text-center leading-tight capitalize">
                                    {displayCategory}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
