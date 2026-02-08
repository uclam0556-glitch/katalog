"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { categories } from "@/data/products";
import SupabaseUploader from "@/components/admin/ui/SupabaseUploader";
import { saveProductAction, deleteProductAction } from "@/app/actions";
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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
            showToast(`Ошибка: ${errorMessage}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id) return;

        if (!window.confirm("Вы действительно хотите удалить этот товар? Это действие нельзя отменить.")) {
            return;
        }

        setLoading(true);
        try {
            await deleteProductAction(initialData.id);
            showToast("🗑️ Товар удален", "success");
            router.push("/admin");
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ошибка удаления";
            showToast(`Ошибка: ${errorMessage}`, "error");
            setLoading(false);
        }
    };

    return (

        <form onSubmit={handleSubmit} className="min-h-screen bg-[#FDFCFB] pb-[50rem] md:pb-32 animate-[fadeIn_0.4s_ease-out]">

            {/* Header / Nav - Dedicated Panel Header */}
            <div className="sticky top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-xl z-[100] border-b border-neutral-100 flex items-center justify-between px-4 md:px-8 mb-6 shadow-sm safe-area-top">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95"
                        title="Назад"
                    >
                        <FiChevronLeft className="w-5 h-5 text-neutral-700" />
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

            {/* No Spacer needed for sticky element */}

            {/* STUDIO LAYOUT - Full Width Split */}
            <div className="w-full min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                    {/* LEFT COLUMN: Visual Studio (Sticky) */}
                    <div className="hidden lg:block relative bg-neutral-100 border-r border-neutral-200">
                        <div className="sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto p-8 flex flex-col items-center justify-center">

                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 w-full max-w-sm">
                                Визуализация
                            </h3>

                            {/* PHONE SIMULATOR */}
                            <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-neutral-900 overflow-hidden relative aspect-[9/19]">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>

                                {/* Screen Content */}
                                <div className="h-full overflow-y-auto scrollbar-hide bg-[#FDFCFB]">
                                    {/* Header Placeholder */}
                                    <div className="h-20 w-full bg-white/50 backdrop-blur-md sticky top-0 z-10"></div>

                                    {/* Product Image */}
                                    <div className="relative aspect-[4/3] bg-white w-full">
                                        {images[0] ? (
                                            <Image
                                                src={images[0]}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 text-neutral-300 gap-2">
                                                <FiImage className="w-8 h-8" />
                                                <span className="text-xs">Нет фото</span>
                                            </div>
                                        )}
                                        {/* Pagination Dots */}
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-neutral-900' : 'bg-neutral-300'}`} />)}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6 bg-white rounded-t-[2rem] -mt-6 relative z-10 min-h-[400px]">
                                        <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-6"></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <h1 className="text-2xl font-bold font-serif text-neutral-900 leading-tight flex-1">
                                                {formData.name || "Название товара"}
                                            </h1>
                                            {discountPercent > 0 && (
                                                <span className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                    -{discountPercent}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-baseline gap-3 mb-6">
                                            <span className="text-3xl font-bold text-neutral-900">
                                                {formatPrice(Number(formData.price) || 0)}
                                            </span>
                                            {discountPercent > 0 && (
                                                <span className="text-lg text-neutral-400 line-through decoration-red-400">
                                                    {formatPrice(Number(formData.oldPrice) || 0)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-4 bg-neutral-50 rounded-xl mb-6">
                                            <p className="text-xs font-bold text-neutral-400 uppercase mb-2">Описание</p>
                                            <p className="text-sm text-neutral-600 line-clamp-4">
                                                {formData.description || "Описание товара появится здесь..."}
                                            </p>
                                        </div>

                                        <button className="w-full h-12 bg-neutral-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            <span className="w-5 h-5 bg-green-500 rounded-full"></span>
                                            Купить
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-neutral-400 mt-6">
                                Предпросмотр мобильной версии
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Edit Form */}
                    <div className="p-6 md:p-12 lg:p-16 max-w-3xl mx-auto w-full pb-40">
                        {/* Mobile Visual Uploader (Visible on Mobile Only) */}
                        <div className="lg:hidden mb-8">
                            <h3 className="font-bold text-lg mb-4">Фотографии</h3>
                            <SupabaseUploader images={images} onChange={setImages} maxImages={10} />
                        </div>

                        {/* Desktop Uploader (integrated into flow) */}
                        <div className="hidden lg:block bg-white p-8 rounded-[2rem] border-2 border-dashed border-neutral-200 hover:border-neutral-300 transition-colors mb-12">
                            <h3 className="font-bold text-xl font-serif mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 text-sm">1</span>
                                Загрузка фото
                            </h3>
                            <SupabaseUploader images={images} onChange={setImages} maxImages={10} />
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-12 animate-[slideUp_0.5s_ease-out]">
                            {/* Section: Main Info */}
                            <section>
                                <h3 className="font-bold text-xl font-serif mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 text-sm">2</span>
                                    Основное
                                </h3>
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
                            <section>
                                <h3 className="font-bold text-xl font-serif mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 text-sm">3</span>
                                    Стоимость
                                </h3>
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
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Старая цена</label>
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
                            </section>

                            {/* Section: Details */}
                            <section>
                                <h3 className="font-bold text-xl font-serif mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 text-sm">4</span>
                                    Детали
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Описание</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={6}
                                            className="w-full p-5 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-lg leading-relaxed text-neutral-900 outline-none transition-all placeholder:text-neutral-300 resize-none shadow-sm"
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
                                                placeholder="Велюр, массив..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2 ml-1">Размеры / Цвета</label>
                                            <input
                                                value={formData.colors}
                                                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                                className="w-full p-4 bg-neutral-50 hover:bg-white focus:bg-white border-2 border-neutral-100 focus:border-neutral-900 rounded-2xl font-medium text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-300"
                                                placeholder="200x120 см, Серый..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
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
                            onClick={handleDelete}
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
            {/* Extra Spacer for safe scrolling on mobile */}
            <div className="h-32 md:hidden"></div>

        </form>
    );
}
