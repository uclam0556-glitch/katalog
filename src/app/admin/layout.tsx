import { ReactNode } from "react";
import TopNav from "@/components/admin/ui/TopNav";
import { ToastProvider } from "@/components/admin/ui/Toast";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Top Navigation with Integrated Menu */}
                <TopNav />

                {/* Main Content - NO SIDEBAR, FULL WIDTH */}
                <main className="pt-24 min-h-screen">
                    {/* LARGE TOP SPACING - 96px from top bar */}
                    <div className="px-8 pt-16 pb-8">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
