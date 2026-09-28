// "Shop By Category" section content, managed from the Aurèa dashboard (GET /api/content/categories)
import { DASHBOARD_API_URL } from "@/utils/catalog";

type Lang = "en" | "ar";
type Localized = Record<Lang, string>;

// What a card opens: all products, the product grid filtered to a category, or a page section
export type CardLink = { type: "all" } | { type: "category"; value: string } | { type: "section"; value: string };

export interface CategoryCard {
  id: string;
  link: CardLink;
  visible: boolean;
  image: string;
  countMode: "auto" | "custom" | "hidden";
  name: Localized;
  count: Localized;
}

export interface CategoriesSection {
  showSection: boolean;
  heading: Record<Lang, { eyebrow: string; title: string; subtitle: string; explore: string }>;
  items: CategoryCard[];
}

export async function fetchCategoriesSection(): Promise<CategoriesSection> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/content/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Categories section request failed (${res.status})`);
  return (await res.json()).section;
}
