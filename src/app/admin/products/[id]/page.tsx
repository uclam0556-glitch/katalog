import { getProduct } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <PageHeader
                title="Редактировать товар"
                description={`Изменение товара "${product.name}"`}
                breadcrumbs={[
                    { label: "Товары", href: "/admin/products" },
                    { label: "Редактировать" },
                ]}
            />
            <ProductForm initialData={product} />
        </div>
    );
}
