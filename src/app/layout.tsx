import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
