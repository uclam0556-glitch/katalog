"use client";

import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

export default function AdminLogoutButton() {
    return (
        <Link
            href="/admin/login"
            onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT" }}
            title="Выйти"
        >
            <FiLogOut className="w-5 h-5 text-neutral-400 hover:text-red-500 transition-colors" />
        </Link>
    );
}
