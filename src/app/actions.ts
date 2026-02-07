"use server";

import { revalidatePath } from "next/cache";
import { saveProduct, deleteProduct } from "@/lib/db";
import { Product } from "@/types/product";
import { v4 as uuidv4 } from "uuid";

// Helper to disable caching for server actions in some contexts if needed
// but revalidatePath handles it mostly.

/**
 * Save Product Action
 */
export async function saveProductAction(formData: FormData) {
    const rawFormData = {
        id: formData.get("id") as string,
        name: formData.get("name") as string,
        price: parseInt(formData.get("price") as string),
        oldPrice: (() => {
            const val = formData.get("oldPrice");
            if (!val || val.toString().trim() === "") return undefined;
            const parsed = parseInt(val.toString().replace(/\D/g, ""));
            return isNaN(parsed) ? undefined : parsed;
        })(),
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        thumbnail: formData.get("thumbnail") as string,
        images: JSON.parse(formData.get("images") as string || "[]") as string[],
        stock: parseInt(formData.get("stock") as string || "0"),
        sku: formData.get("sku") as string || "",
    };

    // Basic validation
    if (!rawFormData.name || !rawFormData.price) {
        throw new Error("Название и цена обязательны");
    }

    if (!rawFormData.images || rawFormData.images.length === 0) {
        throw new Error("Добавьте хотя бы одно фото");
    }

    const product: Product = {
        ...rawFormData,
        id: rawFormData.id || uuidv4(),
        slug: rawFormData.name.toLowerCase().replace(/\s+/g, "-"),
        thumbnail: rawFormData.images[0], // First image is thumbnail
        images: rawFormData.images,
        active: true,
        featured: formData.get("featured") === "true",
        colors: (formData.get("colors") as string)?.split(",").map(c => c.trim()).filter(Boolean) || [],
        materials: (formData.get("materials") as string)?.split(",").map(m => m.trim()).filter(Boolean) || [],
        dimensions: {
            width: 0, height: 0, depth: 0
        },
        status: 'active',
        updatedAt: new Date().toISOString(),
    };

    await saveProduct(product);
    revalidatePath("/catalog");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
}

/**
 * Delete Product Action
 */
export async function deleteProductAction(id: string) {
    await deleteProduct(id);
    revalidatePath("/catalog");
    revalidatePath("/admin");
}
