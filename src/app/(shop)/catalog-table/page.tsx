import { products } from "@/data/products";
import { categories } from "@/data/products";
import CatalogTableClient from "./CatalogTableClient";

export const metadata = {
    title: "Каталог мебели - Все товары | АМЭА",
    description: "Полный каталог мебели в табличном виде с удобными фильтрами и поиском",
};

export default function CatalogTablePage() {
    return <CatalogTableClient products={products} categories={categories} />;
}
