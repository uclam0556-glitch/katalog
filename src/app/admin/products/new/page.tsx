import ProductForm from "@/components/admin/ProductForm";
import PageHeader from "@/components/admin/ui/PageHeader";

export default function NewProductPage() {
    return (
        <div>
            <PageHeader
                title="Новый товар"
                description="Добавьте новый товар в каталог"
                breadcrumbs={[
                    { label: "Товары", href: "/admin/products" },
                    { label: "Новый товар" },
                ]}
            />
            <ProductForm />
        </div>
    );
}
