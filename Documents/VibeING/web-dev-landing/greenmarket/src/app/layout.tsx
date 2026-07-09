import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider, WishlistProvider } from "@/lib/context";
import LayoutShell from "./_components/LayoutShell";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "GreenMarket — Эко-маркетплейс",
    template: "%s | GreenMarket",
  },
  description: "Органические продукты с доставкой на дом. Свежее, эко, качественно.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3003"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["эко продукты", "органика", "фермерские продукты", "доставка", "greenmarket"],
  openGraph: {
    title: "GreenMarket — Эко-маркетплейс",
    description: "Органические продукты с доставкой на дом. Свежее, эко, качественно.",
    type: "website",
    locale: "ru_RU",
    siteName: "GreenMarket",
  },
  twitter: {
    card: "summary",
    title: "GreenMarket — Эко-маркетплейс",
    description: "Органические продукты с доставкой на дом. Свежее, эко, качественно.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#0F1410] text-[#F5F0E8] font-sans antialiased">
        <CartProvider>
          <WishlistProvider>
            <LayoutShell>{children}</LayoutShell>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
