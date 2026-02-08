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
    const { translateCategory } = await import("@/lib/utils");

    // Filter valid products (must have images and be active)
    let validStories = allProducts
        .filter(p => p.active && p.images && p.images.length > 0);

    // Filter by category if provided
    if (category) {
        const lowerCategory = category.toLowerCase().trim();

        // Special Grouping: Tables + Chairs (Столы + Стулья)
        // If user selects either, show BOTH.
        const tablesChairsKeys = ['stoly', 'stulya', 'chairs', 'tables', 'столы', 'стулья', 'stul', 'stol', 'chair', 'table', 'стул', 'стол'];

        if (tablesChairsKeys.includes(lowerCategory)) {
            validStories = validStories.filter(p =>
                p.category && tablesChairsKeys.includes(p.category.toLowerCase().trim())
            );
        } else {
            // Standard strict filtering: Compare TRANSLATED name matches URL param
            validStories = validStories.filter(p =>
                p.category && translateCategory(p.category).toLowerCase().trim() === lowerCategory
            );
        }
    }

    // Limit to 15 recent items (or more if filtered?) - keeping 15 for specific category is fine 
    validStories = validStories.slice(0, 20);

    return <StoriesClient products={validStories} />;
}
