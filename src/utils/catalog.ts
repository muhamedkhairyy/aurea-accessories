// Live catalog + orders come from the Aurèa dashboard (separate Node.js project).
import type { Product, ShopCategory } from "@/context/ShopContext";

export const DASHBOARD_API_URL = (process.env.NEXT_PUBLIC_DASHBOARD_API_URL || "http://localhost:4000").replace(/\/+$/, "");

export const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

// Dashboard uploads are relative to the dashboard server; missing images get a placeholder
export function resolveImage(src: string | undefined): string {
  if (!src) return PLACEHOLDER_IMAGE;
  if (src.startsWith("/uploads/")) return `${DASHBOARD_API_URL}${src}`;
  return src;
}

// next/image only optimizes whitelisted hosts (see next.config.ts); anything else renders as-is
export const isOptimizable = (src: string) => src.startsWith("https://images.unsplash.com/");

// Prices are in Egyptian pounds: "EGP 1,250" / "1,250 ج.م"
export function formatPrice(amount: number, language: "en" | "ar"): string {
  const n = amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return language === "ar" ? `${n} ج.م` : `EGP ${n}`;
}

export function discountPercent(product: { price: number; oldPrice: number }): number {
  if (!(product.oldPrice > product.price)) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

// Used both on the server (first render) and in the browser (polling)
export async function fetchCatalog(): Promise<{ products: Product[]; categories: ShopCategory[] | undefined }> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  const data: { products: Product[]; categoryList?: ShopCategory[] } = await res.json();
  return { products: data.products.map((p) => ({ ...p, image: resolveImage(p.image) })), categories: data.categoryList };
}
