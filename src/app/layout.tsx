import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://amea-furniture.ru"; // Update with real domain if available

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "амэа - Премиальная мебель в Грозном",
    template: "%s | амэа"
  },
  description: "Эксклюзивная мебель в стиле лофт, скандинавский и модерн. Доставка по Грозному и Чеченской Республике. Высокое качество и стиль.",
  keywords: ["мебель Грозный", "лофт мебель", "диваны Чечня", "стулья", "столы", "амэа"],
  authors: [{ name: "Amea Furniture" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "амэа - Мебель",
    title: "амэа - Премиальная мебель для вашего дома",
    description: "Современная мебель в стиле лофт. Стулья, столы, диваны. Доставка по всей России.",
    images: [
      {
        url: "/og-image.jpg", // Needs to be created or mapped
        width: 1200,
        height: 630,
        alt: "амэа - Мебель",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "амэа - Премиальная мебель",
    description: "Современная мебель в стиле лофт в Грозном.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Google Fonts CDN - Playfair Display & Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Helper to set CSS variables matching standard next/font names */}
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-serif: 'Playfair Display', serif;
            --font-sans: 'Inter', sans-serif;
          }
          body {
            font-family: var(--font-sans);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-serif);
          }
        `}} />
      </head>
      <body className="antialiased font-sans">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
