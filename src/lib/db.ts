import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const TABLE = "products";

/**
 * Get all products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('updatedAt', { ascending: false });

        if (error) {
            console.error("Error fetching products:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/**
 * Get single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

/**
 * Save (Create or Update) a product
 */
export async function saveProduct(product: Product): Promise<void> {
    try {
        if (!product.id) {
            throw new Error("Product ID is missing");
        }

        const { error } = await supabase
            .from(TABLE)
            .upsert(product, { onConflict: 'id' });

        if (error) {
            console.error("Error saving product:", error);
            throw new Error(`Failed to save product: ${error.message}`);
        }
    } catch (error: any) {
        console.error("Error saving product:", error);
        throw error;
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    try {
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting product:", error);
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    } catch (error: any) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
