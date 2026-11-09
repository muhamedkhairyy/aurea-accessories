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

export async function loadInitialData(): Promise<InitialShopData> {
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

// Catalog only, for per-page metadata; null when the dashboard is slow or down
export async function loadCatalog() {
  return withTimeout(fetchCatalog());
}
