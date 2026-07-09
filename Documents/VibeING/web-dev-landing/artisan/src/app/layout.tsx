import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeToggle";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Artisan — Фотограф в Москве",
    template: "%s | Artisan",
  },
  description: "Портфолио фотографа Артёма Волкова. Портретная, свадебная, коммерческая фотография в Москве.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3006"),
  keywords: [
    "фотограф",
    "Москва",
    "портрет",
    "свадьба",
    "коммерческая фотография",
    "лейфстайл",
  ],
  openGraph: {
    title: "Artisan — Фотограф в Москве",
    description: "Кинематографичная фотография для тех, кто ценит каждый момент.",
    type: "website",
    locale: "ru_RU",
    siteName: "Artisan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisan — Фотограф в Москве",
    description: "Кинематографичная фотография для тех, кто ценит каждый момент.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable}`}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Артём Волков",
              jobTitle: "Фотограф",
              description: "Профессиональный фотограф с 8-летним опытом. Портретная, свадебная, коммерческая фотография.",
              url: "https://artisan.photo",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Москва",
                addressCountry: "RU",
              },
              sameAs: [
                "https://instagram.com/artisan.photo",
                "https://facebook.com/artisan.photo",
              ],
              knowsAbout: [
                "Портретная фотография",
                "Свадебная фотография",
                "Коммерческая фотография",
                "Лейфстайл",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-dark-900">
        <ThemeProvider>
          {/* Yandex.Metrica — replace 12345678 with your actual counter ID */}
          <Script
            id="yandex-metrika"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j=0; j<document.scripts.length; j++) {if(document.scripts[j].src === r) { return; }}
                k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
                })(window, document, "script", "https://mc.yandex.ru/metrika/watch.js", "ym");
                window.ym(12345678, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
              `,
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
