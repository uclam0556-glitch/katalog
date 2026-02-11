import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | string | undefined | null, currency: string = "₽"): string {
    if (price === undefined || price === null) return `0 ${currency}`;
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return `0 ${currency}`;

    return `${numPrice.toLocaleString("ru-RU")} ${currency}`;
}

/**
 * Debounce function for search and other inputs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Translate category names from English to Russian
 */
export function translateCategory(category: string): string {
    if (!category) return "";

    const map: Record<string, string> = {
        // Transliterated (from DB/User report)
        "stulya": "Стулья",
        "stul": "Стул",
        "stoly": "Столы",
        "stol": "Стол",
        "divany": "Диваны",
        "divan": "Диван",
        "krovati": "Кровати",
        "krovat": "Кровать",
        "stellazhi": "Стеллажи",
        "stellazh": "Стеллаж",
        "kukhnya": "Кухня",
        "kitchen-furniture": "Кухня",
        "spalnya": "Спальня",
        "bedroom-furniture": "Спальня",
        "gostinaya": "Гостиная",
        "living-room": "Гостиная",
        "osveshchenie": "Освещение",
        "light": "Свет",
        "chandeliers": "Люстры",
        "lyustry": "Люстры",
        "decor": "Декор",
        "dekor": "Декор",
        "shkafy": "Шкафы",
        "shkaf": "Шкаф",
        "cabinets": "Шкафы",

        // English fallback
        "chairs": "Стулья",
        "chair": "Стул",
        "tables": "Столы",
        "table": "Стол",
        "sofas": "Диваны",
        "sofa": "Диван",
        "beds": "Кровати",
        "bed": "Кровать",
        "storage": "Хранение",
        "shelves": "Стеллажи",
        "shelf": "Стеллаж",
        "lighting": "Освещение",
        "lights": "Свет",
        "lamps": "Лампы",
        "kitchen": "Кухня",
        "bedroom": "Спальня",
        "living room": "Гостиная",
        "office": "Офис",
        "kids": "Детская",
        "armchairs": "Кресла",
        "armchair": "Кресло",
    };

    const lower = category.toLowerCase().trim();
    if (map[lower]) return map[lower];

    // Capitalize first letter if no translation found
    return category.charAt(0).toUpperCase() + category.slice(1);
}
