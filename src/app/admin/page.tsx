import { getProducts } from "@/lib/db";
import { FiPlus, FiBox, FiTrendingUp, FiSearch } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await getProducts();
    const totalProducts = products.length;

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-serif text-neutral-900 mb-2">Обзор</h1>
                    <p className="text-neutral-500 font-medium">Добро пожаловать в панель управления</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white px-5 py-2.5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-neutral-600">
                            {totalProducts} товаров
                        </span>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-neutral-900/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <FiPlus className="w-5 h-5" />
                        Добавить товар
                    </Link>
                </div>
            </div>

            {/* Quick Actions / Stats Wrapper if needed (Minimal for now) */}

            {/* Product Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                        <FiBox className="w-5 h-5" />
                        Ваш каталог
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBox className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Каталог пуст</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                            Добавьте свой первый товар, чтобы начать продажи. Это займет всего пару минут.
                        </p>
                        <Link
                            href="/admin/products/new"
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-bold transition-all"
                        >
                            <FiPlus className="w-5 h-5" />
                            Создать товар
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* New Item Card (First Slot) */}
                        <Link
                            href="/admin/products/new"
                            className="group relative aspect-[4/5] bg-neutral-50 rounded-[2rem] border-2 border-dashed border-neutral-200 hover:border-amber-400 hover:bg-amber-50/10 flex flex-col items-center justify-center transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FiPlus className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <span className="font-bold text-neutral-900">Добавить</span>
                            <span className="text-xs text-neutral-400 mt-1">Новый товар</span>
                        </Link>

                        {/* Product Cards */}
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/admin/products/${product.id}`}
                                className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 border border-neutral-100 relative overflow-hidden"
                            >
                                {/* Image Container */}
                                <div className="aspect-square rounded-[1.5rem] bg-neutral-100 overflow-hidden relative mb-4">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                            <FiBox className="w-8 h-8" />
                                        </div>
                                    )}

                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white/90 text-neutral-900 px-4 py-2 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                                            Редактировать
                                        </span>
                                    </div>

                                    {/* Stock Badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold shadow-sm">
                                        {(product.stock || 0) > 0 ? (
                                            <span className={(product.stock || 0) < 5 ? "text-amber-600" : "text-emerald-600"}>
                                                {(product.stock || 0)} шт
                                            </span>
                                        ) : (
                                            <span className="text-red-600">Нет в наличии</span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-1 pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-neutral-900 text-base leading-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <span className="font-bold text-neutral-900 text-sm whitespace-nowrap ml-2">
                                            {product.price.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-400 font-medium">
                                        {product.category}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
