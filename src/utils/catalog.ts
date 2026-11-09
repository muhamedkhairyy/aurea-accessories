// Live catalog + orders come from the Aurèa dashboard (separate Node.js project).
import type { Product, ProductColor, ShopCategory } from "@/context/ShopContext";

// Production builds use the live dashboard; local dev uses the one on port 4000
const DEFAULT_DASHBOARD_URL = process.env.NODE_ENV === "production" ? "https://admin.aureaaccessories.com" : "https://admin.aureaaccessories.com";
export const DASHBOARD_API_URL = (process.env.NEXT_PUBLIC_DASHBOARD_API_URL || DEFAULT_DASHBOARD_URL).replace(/\/+$/, "");

export const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export function resolveImage(src: string | undefined): string {
  if (!src) return PLACEHOLDER_IMAGE;
  if (src.startsWith("/uploads/")) return `${DASHBOARD_API_URL}${src}`;
  return src;
}

export const isOptimizable = (src: string) => src.startsWith("https://images.unsplash.com/");
export function formatPrice(amount: number, language: "en" | "ar"): string {
  const n = amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return language === "ar" ? `${n} ج.م` : `EGP ${n}`;
}

// The photo to show for a picked color: its own image if it has one, otherwise the product image
export function colorImage(product: Product, colorName: string | undefined): string {
  return product.colors.find((c) => c.name === colorName)?.image || product.image;
}

export function discountPercent(product: { price: number; oldPrice: number }): number {
  if (!(product.oldPrice > product.price)) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export async function fetchCatalog(): Promise<{ products: Product[]; categories: ShopCategory[] | undefined }> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  const data: { products: Product[]; categoryList?: ShopCategory[] } = await res.json();
  const products = data.products.map((p) => ({
    ...p,
    image: resolveImage(p.image),
    // Older dashboards don't send colors; a color without its own photo keeps "" (falls back to the product image)
    colors: (p.colors ?? []).map((c: ProductColor) => ({ ...c, image: c.image ? resolveImage(c.image) : "" })),
  }));
  return { products, categories: data.categoryList };
}

// Arabic display names for common color / style options typed in the dashboard (display only —
// orders always send the original name). Unknown names are shown as typed.
const OPTION_NAMES_AR: Record<string, string> = {
  gold: "ذهبي", "rose gold": "ذهبي وردي", "rose-gold": "ذهبي وردي", silver: "فضي", white: "أبيض", black: "أسود",
  red: "أحمر", pink: "وردي", bink: "وردي", blue: "أزرق", "light blue": "أزرق فاتح", "navy": "كحلي", green: "أخضر",
  purple: "بنفسجي", yellow: "أصفر", orange: "برتقالي", brown: "بني", beige: "بيج", grey: "رمادي", gray: "رمادي",
  multicolor: "متعدد الألوان", "multi color": "متعدد الألوان", standard: "قياسي",
};
export function optionLabel(name: string, language: "en" | "ar"): string {
  if (language !== "ar") return name;
  const key = name.trim().toLowerCase();
  if (OPTION_NAMES_AR[key]) return OPTION_NAMES_AR[key];
  const size = key.match(/^size\s*(.+)$/); // "Size 7" → "مقاس 7"
  return size ? `مقاس ${size[1]}` : name;
}
