"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import SupabaseUploader from "@/components/admin/ui/SupabaseUploader";
import { saveProductAction } from "@/app/actions";
import { useToast } from "@/components/admin/ui/Toast";
import { FiSave, FiX } from "react-icons/fi";

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
            showToast("Добавьте хотя бы одну фотографию", "error");
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
            showToast("Товар успешно сохранен!", "success");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            showToast(`Ошибка: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                    Фотографии <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Первое фото будет главным на карточке товара
                </p>
                <SupabaseUploader images={images} onChange={setImages} maxImages={5} />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Основная информация</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Название <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="Например: Стул 'Лофт'"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Категория <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Цена (₽) <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Артикул (SKU)</label>
                        <input
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="CH-LOFT-001"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Остаток (шт)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="10"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Избранный товар
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-600">Показывать на главной</span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Описание</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-sm"
                        placeholder="Опишите товар..."
                    />
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Дополнительно</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Цвета
                            <span className="text-gray-400 text-xs ml-1">(через запятую)</span>
                        </label>
                        <input
                            value={formData.colors}
                            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="Черный, Белый, Серый"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Материалы
                            <span className="text-gray-400 text-xs ml-1">(через запятую)</span>
                        </label>
                        <input
                            value={formData.materials}
                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            placeholder="Дерево, Металл, Велюр"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 text-sm"
                >
                    <FiX className="w-4 h-4" />
                    Отмена
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    <FiSave className="w-4 h-4" />
                    {loading ? "Сохранение..." : "Сохранить товар"}
                </button>
            </div>
        </form>
    );
}
