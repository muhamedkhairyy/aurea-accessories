import type { Metadata } from "next";
import ProductDetails from "@/components/product/ProductDetails";
import { loadCatalog } from "@/utils/initial-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = (await loadCatalog())?.products.find((p) => p.id === id);
  if (!product) return { title: "Aurèa Accessories" };
  return {
    title: `${product.name} | Aurèa Accessories`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { color } = await searchParams;
  // The product itself comes from the shop provider (loaded by the layout and kept live by polling)
  return <ProductDetails id={id} initialColor={typeof color === "string" ? color : ""} />;
}
