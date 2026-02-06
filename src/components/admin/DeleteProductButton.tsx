"use client";

import { deleteProductAction } from "@/app/actions";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useToast } from "@/components/admin/ui/Toast";

export default function DeleteProductButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleDelete = async () => {
        if (!confirm("Вы уверены, что хотите удалить этот товар?")) return;

        setLoading(true);
        try {
            await deleteProductAction(id);
            showToast("Товар удален", "success");
        } catch (error) {
            showToast("Ошибка удаления", "error");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
            <FiTrash2 className="w-5 h-5" />
        </button>
    );
}
