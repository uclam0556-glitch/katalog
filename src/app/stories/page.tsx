import { getProducts } from "@/lib/db";
import StoriesClient from "./StoriesClient";

export const revalidate = 3; // Revalidate every 3 seconds to show new products quickly

export const metadata = {
    title: "Stories | Каталог",
    description: "Смотрите наш каталог в формате историй. Лучшие модели мебели в динамичной презентации.",
};

export default async function StoriesPage() {
    // Fetch real products from Supabase
    const allProducts = await getProducts();

    // Filter valid products (must have images and be active)
    const validStories = allProducts
        .filter(p => p.active && p.images && p.images.length > 0)
        .slice(0, 15); // Limit to 15 recent items

    return <StoriesClient products={validStories} />;
}
