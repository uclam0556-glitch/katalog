"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink, openWhatsApp } from "@/utils/whatsapp";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageClientProps {
    product: Product;
    similarProducts: Product[];
}

export default function ProductPageClient({ product, similarProducts }: ProductPageClientProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const allImages = React.useMemo(() => {
        return product.images && product.images.length > 0
            ? product.images
            : [product.thumbnail];
    }, [product]);

    const handleOrder = () => {
        const whatsappLink = generateWhatsAppLink("+79667422726", product);
        openWhatsApp(whatsappLink);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <div className="border-b border-neutral-200">
                <div className="container mx-auto px-4 max-w-7xl py-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Link href="/" className="hover:text-red-700 transition">
                            Главная
                        </Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-red-700 transition">
                            Каталог
                        </Link>
                        <span>/</span>
                        <span className="text-neutral-900">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section - 2 Column Layout like divano.ru */}
            <div className="container mx-auto px-4 max-w-7xl py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {/* LEFT: Photo Gallery - 50% */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-[4/3] bg-neutral-50 rounded-lg overflow-hidden cursor-zoom-in group"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative aspect-square rounded border-2 transition overflow-hidden ${selectedImageIndex === index
                                            ? "border-red-700"
                                            : "border-neutral-200 hover:border-neutral-400"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details - 50% */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div className="text-sm text-neutral-500">{product.category}</div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Price - Large like divano.ru */}
                        <div className="py-4 border-y border-neutral-200">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-bold text-red-700">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-2xl text-neutral-500">₽</span>
                            </div>
                        </div>

                        {/* Stock */}
                        {product.stock > 0 ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                ✓ В наличии ({product.stock} шт.)
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-500 rounded-lg text-sm">
                                Нет в наличии
                            </div>
                        )}

                        {/* CTA Button - Full width like divano.ru */}
                        <button
                            onClick={handleOrder}
                            disabled={product.stock === 0}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 text-white font-bold text-lg rounded-lg transition flex items-center justify-center gap-3 shadow-sm disabled:cursor-not-allowed"
                        >
                            <FaWhatsapp className="w-6 h-6" />
                            {product.stock > 0 ? "Заказать в WhatsApp" : "Нет в наличии"}
                        </button>

                        {/* Description - Beautiful */}
                        <div className="pt-6 pb-4 border-y border-neutral-200">
                            <h3 className="font-bold text-lg mb-3">Описание</h3>
                            <p className="text-neutral-700 leading-relaxed text-base">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications - Clean table */}
                        <div className="pt-6">
                            <h3 className="font-bold text-lg mb-4">Характеристики</h3>

                            <div className="space-y-3">
                                {product.dimensions && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100">
                                        <span className="text-neutral-600">Размеры</span>
                                        <span className="font-medium text-right">
                                            {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} см
                                        </span>
                                    </div>
                                )}

                                {product.materials && product.materials.length > 0 && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100">
                                        <span className="text-neutral-600">Материалы</span>
                                        <span className="font-medium text-right">{product.materials.join(", ")}</span>
                                    </div>
                                )}

                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex justify-between py-2 border-b border-neutral-100">
                                        <span className="text-neutral-600">Цвета</span>
                                        <span className="font-medium text-right">{product.colors.join(", ")}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-2 border-b border-neutral-100">
                                    <span className="text-neutral-600">Артикул</span>
                                    <span className="font-medium font-mono text-right">{product.sku}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="bg-neutral-50 py-10 md:py-16">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Похожие товары</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                    >
                        <FiX className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={allImages[selectedImageIndex]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1280px) 100vw, 1280px"
                        />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition"
                                >
                                    <FiChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition"
                                >
                                    <FiChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </div>
    );
}
