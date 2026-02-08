import { getProducts } from "@/lib/db";
import StoriesClient from "./StoriesClient";

export const revalidate = 3; // Revalidate every 3 seconds to show new products quickly

export const metadata = {
    title: "Stories | Каталог",
    description: "Смотрите наш каталог в формате историй. Лучшие модели мебели в динамичной презентации.",
};

interface StoriesPageProps {
    searchParams: { category?: string };
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
    // Fetch real products from Supabase
    const allProducts = await getProducts();
    const category = searchParams?.category;

    // Filter valid products (must have images and be active)
    let validStories = allProducts
        .filter(p => p.active && p.images && p.images.length > 0);

    // Filter by category if provided
    if (category) {
        // Case-insensitive comparison just in case
        validStories = validStories.filter(p =>
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Limit to 15 recent items (or more if filtered?) - keeping 15 for specific category is fine 
    validStories = validStories.slice(0, 20);

    return <StoriesClient products={validStories} />;
}
