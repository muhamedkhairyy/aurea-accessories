"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag, Star, Truck, ShieldCheck, Droplets, Sparkles } from "lucide-react";
import { useShop, type Product } from "@/context/ShopContext";
import { optionLabel, colorImage, discountPercent, formatPrice, isOptimizable } from "@/utils/catalog";
import ColorSwatches from "@/components/ui/ColorSwatches";
import ProductMaterials from "@/components/ui/ProductMaterials";
import { productMaterials } from "@/utils/materials";
import { translations } from "@/utils/translations";

export default function ProductDetails({ id, initialColor }: { id: string; initialColor: string }) {
  const { products, language } = useShop();
  const product = products.find((p) => p.id === id);
  const ar = language === "ar";

  if (!product) {
    // Empty catalog means the dashboard hasn't answered yet — the provider keeps retrying
    return products.length === 0 ? (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />
      </div>
    ) : (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-2xl font-bold">{ar ? "المنتج غير موجود" : "Product not found"}</h1>
        <p className="mt-2 text-sm text-[#71717A]">
          {ar ? "ربما تمت إزالة هذه القطعة من المجموعة." : "This piece may have been removed from the collection."}
        </p>
        <Link href="/#bestsellers" className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-xs font-semibold text-white hover:bg-[#C9A227]">
          {ar ? "العودة للتسوق" : "Back to shop"}
        </Link>
      </div>
    );
  }

  // Keyed by product so the picks reset when moving to another product
  return <ProductView key={product.id} product={product} initialColor={initialColor} />;
}

function ProductView({ product, initialColor }: { product: Product; initialColor: string }) {
  const { products, addToCart, wishlist, toggleWishlist, categoryName, language } = useShop();
  const router = useRouter();
  const ar = language === "ar";
  const t = translations[language];

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || "Standard");
  const [pickedColor, setPickedColor] = useState(initialColor);
  const [quantity, setQuantity] = useState(1);

  // Fall back to the first color if the picked one disappears in a catalog refresh
  const has = (name: string) => product.colors.some((c) => c.name === name);
  const selectedColor = has(pickedColor) ? pickedColor : product.colors[0]?.name ?? "";
  const variant = product.variants.includes(selectedVariant) ? selectedVariant : product.variants[0] || "Standard";

  const inWishlist = wishlist.includes(product.id);
  const soldOut = product.stock <= 0;
  const discount = discountPercent(product);
  const image = colorImage(product, selectedColor);
  const maxQty = Math.max(product.stock, 1);
  const qty = Math.min(quantity, maxQty);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => addToCart(product, qty, variant, selectedColor);
  const handleBuyNow = () => {
    addToCart(product, qty, variant, selectedColor);
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#71717A]">
        <Link href="/" className="hover:text-[#C9A227]">{ar ? "الرئيسية" : "Home"}</Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        <Link href="/#bestsellers" className="hover:text-[#C9A227]">{categoryName(product.category)}</Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        <span className="truncate text-[#111111]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E4E4E7] bg-[#F5F5F5]">
            <Image
              src={image}
              alt={selectedColor ? `${product.name} – ${optionLabel(selectedColor, language)}` : product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover object-center ${soldOut ? "opacity-60 grayscale" : ""}`}
              priority
              unoptimized={!isOptimizable(image)}
            />
            {soldOut ? (
              <span className="absolute start-4 top-4 rounded bg-[#71717A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {ar ? "نفدت الكمية" : "Sold Out"}
              </span>
            ) : product.stock <= 8 ? (
              <span className="absolute start-4 top-4 rounded bg-[#EF4444] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {ar ? `متبقي ${product.stock} فقط` : `Only ${product.stock} left in stock`}
              </span>
            ) : discount > 0 && (
              <span className="absolute start-4 top-4 rounded-full bg-[#111111] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {ar ? "تخفيض" : "Sale"} -{discount}%
              </span>
            )}
          </div>

          {/* One thumbnail per color that has its own photo */}
          {product.colors.filter((c) => c.image).length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {product.colors.filter((c) => c.image).map((c) => (
                <button
                  key={c.name}
                  onClick={() => setPickedColor(c.name)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-[#F5F5F5] transition-all ${c.name === selectedColor ? "border-[#C9A227]" : "border-transparent hover:border-[#E4E4E7]"}`}
                  aria-label={optionLabel(c.name, language)}
                >
                  <Image src={c.image} alt={optionLabel(c.name, language)} fill sizes="80px" className="object-cover" unoptimized={!isOptimizable(c.image)} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A227]">{categoryName(product.category)}</span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

          {product.rating > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold">{product.rating}</span>
              <span className="text-xs text-[#71717A]">({product.reviewsCount} {ar ? "تقييم" : "verified reviews"})</span>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price, language)}</span>
            {discount > 0 && (
              <>
                <span className="text-base text-[#71717A] line-through">{formatPrice(product.oldPrice, language)}</span>
                <span className="rounded bg-[#C9A227]/10 px-2 py-0.5 text-xs font-bold text-[#C9A227]">
                  {ar ? `وفّري ${discount}%` : `Save ${discount}%`}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-[#71717A]">{product.description}</p>

          {productMaterials(product).length > 0 && (
            <div className="mt-5">
              <ProductMaterials materials={productMaterials(product)} language={language} />
            </div>
          )}

          <div className="mt-6 space-y-6 border-t border-[#E4E4E7] pt-6">
            {product.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                  {ar ? "الشكل / المقاس" : "Style / Size"}
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${variant === v
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-[#E4E4E7] bg-white text-[#111111] hover:border-[#111111]"
                        }`}
                    >
                      {optionLabel(v, language)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Only worth a picker when there's a choice; a single color is selected automatically */}
            {product.colors.length > 1 && (
              <ColorSwatches colors={product.colors} selected={selectedColor} onSelect={setPickedColor} label={ar ? "اللون" : "Color"} />
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">{ar ? "الكمية" : "Quantity"}</span>
              <div className="flex items-center rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5">
                <button onClick={() => setQuantity(Math.max(1, qty - 1))} className="p-1 text-[#71717A] hover:text-[#111111]" aria-label={t.decrease_qty}>
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQuantity(Math.min(qty + 1, maxQty))} className="p-1 text-[#71717A] hover:text-[#111111]" aria-label={t.increase_qty}>
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={soldOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#111111] bg-white py-3.5 text-sm font-semibold text-[#111111] transition-all hover:bg-[#111111] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#111111]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{soldOut ? (ar ? "نفدت الكمية" : "Sold Out") : t.add_to_bag}</span>
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`rounded-full border p-3.5 transition-all ${inWishlist
                  ? "border-[#EF4444] bg-[#EF4444]/5 text-[#EF4444]"
                  : "border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                aria-label={inWishlist ? t.remove_from_wishlist : t.add_to_wishlist}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>
            {!soldOut && (
              <button
                onClick={handleBuyNow}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#C9A227]"
              >
                {ar ? `اشتري الآن - ${formatPrice(product.price * qty, language)}` : `Buy Now - ${formatPrice(product.price * qty, language)}`}
              </button>
            )}
          </div>

          {/* Delivery + material highlights */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            {[
              { icon: Truck, title: ar ? "توصيل لكل المحافظات" : "Delivery Across Egypt", desc: ar ? "85 ج.م القاهرة والجيزة · 95 ج.م باقي المحافظات" : "EGP 85 Cairo & Giza · EGP 95 elsewhere" },
              { icon: Droplets, title: t.badge_waterproof, desc: t.badge_waterproof_desc },
              { icon: Sparkles, title: t.badge_tarnish, desc: t.badge_tarnish_desc },
              { icon: ShieldCheck, title: t.badge_hypo, desc: t.badge_hypo_desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-2.5 rounded-xl border border-[#C9A227]/15 bg-white p-3">
                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C9A227]" />
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="text-[11px] text-[#71717A]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-[#E4E4E7] pt-10">
          <h2 className="font-serif text-2xl font-bold">{ar ? "قد يعجبكِ أيضاً" : "You may also like"}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white">
                <div className="relative aspect-square bg-[#F5F5F5]">
                  <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={!isOptimizable(p.image)} />
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 font-serif text-sm font-bold group-hover:text-[#C9A227]">{p.name}</p>
                  <p className="mt-1 text-sm font-extrabold">{formatPrice(p.price, language)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Link href="/#bestsellers" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A] hover:text-[#C9A227]">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {t.continue_shopping}
      </Link>
    </div>
  );
}
