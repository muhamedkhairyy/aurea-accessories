import { connection } from "next/server";
import ShopShell from "@/components/ShopShell";
import { loadInitialData } from "@/utils/initial-data";

// Shared by the home, product and cart pages, so the shop state (cart, wishlist, language) survives navigation
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  await connection(); // catalog is live data — render on every request, never at build time
  return <ShopShell initial={await loadInitialData()}>{children}</ShopShell>;
}
