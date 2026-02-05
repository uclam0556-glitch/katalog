import { HeaderNew } from "@/components/layout/HeaderNew";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <HeaderNew />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton phoneNumber="+79667422726" />
            <ScrollToTop />
        </>
    );
}
