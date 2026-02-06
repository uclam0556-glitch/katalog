"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import SupabaseUploader from "@/components/admin/ui/SupabaseUploader";
import { saveProductAction } from "@/app/actions";
import { useToast } from "@/components/admin/ui/Toast";
import { FiSave, FiCheck, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";

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
        description: initialData?.description || "",
        category: initialData?.category || categories[0]?.name || "Стулья",
        stock: initialData?.stock?.toString() || "10",
        sku: initialData?.sku || "",
        colors: initialData?.colors?.join(", ") || "",
        materials: initialData?.materials?.join(", ") || "",
        featured: initialData?.featured || false,
    });

    const [images, setImages] = useState<string[]>(initialData?.images || []);

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
        submitData.append("description", formData.description);
        submitData.append("category", formData.category);
        submitData.append("stock", formData.stock);
        submitData.append("sku", formData.sku);
        submitData.append("images", JSON.stringify(images));
        submitData.append("thumbnail", images[0]);
        submitData.append("featured", String(formData.featured));
        submitData.append("colors", formData.colors);
        submitData.append("materials", formData.materials);

        try {
            await saveProductAction(submitData);
            showToast("🎉 Товар успешно сохранен!", "success");
            router.push("/admin");
            router.refresh();
        } catch (error: any) {
            showToast(`Ошибка: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out]">

            {/* Header / Actions */}
            <div className="flex items-center justify-between sticky top-20 z-40 bg-[#FDFCFB]/90 backdrop-blur-md py-4 border-b border-neutral-200/50 mb-8 -mx-6 px-6 md:mx-0 md:px-0">
                <h2 className="text-xl font-bold text-neutral-900">Заполнение данных</h2>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl transition"
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl shadow-lg shadow-neutral-900/10 font-bold transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                    >
                        {loading ? "Сохранение..." : (
                            <>
                                <FiCheck className="w-4 h-4" />
                                Опубликовать
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 1. PHOTOGRAPHY (Crucial First Step) */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        1. Фотографии товара
                        <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">
                        Загрузите красивые фото. Первое фото будет на обложке.
                    </p>
                </div>
                <SupabaseUploader images={images} onChange={setImages} maxImages={6} />
            </section>

            {/* 2. BASIC INFO */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-neutral-200"></div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-900">2. Основная информация</h3>
                </div>

                <div className="space-y-6">
                    {/* Name - HUGE Input */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Название товара
                        </label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full text-2xl font-serif font-bold p-0 border-none focus:ring-0 placeholder:text-neutral-200 bg-transparent"
                            placeholder="Напр: Диван Честер"
                        />
                        <div className="h-px w-full bg-neutral-100 mt-2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Price */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                Стоимость (₽)
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-lg outline-none focus:border-amber-400 transition-colors"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₽</span>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                Категория
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-lg outline-none focus:border-amber-400 transition-colors appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <FiChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-neutral-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-amber-400 transition-colors resize-none"
                            placeholder="Расскажите о преимуществах товара..."
                        />
                    </div>
                </div>
            </section>

            {/* 3. DETAILS (Optional) */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-neutral-100 group-hover:bg-neutral-300 transition-colors"></div>
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-900">3. Детали (необязательно)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Количество на складе
                        </label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            Артикул
                        </label>
                        <input
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-amber-400 transition-colors"
                            placeholder="CODE-123"
                        />
                    </div>

                    <div className="md:col-span-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-6 h-6 text-amber-600 rounded-md focus:ring-amber-500 border-gray-300"
                            id="featured-check"
                        />
                        <label htmlFor="featured-check" className="cursor-pointer">
                            <span className="block font-bold text-amber-900">Показывать на главной?</span>
                            <span className="text-xs text-amber-700">Товар появиться в блоке "Популярное"</span>
                        </label>
                    </div>
                </div>
            </section>
        </form>
    );
}
