import { getFeaturedProducts, getProductsByCategory } from "@/data/products";
import StoriesClient from "./StoriesClient";
import { Product } from "@/types/product";

export const metadata = {
    title: "Stories | Каталог",
    description: "Смотрите наш каталог в формате историй. Лучшие модели мебели в динамичной презентации.",
};

export default function StoriesPage() {
    // Get featured products first, then maybe fill with others if few
    const featured = getFeaturedProducts();
    const sofas = getProductsByCategory("divany");
    const bedroom = getProductsByCategory("bedroom-furniture");

    // Combine unique products for a good mix
    const allStoriesProducts: Product[] = [
        ...featured,
        ...sofas,
        ...bedroom
    ].filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.id === item.id
        ))
    ).slice(0, 15); // Limit to 15 items for stories

    return <StoriesClient products={allStoriesProducts} />;
}
