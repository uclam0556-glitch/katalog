"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface StoriesBarProps {
    products: Product[];
}

export function StoriesBar({ products }: StoriesBarProps) {
    // Filter only products that have images to show
    const stories = products.filter(p =>
        (p.images && p.images.length > 0) || p.thumbnail
    );

    if (stories.length === 0) return null;

    return (
        <div className="w-full bg-white pt-4 pb-2 border-b border-neutral-100/50">
            <div className="container-custom overflow-x-auto scrollbar-hide py-2">
                <div className="flex gap-4 md:gap-6 min-w-max px-4">
                    {/* Catalog Preview / "Your Story" style (Optional: linking to full catalog or special promo) */}
                    <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                        <div className="w-[72px] h-[72px] p-[3px] rounded-full border-2 border-neutral-100 group-hover:border-neutral-200 transition-colors">
                            <div className="w-full h-full rounded-full bg-neutral-50 flex items-center justify-center overflow-hidden relative">
                                <Link href="/stories" className="absolute inset-0 z-10" />
                                <div className="w-6 h-6 border-2 border-neutral-300 rounded-full flex items-center justify-center">
                                    <div className="w-0.5 h-3 bg-neutral-300 rounded-full absolute" />
                                    <div className="w-3 h-0.5 bg-neutral-300 rounded-full absolute" />
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-neutral-500 font-medium max-w-[70px] truncate text-center">
                            Все
                        </span>
                    </div>

                    {/* Active Stories */}
                    {stories.map((product) => {
                        const imageSrc = (product.images && product.images[0]) || product.thumbnail || "/placeholder.svg";

                        return (
                            <Link
                                key={product.id}
                                href="/stories"
                                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
                            >
                                {/* Gradient Ring */}
                                <div className="w-[72px] h-[72px] p-[3px] rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                                    {/* White gap */}
                                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                                        {/* Image Container */}
                                        <div className="w-full h-full rounded-full overflow-hidden relative bg-neutral-100">
                                            <Image
                                                src={imageSrc}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-neutral-800 font-medium max-w-[74px] truncate text-center leading-tight">
                                    {product.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
