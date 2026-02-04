import CatalogClient from "./CatalogClient";
import { getProducts } from "@/lib/db";

export default async function CatalogPage() {
    const products = await getProducts();

    return <CatalogClient initialProducts={products} />;
}
