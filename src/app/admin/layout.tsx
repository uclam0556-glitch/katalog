import { ReactNode } from "react";
import TopNav from "@/components/admin/ui/TopNav";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const isProductForm = pathname === "/admin/products/new" || pathname.includes("/edit"); // Hide for new and edit

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans overflow-x-hidden selection:bg-neutral-900 selection:text-white">
                {/* Top Navigation - Hidden on Product Form */}
                {!isProductForm && <TopNav />}

                {/* Main Content - No padding on Product Form to allow full control */}
                <main className={isProductForm ? "min-h-screen" : "pt-24 md:pt-28 min-h-screen pb-20"}>
                    <div className={isProductForm ? "w-full animate-[fadeIn_0.5s_ease-out]" : "container mx-auto px-4 md:px-6 max-w-7xl animate-[fadeIn_0.5s_ease-out]"}>
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
