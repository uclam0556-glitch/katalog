"use client";

import { FiTrash2 } from "react-icons/fi";
import { deleteProductAction } from "@/app/actions";

interface DeleteProductButtonProps {
    id: string;
    productName: string;
}

export default function DeleteProductButton({ id, productName }: DeleteProductButtonProps) {
    return (
        <form action={deleteProductAction.bind(null, id)}>
            <button
                type="submit"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Удалить"
                onClick={(e) => {
                    if (!confirm(`Удалить "${productName}"?`)) {
                        e.preventDefault();
                    }
                }}
            >
                <FiTrash2 className="w-4 h-4" />
            </button>
        </form>
    );
}
