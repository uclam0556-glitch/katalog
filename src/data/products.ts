import { Product, Category } from "@/types/product";

/**
 * Mock Categories Data (Russian)
 */
export const categories: Category[] = [
    {
        id: "1",
        name: "Стулья",
        slug: "stulya",
        description: "Современные и классические стулья для дома и офиса",
        icon: "🪑",
        order: 1,
    },
    {
        id: "2",
        name: "Столы",
        slug: "stoly",
        description: "Обеденные и рабочие столы из натурального дерева",
        icon: "🪵",
        order: 2,
    },
    {
        id: "3",
        name: "Диваны",
        slug: "divany",
        description: "Комфортные диваны для гостиной",
        icon: "🛋️",
        order: 3,
    },
    {
        id: "4",
        name: "Стеллажи",
        slug: "stellazhi",
        description: "Стеллажи и полки в стиле лофт",
        icon: "📚",
        order: 4,
    },
    {
        id: "5",
        name: "Кухонная мебель",
        slug: "kitchen-furniture",
        description: "Мебель для кухни",
        icon: "🍳",
        order: 5,
    },
    {
        id: "6",
        name: "Люстры",
        slug: "chandeliers",
        description: "Освещение и люстры",
        icon: "💡",
        order: 6,
    },
    {
        id: "7",
        name: "Спальная мебель",
        slug: "bedroom-furniture",
        description: "Мебель для спальни",
        icon: "🛏️",
        order: 7,
    },
    {
        id: "8",
        name: "Декоры",
        slug: "decor",
        description: "Декоративные элементы",
        icon: "🎨",
        order: 8,
    },
];

/**
 * Mock Products Data (Russian)
 */
export const products: Product[] = [
    {
        id: "1",
        name: "Стул 'Лофт'",
        slug: "stul-loft",
        description:
            "Современный стул в стиле лофт с металлическим каркасом и деревянным сиденьем. Идеально подходит для кухни, столовой или кафе. Прочная конструкция выдерживает до 120 кг.",
        price: 8500,
        category: "Стулья",
        images: ["/chair-loft.png"],
        thumbnail: "/chair-loft.png",
        sku: "CH-LOFT-001",
        stock: 15,
        materials: ["Металл", "Дерево"],
        dimensions: {
            width: 45,
            height: 82,
            depth: 50,
        },
        colors: ["Черный", "Натуральное дерево"],
        featured: true,
        active: true,
    },
    {
        id: "2",
        name: "Стол 'Скандинавия'",
        slug: "stol-skandinaviya",
        description:
            "Обеденный стол в скандинавском стиле из массива дуба. Минималистичный дизайн и натуральные материалы создают уютную атмосферу. Подходит для кухни или столовой на 4-6 человек.",
        price: 35000,
        category: "Столы",
        images: ["/table-oak.png"],
        thumbnail: "/table-oak.png",
        sku: "TB-SCAND-002",
        stock: 8,
        materials: ["Массив дуба"],
        dimensions: {
            width: 160,
            height: 75,
            depth: 90,
        },
        colors: ["Светлый дуб"],
        featured: true,
        active: true,
    },
    {
        id: "3",
        name: "Диван 'Велюр'",
        slug: "divan-velyur",
        description:
            "Роскошный диван с обивкой из бархатистого велюра цвета шалфей. Каретная стяжка на спинке и золотистые ножки придают изделию премиальный вид. Идеален для гостиной в современном стиле.",
        price: 89000,
        category: "Диваны",
        images: ["/sofa-green.png"],
        thumbnail: "/sofa-green.png",
        sku: "SF-VEL-003",
        stock: 3,
        materials: ["Велюр", "Металл", "Дерево"],
        dimensions: {
            width: 210,
            height: 78,
            depth: 85,
        },
        colors: ["Шалфей", "Золотистые ножки"],
        featured: true,
        active: true,
    },
    {
        id: "4",
        name: "Стеллаж 'Индастриал'",
        slug: "stellazh-industrial",
        description:
            "Стеллаж в индустриальном стиле с металлическим каркасом и полками из натурального дерева. Отлично подходит для хранения книг, декора или посуды. Устойчивая конструкция и стильный дизайн.",
        price: 24000,
        category: "Стеллажи",
        images: ["/bookshelf-industrial.png"],
        thumbnail: "/bookshelf-industrial.png",
        sku: "SH-IND-004",
        stock: 12,
        materials: ["Металл", "Массив сосны"],
        dimensions: {
            width: 120,
            height: 180,
            depth: 35,
        },
        colors: ["Черный металл", "Натуральное дерево"],
        featured: true,
        active: true,
    },
    {
        id: "5",
        name: "Кресло 'Горчица'",
        slug: "kreslo-gorchitsa",
        description:
            "Уютное кресло с бархатной обивкой горчичного цвета. Изогнутая спинка и деревянные ножки создают элегантный силуэт. Прекрасно дополнит интерьер гостиной или спальни.",
        price: 32000,
        category: "Диваны",
        images: ["/armchair-yellow.png"],
        thumbnail: "/armchair-yellow.png",
        sku: "AR-MUST-005",
        stock: 7,
        materials: ["Велюр", "Дерево"],
        dimensions: {
            width: 75,
            height: 80,
            depth: 85,
        },
        colors: ["Горчичный"],
        featured: true,
        active: true,
    },
    {
        id: "6",
        name: "Кофейный столик 'Мрамор'",
        slug: "stolik-mramor",
        description:
            "Элегантный кофейный столик с мраморной столешницей и золотистым металлическим каркасом. Идеально подходит для современной гостиной. Прочный и стильный акцент в интерьере.",
        price: 18500,
        category: "Столы",
        images: ["/coffee-table.png"],
        thumbnail: "/coffee-table.png",
        sku: "CT-MARB-006",
        stock: 10,
        materials: ["Мрамор", "Металл"],
        dimensions: {
            width: 90,
            height: 45,
            depth: 60,
        },
        colors: ["Белый мрамор", "Золотистый металл"],
        featured: false,
        active: true,
    },
    {
        id: "7",
        name: "Письменный стол 'Орех'",
        slug: "stol-orekh",
        description:
            "Современный письменный стол из темного ореха с металлическими ножками. Минималистичный дизайн и функциональность для комфортной работы. Встроенный ящик для хранения.",
        price: 28000,
        category: "Столы",
        images: ["/desk-walnut.png"],
        thumbnail: "/desk-walnut.png",
        sku: "DK-WALN-007",
        stock: 6,
        materials: ["Массив ореха", "Металл"],
        dimensions: {
            width: 120,
            height: 75,
            depth: 60,
        },
        colors: ["Темный орех"],
        featured: false,
        active: true,
    },
    {
        id: "8",
        name: "Комод 'Нордик'",
        slug: "komod-nordic",
        description:
            "Скандинавский комод белого цвета с деревянными ножками. Три просторных отделения для хранения. Идеален для спальни, прихожей или гостиной. Сочетание функциональности и стиля.",
        price: 26000,
        category: "Стеллажи",
        images: ["/cabinet-white.png"],
        thumbnail: "/cabinet-white.png",
        sku: "CB-NORD-008",
        stock: 5,
        materials: ["МДФ", "Дерево"],
        dimensions: {
            width: 140,
            height: 75,
            depth: 45,
        },
        colors: ["Белый", "Натуральное дерево"],
        featured: false,
        active: true,
    },
];

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

/**
 * Get products by category
 */
export function getProductsByCategory(categorySlug: string): Product[] {
    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return [];
    return products.filter((p) => p.category === category.name);
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
    return products.filter((p) => p.featured && p.active);
}
