import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    </html>
  );
}
