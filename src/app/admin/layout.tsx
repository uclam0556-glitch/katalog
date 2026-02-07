import { ReactNode } from "react";
import TopNav from "@/components/admin/ui/TopNav";
import { ToastProvider } from "@/components/admin/ui/Toast";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans overflow-x-hidden selection:bg-neutral-900 selection:text-white">
                {/* Top Navigation */}
                <TopNav />

                {/* Main Content */}
                <main className="pt-20 md:pt-28 min-h-screen pb-10">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
