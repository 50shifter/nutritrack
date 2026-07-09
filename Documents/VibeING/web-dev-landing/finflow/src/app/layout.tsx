import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./_components/ClientLayout";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "FinFlow — Финтех Dashboard",
  description: "Панель управления финансами с графиками и аналитикой.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full" style={{ background: "rgb(3, 3, 5)" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
