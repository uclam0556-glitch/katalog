import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/db";
import { getProductIdFromSlug } from "@/utils/slug";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const productId = getProductIdFromSlug(params.slug);
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
        return {
            title: "Товар не найден",
        };
    }

    return {
        title: `${product.name} - амэа`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.thumbnail],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const productId = getProductIdFromSlug(params.slug);
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
