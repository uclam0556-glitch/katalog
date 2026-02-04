/**
 * WhatsApp Integration Utilities
 */

export interface Product {
    id: string;
    name: string;
    price: number;
    sku?: string;
    category?: string;
}

/**
 * Generate WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(
    phoneNumber: string,
    product: Product,
    customMessage?: string
): string {
    const message = customMessage || formatOrderMessage(product);
    const encodedMessage = encodeURIComponent(message);

    // Remove any non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp link for general consultation
 */
export function generateConsultationLink(phoneNumber: string): string {
    const message = "Здравствуйте! 👋\n\nХочу получить консультацию по мебели.";
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Format product order message for WhatsApp
 */
export function formatOrderMessage(product: Product): string {
    const parts = [
        "Здравствуйте! 👋",
        "",
        `Хочу заказать: *${product.name}*`,
        `Цена: ${product.price.toLocaleString("ru-RU")} ₽`,
    ];

    if (product.sku) {
        parts.push(`Артикул: ${product.sku}`);
    }

    if (product.category) {
        parts.push(`Категория: ${product.category}`);
    }

    parts.push("", "Можете уточнить наличие и сроки доставки?");

    return parts.join("\n");
}

/**
 * Format multiple products order message
 */
export function formatMultipleOrderMessage(products: Product[]): string {
    const parts = [
        "Здравствуйте! 👋",
        "",
        "Хочу заказать следующие товары:",
        "",
    ];

    products.forEach((product, index) => {
        parts.push(`${index + 1}. *${product.name}*`);
        parts.push(`   Цена: ${product.price.toLocaleString("ru-RU")} ₽`);
        if (product.sku) {
            parts.push(`   Артикул: ${product.sku}`);
        }
        parts.push("");
    });

    const total = products.reduce((sum, p) => sum + p.price, 0);
    parts.push(`*Общая сумма: ${total.toLocaleString("ru-RU")} ₽*`);
    parts.push("", "Можете уточнить наличие и сроки доставки?");

    return parts.join("\n");
}

/**
 * Open WhatsApp in new window
 */
export function openWhatsApp(link: string): void {
    window.open(link, "_blank", "noopener,noreferrer");
}
