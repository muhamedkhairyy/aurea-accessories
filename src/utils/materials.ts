import type { Product } from "@/context/ShopContext";

type Text = { en: string; ar: string };

export interface MaterialPart {
  part: Text;
  material: Text;
  detail: Text;
}

// Necklaces: a stainless-steel chain with a gold-plated pendant
const NECKLACE_MATERIALS: MaterialPart[] = [
  {
    part: { en: "Necklace chain", ar: "سلسلة القلادة" },
    material: { en: "Stainless Steel", ar: "ستانلس ستيل" },
    detail: { en: "Solid stainless steel — waterproof and won't rust.", ar: "ستانلس ستيل بالكامل — مقاوم للماء ولا يصدأ." },
  },
  {
    part: { en: "Pendant", ar: "الدلاية" },
    material: { en: "Gold Plated", ar: "مطلية بالذهب" },
    detail: { en: "Coated with a layer of gold (not solid gold).", ar: "مغطاة بطبقة من الذهب (ليست ذهباً خالصاً)." },
  },
];

// Materials to show for a product, or [] when none are defined for its category
export function productMaterials(product: Pick<Product, "category">): MaterialPart[] {
  return product.category.toLowerCase().startsWith("necklace") ? NECKLACE_MATERIALS : [];
}
