import { getProducts } from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await getProducts();
    return <AdminDashboardClient initialProducts={products} />;
}
