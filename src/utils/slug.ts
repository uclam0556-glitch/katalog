import { Product } from "@/types/product";

/**
 * Generate URL-friendly slug from product name
 */
export function generateProductSlug(product: Product): string {
    // Transliterate Russian to Latin
    const translitMap: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        ' ': '-', "'": '', '"': '', ',': '', '.': '', '!': '', '?': ''
    };

    let slug = product.name.toLowerCase();

    // Replace each character
    slug = slug.split('').map(char => translitMap[char] || char).join('');

    // Remove any remaining non-alphanumeric characters except hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '');

    // Remove multiple consecutive hyphens
    slug = slug.replace(/-+/g, '-');

    // Remove leading/trailing hyphens
    slug = slug.replace(/^-|-$/g, '');

    // Add product ID to ensure uniqueness (using --- as separator to avoid conflicts)
    return `${slug}---${product.id}`;
}

/**
 * Extract product ID from slug
 */
export function getProductIdFromSlug(slug: string): string {
    // Split by our special separator ---
    const parts = slug.split('---');
    if (parts.length >= 2) {
        return parts[parts.length - 1];
    }
    // Fallback: try to find prod_ pattern
    const match = slug.match(/prod_\d+/);
    return match ? match[0] : parts[parts.length - 1];
}
