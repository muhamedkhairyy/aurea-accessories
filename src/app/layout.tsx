import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// TikTok Pixel for ad tracking (base code from TikTok Ads Manager); ttq.page() records each page view
const TIKTOK_PIXEL_ID = "DB960Q3C77UC7FTGLBQ0";

export const metadata: Metadata = {
  title: "Aurèa Accessories | Luxury Stainless Steel Jewelry",
  description: "Shop premium, waterproof, tarnish-free, and hypoallergenic stainless steel jewelry by Aurèa Accessories. Timeless luxury designed to last forever.",
  keywords: ["jewelry", "stainless steel accessories", "waterproof jewelry", "tarnish free", "hypoallergenic jewelry", "Aurea Accessories", "luxury jewelry", "rings", "necklaces", "bracelets"],
  openGraph: {
    title: "Aurèa Accessories | Luxury Stainless Steel Jewelry",
    description: "Waterproof, tarnish-free, and hypoallergenic jewelry designed to last forever.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F5F2] font-sans text-[#111111] antialiased">
        {children}
      </body>
      <Script id="tiktok-pixel" strategy="afterInteractive">
        {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
`}
      </Script>
    </html>
  );
}
