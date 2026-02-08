import { notFound } from "next/navigation";
import { getProducts } from "@/lib/db";
import { getProductIdFromSlug } from "@/utils/slug";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
    { params }: ProductPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const productId = getProductIdFromSlug(slug);
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return {
            title: "Товар не найден",
        };
    }


    const productImages = product.images && product.images.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);

    // Ensure absolute URLs if needed, but Next.js metadataBase handles relative paths usually.
    // However, for social cards, specific remote URLs are often better.

    return {
        title: `${product.name || "Товар"} - купить в амэа`,
        description: product.description ? product.description.slice(0, 160) : "Подробное описание товара...",
        openGraph: {
            title: product.name || "Товар",
            description: product.description || "Премиальная мебель в Грозном",
            url: `/product/${slug}`,
            images: productImages.map(url => ({
                url: url,
                width: 800,
                height: 600,
                alt: product.name,
            })),
            type: "website", // 'product' type is better but 'website' is safer for general whatsapp preview
            siteName: "амэа",
        },
        other: {
            "product:price:amount": product.price.toString(),
            "product:price:currency": "RUB",
            "product:availability": product.stock > 0 ? "instock" : "outofstock",
        }
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const productId = getProductIdFromSlug(slug);
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
        notFound();
    }

    // Get similar products (same category, exclude current)
    const similarProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return <ProductPageClient product={product} similarProducts={similarProducts} />;
}
