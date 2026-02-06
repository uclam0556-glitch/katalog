import { getProducts } from "@/lib/db";
import { FiPlus, FiSearch, FiEdit2, FiBox } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await getProducts();
    const totalProducts = products.length;

    return (
        <div className="space-y-6 pb-20">
            {/* Header: Title + Add Button */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Товары</h1>
                        <p className="text-neutral-500 text-sm">{totalProducts} позиций в каталоге</p>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="bg-neutral-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-neutral-900/20 active:scale-90 transition-transform md:w-auto md:h-auto md:rounded-xl md:px-5 md:py-3"
                    >
                        <FiPlus className="w-6 h-6 md:w-5 md:h-5" />
                        <span className="hidden md:inline-block ml-2 font-bold text-sm">Добавить товар</span>
                    </Link>
                </div>

                {/* Search Bar (Visual Only for now) */}
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        className="w-full bg-white border border-neutral-200 rounded-xl pl-12 pr-4 py-3.5 text-base shadow-sm outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                </div>
            </div>

            {/* Product List - Mobile Optimized */}
            <div className="space-y-3">
                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-neutral-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                            <FiBox className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">Каталог пуст</h3>
                        <p className="text-neutral-400 text-sm mb-6 mt-1">Добавьте первый товар</p>
                        <Link
                            href="/admin/products/new"
                            className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20"
                        >
                            Создать товар
                        </Link>
                    </div>
                ) : (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex gap-4 items-center"
                        >
                            {/* Image - Fixed Size */}
                            <div className="w-20 h-20 bg-neutral-100 rounded-xl flex-shrink-0 relative overflow-hidden">
                                {product.thumbnail ? (
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <FiBox className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-neutral-900 text-base leading-tight truncate mb-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-neutral-900">
                                        {product.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-neutral-400 text-xs line-through">
                                            {product.oldPrice.toLocaleString('ru-RU')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {(product.stock || 0) > 0 ? `${product.stock} шт` : 'Нет'}
                                    </span>
                                    {product.category && (
                                        <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                                            {product.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 pl-2 border-l border-neutral-100">
                                <Link
                                    href={`/admin/products/${product.id}`}
                                    className="p-2 text-neutral-400 hover:bg-neutral-50 hover:text-amber-600 rounded-lg transition-colors"
                                >
                                    <FiEdit2 className="w-5 h-5" />
                                </Link>
                                <DeleteProductButton id={product.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
