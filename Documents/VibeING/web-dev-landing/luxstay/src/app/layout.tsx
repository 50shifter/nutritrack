import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LuxStay — Бутик-отели мира",
    template: "%s | LuxStay",
  },
  description: "Роскошные бутик-отели. Бронирование номеров, 3D-туры, ресторан.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005"),
  openGraph: {
    title: "LuxStay — Бутик-отели мира",
    description: "Роскошные бутик-отели в лучших городах мира. Бронируйте с уверенностью.",
    type: "website",
    locale: "ru_RU",
    siteName: "LuxStay",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxStay — Бутик-отели мира",
    description: "Роскошные бутик-отели в лучших городах мира.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable}`}>
      <head>
        {/* JSON-LD structured data for Hotel chain */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HotelChain",
              name: "LuxStay",
              description: "Роскошные бутик-отели в лучших городах мира",
              url: "https://luxstay.com",
              logo: "https://luxstay.com/favicon.svg",
              telephone: "+78001234567",
              email: "booking@luxstay.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Тверская 12",
                addressLocality: "Москва",
                addressCountry: "RU",
              },
              numberOfRooms: "200+",
              sameAs: [
                "https://t.me/luxstay",
                "https://instagram.com/luxstay",
              ],
            }),
          }}
        />
        {/* JSON-LD for each hotel */}
        <Script
          id="hotels-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Hotel",
                  name: "The Grand Paris",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Париж",
                    addressCountry: "FR",
                  },
                  starRating: { "@type": "Rating", ratingValue: "5" },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "1250",
                  },
                },
                {
                  "@type": "Hotel",
                  name: "Sakura Zen Retreat",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Киото",
                    addressCountry: "JP",
                  },
                  starRating: { "@type": "Rating", ratingValue: "5" },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.8",
                    reviewCount: "890",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-dark-900">{children}</body>
    </html>
  );
}
