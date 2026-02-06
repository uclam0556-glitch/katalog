import { ReactNode } from "react";
import TopNav from "@/components/admin/ui/TopNav";
import { ToastProvider } from "@/components/admin/ui/Toast";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 font-sans">
                {/* Top Navigation */}
                <TopNav />

                {/* Main Content */}
                <main className="pt-24 min-h-screen">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
