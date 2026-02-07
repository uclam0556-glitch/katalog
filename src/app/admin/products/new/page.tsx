import ProductForm from "@/components/admin/ProductForm";
import PageHeader from "@/components/admin/ui/PageHeader";

export default function NewProductPage() {
    return (
        <div>
            {/* PageHeader removed to prevent duplication with ProductForm header */}
            <ProductForm />
        </div>
    );
}
