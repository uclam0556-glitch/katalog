import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "амэа - Премиальная мебель для вашего дома",
  description:
    "Современная мебель в стиле лофт, скандинавский и индустриальный дизайн. Стулья, столы, диваны, стеллажи. Доставка по всей России.",
  keywords: [
    "мебель",
    "лофт",
    "скандинавский стиль",
    "стулья",
    "столы",
    "диваны",
    "стеллажи",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

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
        {children}
      </body>
    </html>
  );
}
