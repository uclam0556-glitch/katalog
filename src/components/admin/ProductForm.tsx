"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import SupabaseUploader from "@/components/admin/ui/SupabaseUploader";
import { saveProductAction } from "@/app/actions";
import { useToast } from "@/components/admin/ui/Toast";
import { FiSave, FiChevronLeft, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            showToast("⚠️ Загрузите фото", "error");
            return;
        }

        setLoading(true);

        const submitData = new FormData();
        if (formData.id) submitData.append("id", formData.id);

        submitData.append("name", formData.name);
        submitData.append("price", formData.price);
        // Only send oldPrice if it's actually filled
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
            showToast("🎉 Товар сохранен!", "success");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            showToast(`Ошибка: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full pb-32 animate-[fadeIn_0.3s_ease-out]">

            {/* Mobile Header - Fixed Top */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 px-4 flex items-center justify-between border-b border-neutral-100 shadow-sm safe-area-top">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => router.back()} className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-50 rounded-full">
                        <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-neutral-900">
                        {initialData ? "Редактирование" : "Новое объявление"}
                    </span>
                </div>
            </div>

            {/* Spacer for Header + Extra Padding */}
            <div className="h-24 md:h-28"></div>

            <div className="space-y-6 px-4 md:px-8 max-w-2xl mx-auto">
                {/* 1. PHOTOS - Horizontal Scroll/Grid */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                    <h3 className="font-bold text-neutral-900 mb-3 text-lg">Фотографии</h3>
                    <SupabaseUploader images={images} onChange={setImages} maxImages={10} />
                    <p className="text-xs text-neutral-400 mt-2 text-center">
                        Первое фото будет обложкой
                    </p>
                </section>

                {/* 2. TITLE & CATEGORY */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Название товара</label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:text-neutral-400 text-base"
                            placeholder="Например, Диван Честер"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Категория</label>
                        <div className="relative">
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none appearance-none text-base"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">▼</div>
                        </div>
                    </div>
                </section>

                {/* 3. PRICE */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                    <h3 className="font-bold text-neutral-900 mb-4 text-lg">Цена</h3>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wide">Цена продажи</label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-xl text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none placeholder:text-neutral-300"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₽</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wide">Старая цена</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.oldPrice}
                                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                                    className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-xl text-neutral-400 focus:ring-2 focus:ring-amber-400 outline-none line-through decoration-red-500 placeholder:text-neutral-200"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₽</span>
                            </div>
                        </div>
                    </div>
                    {formData.price && formData.oldPrice && Number(formData.oldPrice) > Number(formData.price) && (
                        <div className="mt-3 text-sm text-green-700 font-semibold bg-green-50 px-4 py-2 rounded-xl inline-block border border-green-100">
                            Выгода: {(Number(formData.oldPrice) - Number(formData.price)).toLocaleString()} ₽
                        </div>
                    )}
                </section>

                {/* 4. DETAILS */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 space-y-5">
                    <h3 className="font-bold text-neutral-900 text-lg">Характеристики</h3>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Материал</label>
                        <input
                            value={formData.materials}
                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none placeholder:text-neutral-400 text-base"
                            placeholder="Велюр, Дерево, Металл..."
                        />
                        <p className="text-xs text-neutral-400 mt-1.5 ml-1">
                            Перечислите через запятую
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Размеры / Варианты</label>
                        <input
                            value={formData.colors}
                            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none placeholder:text-neutral-400 text-base"
                            placeholder="200х150 см, Серый, Бежевый..."
                        />
                        <p className="text-xs text-neutral-400 mt-1.5 ml-1">
                            Размеры или цвета через запятую
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Количество на складе</label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none placeholder:text-neutral-400 text-base"
                            placeholder="1"
                        />
                    </div>
                </section>

                {/* 5. DESCRIPTION */}
                <section className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">Описание</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={8}
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none text-base leading-relaxed placeholder:text-neutral-400 resize-none"
                        placeholder="Опишите товар подробно: состояние, особенности, почему стоит купить..."
                    />
                </section>
            </div>

            {/* Floating Action Button - HUGE for easy tapping */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t border-neutral-100 flex items-center gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
                {initialData && (
                    <button
                        type="button"
                        className="p-4 md:p-5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors min-w-[60px]"
                    >
                        <FiTrash2 className="w-6 h-6 mx-auto" />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-neutral-900 text-white font-bold text-lg md:text-xl py-4 md:py-5 rounded-2xl shadow-xl shadow-neutral-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {loading ? "Сохранение..." : (
                        <>
                            <FiSave className="w-5 h-5 md:w-6 md:h-6" />
                            Опубликовать
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
