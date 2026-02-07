"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import SupabaseUploader from "@/components/admin/ui/SupabaseUploader";
import { saveProductAction } from "@/app/actions";
import { useToast } from "@/components/admin/ui/Toast";
import { FiSave, FiChevronLeft, FiTrash2, FiEye, FiLayout, FiDollarSign, FiList, FiImage } from "react-icons/fi";
import { formatPrice, cn } from "@/lib/utils";

interface ProductFormProps {
    initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: initialData?.id || "",
        name: initialData?.name || "",
        price: initialData?.price?.toString() || "",
        oldPrice: initialData?.oldPrice?.toString() || "",
        description: initialData?.description || "",
        category: initialData?.category || categories[0]?.slug || "sofas",
        stock: initialData?.stock?.toString() || "1",
        sku: initialData?.sku || "",
        colors: initialData?.colors?.join(", ") || "",
        materials: initialData?.materials?.join(", ") || "",
    });

    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // Live Preview Helpers
    const discountPercent = formData.oldPrice && Number(formData.oldPrice) > Number(formData.price)
        ? Math.round(((Number(formData.oldPrice) - Number(formData.price)) / Number(formData.oldPrice)) * 100)
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            showToast("⚠️ Загрузите хотя бы одно фото", "error");
            return;
        }

        setLoading(true);

        const submitData = new FormData();
        if (formData.id) submitData.append("id", formData.id);

        submitData.append("name", formData.name);
        submitData.append("price", formData.price);
        if (formData.oldPrice && formData.oldPrice.trim() !== "") {
            submitData.append("oldPrice", formData.oldPrice);
        }
        submitData.append("description", formData.description);
        submitData.append("category", formData.category);
        submitData.append("stock", formData.stock);
        submitData.append("sku", formData.sku);
        submitData.append("images", JSON.stringify(images));
        submitData.append("thumbnail", images[0]);
        submitData.append("colors", formData.colors);
        submitData.append("materials", formData.materials);

        try {
            await saveProductAction(submitData);
            showToast("🎉 Товар успешно опубликован!", "success");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            showToast(`Ошибка: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-[#FDFCFB] pb-[30rem] md:pb-32 animate-[fadeIn_0.4s_ease-out]">

            {/* Header / Nav - Changed from fixed to Sticky to respect layout flow */}
            {/* Using top-0 assuming AdminLayout padding handles the offset, or top-[header-height] if needed. 
                But since we are inside AdminLayout which has pt-24, a sticky header here will stick to the top of the CONTENT area (below global header).
                If we want it at the very top of the SCREEN, we need negative margin or fixed. 
                User said "top goes behind screen". Sticky is safer.
                Let's try fixed but with top-20 (80px) to sit BELOW the main admin header? 
                Actually, the user likely wants this form to take over the screen.
                Let's stick to safe sticky positioning to avoid overlap.
            */}
            <div className="sticky top-20 md:top-24 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl z-[40] border-b border-neutral-100 flex items-center justify-between px-4 md:px-8 -mx-4 md:-mx-8 mb-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => router.back()} className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors">
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold font-serif text-neutral-900">
                            {initialData ? "Редактирование" : "Новый товар"}
                        </h1>
                        <p className="text-xs text-neutral-400 hidden md:block">Заполните детали каталога</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 text-xs font-bold uppercase tracking-wider rounded-lg">
                        {loading ? "Сохранение..." : "Черновик"}
                    </span>
                </div>
            </div>

            {/* No Spacer needed for sticky element */}

            <div className="container mx-auto max-w-[90rem]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* LEFT COLUMN: Media & Preview (Sticky) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="lg:sticky lg:top-40 space-y-8">

                            {/* 1. Media Uploader */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center">
                                        <FiImage className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg font-serif">Галерея</h3>
                                </div>
                                <SupabaseUploader images={images} onChange={setImages} maxImages={10} />
                                <p className="text-xs text-neutral-400 mt-4 text-center">
                                    Перетаскивайте фото. Первое — обложка.
                                </p>
                            </div>

                            {/* 2. Live Preview Card */}
                            <div className="hidden lg:block">
                                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 pl-2">Предпросмотр</h3>
                                <div className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-[1.02] duration-500">
                                    <div className="relative aspect-[4/3] bg-neutral-100">
                                        {images[0] ? (
                                            <Image src={images[0]} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-neutral-300">Нет фото</div>
                                        )}
                                        {/* Status Badges */}
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            {discountPercent > 0 && (
                                                <span className="px-2 py-1 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded shadow-sm">
                                                    -{discountPercent}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-2">
                                            <span className="text-lg font-bold text-red-700">
                                                {formatPrice(Number(formData.price) || 0)}
                                            </span>
                                            {discountPercent > 0 && (
                                                <span className="ml-2 text-sm text-neutral-400 line-through">
                                                    {formatPrice(Number(formData.oldPrice) || 0)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-neutral-900 line-clamp-2 mb-1">
                                            {formData.name || "Название товара..."}
                                        </h3>
                                        <p className="text-xs text-neutral-500">
                                            {categories.find(c => c.slug === formData.category)?.name || "Категория"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form Fields */}
                    <div className="lg:col-span-7 space-y-8 animate-[slideUp_0.5s_ease-out]">

                        {/* Section: Main Info */}
                        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
                                    <FiLayout className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-xl font-serif">Основное</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Название</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 md:p-5 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-bold text-lg md:text-xl text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                        placeholder="Например, Диван Честер"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Категория</label>
                                        <div className="relative">
                                            <select
                                                required
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-lg text-neutral-900 outline-none appearance-none cursor-pointer transition-all"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">▼</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Артикул</label>
                                        <input
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-lg text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                            placeholder="SKU-12345"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Price */}
                        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                                    <FiDollarSign className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-xl font-serif">Стоимость</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Цена продажи</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-5 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-bold text-2xl text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 font-serif text-xl">₽</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Старая цена (для скидки)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.oldPrice}
                                            onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                                            className="w-full p-5 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-bold text-2xl text-neutral-400 outline-none transition-all placeholder:text-neutral-200 line-through decoration-red-400"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 font-serif text-xl">₽</span>
                                    </div>
                                </div>
                            </div>

                            {discountPercent > 0 && (
                                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        %
                                    </div>
                                    <p className="text-green-800 font-medium">
                                        Отличная скидка! Покупатель сэкономит <span className="font-bold">{formatPrice(Number(formData.oldPrice) - Number(formData.price))}</span>
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Section: Description */}
                        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                                    <FiList className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-xl font-serif">Детали</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Описание </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={8}
                                        className="w-full p-5 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-lg leading-relaxed text-neutral-900 outline-none transition-all placeholder:text-neutral-300 resize-none"
                                        placeholder="Расскажите о преимуществах товара..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Материалы</label>
                                        <input
                                            value={formData.materials}
                                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                            placeholder="Велюр, массив дуба..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Размеры / Варианты</label>
                                        <input
                                            value={formData.colors}
                                            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                            className="w-full p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                            placeholder="200x120 см, Серый..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Остаток</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full md:w-1/3 p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-lg text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

            {/* Sticky Action Bar - Premium Glassmorphism */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:left-auto md:right-8 md:w-auto md:bottom-6 z-50 flex flex-col md:flex-row gap-3 bg-white/80 backdrop-blur-xl border-t border-neutral-200 md:bg-transparent md:border-none md:p-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none safe-area-bottom">

                {/* Mobile Preview Button */}
                <button
                    type="button"
                    className="md:hidden w-full h-12 bg-white border border-neutral-200 rounded-xl font-bold text-neutral-900 shadow-sm flex items-center justify-center gap-2"
                >
                    <FiEye className="w-5 h-5" />
                    Предсмотр
                </button>

                <div className="flex gap-3 w-full md:w-auto">
                    {initialData && (
                        <button
                            type="button"
                            className="w-12 h-12 md:w-14 md:h-14 bg-white text-red-500 rounded-xl md:rounded-2xl hover:bg-red-50 hover:scale-105 transition-all flex items-center justify-center shadow-lg shadow-neutral-200/50 border border-neutral-100"
                            title="Удалить"
                        >
                            <FiTrash2 className="w-6 h-6" />
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-12 md:h-14 px-8 bg-neutral-900 text-white rounded-xl md:rounded-2xl font-bold text-lg hover:bg-black hover:scale-105 hover:shadow-2xl hover:shadow-neutral-900/30 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-neutral-900/20"
                    >
                        {loading ? "..." : <FiSave className="w-5 h-5" />}
                        <span>{initialData ? "Сохранить" : "Опубликовать"}</span>
                    </button>
                </div>
            </div>

        </form>
    );
}
