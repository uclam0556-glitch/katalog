import { getProducts } from "@/lib/db";
import { FiPlus, FiSearch, FiBox, FiTrendingUp, FiPackage } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { categories } from "@/data/products";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await getProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

    // Get unique categories from products
    const productCategories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className="space-y-8 pb-20">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Products */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <FiPackage className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Всего товаров</h3>
                    <p className="text-3xl font-bold text-neutral-900">{totalProducts}</p>
                </div>

                {/* Total Value */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <FiTrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-1">Сумма</h3>
                    <p className="text-3xl font-bold text-neutral-900">{totalValue.toLocaleString('ru-RU')} ₽</p>
                </div>

                {/* Quick Add Button */}
                <Link
                    href="/admin/products/new"
                    className="bg-gradient-to-br from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl group"
                >
                    <div className="p-4 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                        <FiPlus className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Добавить товар</span>
                </Link>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        id="admin-search"
                        placeholder="Поиск по названию, категории, артикулу..."
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-all"
                    />
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-2" id="category-filters">
                    <button
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-900 text-white transition-all"
                        data-category="all"
                    >
                        Все товары
                    </button>
                    {productCategories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all"
                            data-category={category}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products List */}
            <div className="space-y-4" id="products-list">
                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-neutral-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                            <FiBox className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">Каталог пуст</h3>
                        <p className="text-neutral-400 text-sm mb-6 mt-1">Добавьте первый товар</p>
                        <Link
                            href="/admin/products/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-black transition-colors font-semibold"
                        >
                            <FiPlus className="w-5 h-5" />
                            Создать товар
                        </Link>
                    </div>
                ) : (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="product-item bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex gap-4 items-center hover:shadow-md transition-shadow"
                            data-category={product.category}
                            data-name={product.name.toLowerCase()}
                            data-sku={(product.sku || '').toLowerCase()}
                        >
                            {/* Image - Fixed Size */}
                            <Link href={`/admin/products/${product.id}`} className="flex-shrink-0">
                                <div className="w-20 h-20 bg-neutral-100 rounded-xl relative overflow-hidden">
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
                            </Link>

                            {/* Info - Clickable */}
                            <Link href={`/admin/products/${product.id}`} className="flex-1 min-w-0">
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
                            </Link>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 pl-2 border-l border-neutral-100 flex-shrink-0">
                                <DeleteProductButton id={product.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Client-side Filter Script */}
            <script dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    const searchInput = document.getElementById('admin-search');
                    const categoryButtons = document.querySelectorAll('[data-category]');
                    const products = document.querySelectorAll('.product-item');
                    let currentCategory = 'all';

                    function filterProducts() {
                        const searchTerm = searchInput.value.toLowerCase();
                        
                        products.forEach(product => {
                            const name = product.dataset.name || '';
                            const sku = product.dataset.sku || '';
                            const category = product.dataset.category || '';
                            
                            const matchesSearch = !searchTerm || name.includes(searchTerm) || sku.includes(searchTerm) || category.toLowerCase().includes(searchTerm);
                            const matchesCategory = currentCategory === 'all' || category === currentCategory;
                            
                            product.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
                        });
                    }

                    searchInput?.addEventListener('input', filterProducts);

                    categoryButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            currentCategory = this.dataset.category;
                            
                            categoryButtons.forEach(btn => {
                                btn.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-all';
                            });
                            
                            this.className = 'px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-900 text-white transition-all';
                            
                            filterProducts();
                        });
                    });
                })();
            `}} />
        </div>
    );
}
