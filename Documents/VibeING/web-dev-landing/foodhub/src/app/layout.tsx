import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FoodHub — Доставка еды",
    template: "%s | FoodHub",
  },
  description: "Заказывайте еду из лучших ресторанов города. Быстрая доставка.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3004"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["доставка еды", "рестораны", "бургеры", "пицца", "суши", "foodhub"],
  openGraph: {
    title: "FoodHub — Доставка еды",
    description: "Заказывайте еду из лучших ресторанов города",
    type: "website",
    locale: "ru_RU",
    siteName: "FoodHub",
  },
  twitter: {
    card: "summary",
    title: "FoodHub — Доставка еды",
    description: "Заказывайте еду из лучших ресторанов города",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable}`}>
      <body className="min-h-full bg-dark-900">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
