import type { Metadata } from "next";
import "./globals.css";

const playfair = { variable: "font-serif" };
const inter = { variable: "font-sans" };

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`font-serif font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
