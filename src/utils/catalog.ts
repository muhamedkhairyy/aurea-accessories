// Live catalog + orders come from the Aurèa dashboard (separate Node.js project).
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

export function discountPercent(product: { price: number; oldPrice: number }): number {
  if (!(product.oldPrice > product.price)) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}
