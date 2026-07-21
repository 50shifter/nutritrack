import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { MetadataLayout } from "./_components/MetricsLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediCare — Телемедицина",
  description: "Портал телемедицины: запись к врачу, видео-консультации, история болезни, аптека.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"),
  openGraph: {
    title: "MediCare — Телемедицина нового поколения",
    description: "Запись к врачу онлайн, видеоконсультации, история болезни",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable}`}>
      <body className="min-h-full bg-white-900">
        <MetadataLayout>{children}</MetadataLayout>
      </body>
    </html>
  );
}
