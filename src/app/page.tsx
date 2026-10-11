import { connection } from "next/server";
import Storefront from "@/components/Storefront";
import type { InitialShopData } from "@/context/ShopContext";
import { fetchCatalog } from "@/utils/catalog";
import { fetchHero } from "@/utils/hero";
import { fetchCategoriesSection } from "@/utils/categories-section";

// Don't hold the page for a slow dashboard; the client keeps retrying on its own
const DASHBOARD_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>): Promise<T | null> {
  return Promise.race([
    promise.catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), DASHBOARD_TIMEOUT_MS)),
  ]);
}

async function loadInitialData(): Promise<InitialShopData> {
  const [catalog, hero, categoriesSection] = await Promise.all([
    withTimeout(fetchCatalog()),
    withTimeout(fetchHero()),
    withTimeout(fetchCategoriesSection()),
  ]);
  return {
    products: catalog?.products ?? [],
    categories: catalog?.categories ?? [],
    hero,
    categoriesSection,
  };
}

export default async function Home() {
  await connection(); // catalog is live data — render on every request, never at build time
  return <Storefront initial={await loadInitialData()} />;
}
