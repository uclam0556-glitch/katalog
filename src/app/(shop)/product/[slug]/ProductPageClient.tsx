"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiChevronLeft, FiChevronRight, FiCheck, FiTruck, FiShield } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/types/product";
import { formatPrice, cn } from "@/lib/utils";
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
                <div className="container mx-auto px-4 max-w-7xl py-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Link href="/" className="hover:text-red-700 transition">
                            Главная
                        </Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-red-700 transition">
                            Каталог
                        </Link>
                        <span>/</span>
                        <span className="text-neutral-900 font-medium">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <div className="container mx-auto px-4 max-w-7xl py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* LEFT: Photo Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square bg-neutral-50 rounded-2xl overflow-hidden cursor-zoom-in group"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <Image
                                src={allImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
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
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={cn(
                                            "relative aspect-square rounded-lg overflow-hidden border-2 transition",
                                            selectedImageIndex === index
                                                ? "border-red-700 ring-2 ring-red-700/20"
                                                : "border-neutral-200 hover:border-neutral-400"
                                        )}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - фото ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div className="text-sm text-neutral-500">{product.category}</div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 py-4 border-y border-neutral-200">
                            <span className="text-4xl md:text-5xl font-bold text-neutral-900">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-2xl text-neutral-500">₽</span>
                        </div>

                        {/* Description */}
                        <p className="text-neutral-600 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Specifications */}
                        <div className="space-y-3 py-6 border-y border-neutral-200">
                            <h3 className="font-semibold text-lg">Характеристики</h3>

                            {product.materials && product.materials.length > 0 && (
                                <div className="flex gap-4">
                                    <span className="text-neutral-500 min-w-[120px]">Материалы:</span>
                                    <span className="font-medium">{product.materials.join(", ")}</span>
                                </div>
                            )}

                            {product.dimensions && (
                                <div className="flex gap-4">
                                    <span className="text-neutral-500 min-w-[120px]">Размеры:</span>
                                    <span className="font-medium">
                                        {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} см
                                    </span>
                                </div>
                            )}

                            {product.colors && product.colors.length > 0 && (
                                <div className="flex gap-4">
                                    <span className="text-neutral-500 min-w-[120px]">Цвета:</span>
                                    <span className="font-medium">{product.colors.join(", ")}</span>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <span className="text-neutral-500 min-w-[120px]">Артикул:</span>
                                <span className="font-medium font-mono">{product.sku}</span>
                            </div>

                            <div className="flex gap-4 items-center">
                                <span className="text-neutral-500 min-w-[120px]">Наличие:</span>
                                {product.stock > 0 ? (
                                    <span className="flex items-center gap-2 text-green-700 font-medium">
                                        <FiCheck className="w-5 h-5" />
                                        В наличии ({product.stock} шт.)
                                    </span>
                                ) : (
                                    <span className="text-neutral-400">Нет в наличии</span>
                                )}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FiTruck className="w-6 h-6 text-red-700 flex-shrink-0" />
                                <span className="text-sm font-medium">Бесплатная доставка</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiShield className="w-6 h-6 text-red-700 flex-shrink-0" />
                                <span className="text-sm font-medium">Гарантия 2 года</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleOrder}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-xl transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            <FaWhatsapp className="w-6 h-6" />
                            Заказать в WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="bg-neutral-50 py-12 md:py-16">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8">Похожие товары</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

                    <div className="relative w-full max-w-5xl aspect-square" onClick={(e) => e.stopPropagation()}>
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
