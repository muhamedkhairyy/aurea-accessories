"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { isOptimizable, resolveImage } from "@/utils/catalog";
import type { CardLink, CategoriesSection } from "@/utils/categories-section";

// Built-in content, used until (or if) the dashboard's Categories section loads
const BUILT_IN: CategoriesSection = {
  showSection: true,
  heading: {
    en: {
      eyebrow: "Curated Collections",
      title: "Shop By Category",
      subtitle: "Discover waterproof, highly durable stainless steel jewelry pieces plated with genuine 18K gold.",
      explore: "Explore",
    },
    ar: {
      eyebrow: "تشكيلات مختارة",
      title: "تسوقي حسب الفئة",
      subtitle: "اكتشفي مجوهرات ستانلس ستيل مقاومة للماء وعالية المتانة ومطلية بذهب عيار 18 أصلي.",
      explore: "اكتشفي",
    },
  },
  items: [
    { id: "card-Necklaces", link: { type: "category", value: "Necklaces" }, visible: true, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600", countMode: "custom", name: { en: "Necklaces", ar: "قلادات" }, count: { en: "12 Pieces", ar: "12 قطعة" } },
    { id: "card-Rings", link: { type: "category", value: "Rings" }, visible: true, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600", countMode: "custom", name: { en: "Rings", ar: "خواتم" }, count: { en: "8 Pieces", ar: "8 قطع" } },
    { id: "card-Bracelets", link: { type: "category", value: "Bracelets" }, visible: true, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600", countMode: "custom", name: { en: "Bracelets", ar: "أساور" }, count: { en: "6 Pieces", ar: "6 قطع" } },
    { id: "card-Earrings", link: { type: "category", value: "Earrings" }, visible: true, image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600", countMode: "custom", name: { en: "Earrings", ar: "أقراط" }, count: { en: "10 Pieces", ar: "10 قطع" } },
    { id: "card-Sets", link: { type: "category", value: "Sets" }, visible: true, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600", countMode: "custom", name: { en: "Sets", ar: "أطقم" }, count: { en: "5 Curation Sets", ar: "5 أطقم مختارة" } },
  ],
};

function liveCountLabel(n: number, language: "en" | "ar") {
  if (language === "ar") return n === 2 ? "قطعتان" : `${n} ${n >= 3 && n <= 10 ? "قطع" : "قطعة"}`;
  return `${n} ${n === 1 ? "Piece" : "Pieces"}`;
}

export default function Categories() {
  const { setSelectedCategory, language, products, categoriesSection, categoryName } = useShop();
  const section = categoriesSection ?? BUILT_IN;

  const handleCardClick = (link: CardLink) => {
    // Product cards filter the product grid; section cards just scroll to their section
    if (link.type !== "section") setSelectedCategory(link.type === "category" ? link.value : "All");
    const element = document.getElementById(link.type === "section" ? link.value : "bestsellers");
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Arabic falls back to English for anything left empty in the dashboard
  const heading = section.heading[language];
  const pick = (key: keyof typeof heading) => heading[key] || section.heading.en[key];

  const cards = section.items
    .filter((item) => item.visible)
    .map((item) => {
      const { link } = item;
      const linked = link.type === "all" ? products : link.type === "category" ? products.filter((p) => p.category === link.value) : [];
      const count =
        item.countMode === "auto" && link.type !== "section"
          ? liveCountLabel(linked.length, language)
          : item.countMode === "custom"
            ? item.count[language] || item.count.en
            : "";
      // Empty card name → the category's own (localized) name, or "All products"
      const fallbackName =
        link.type === "category" ? categoryName(link.value) : link.type === "all" ? (language === "ar" ? "كل المنتجات" : "All Products") : item.name.en;
      return {
        id: item.id,
        link,
        name: item.name[language] || fallbackName,
        image: resolveImage(item.image || linked.find((p) => p.image)?.image),
        count,
      };
    });

  if (!section.showSection || cards.length === 0) return null;

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {pick("eyebrow") && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              {pick("eyebrow")}
            </span>
          )}
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            {pick("title")}
          </h2>
          {pick("subtitle") && (
            <p className="mt-3 text-sm text-[#71717A] leading-relaxed">
              {pick("subtitle")}
            </p>
          )}
        </div>

        {/* Categories Grid Layout — one column per visible card on desktop */}
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(var(--cat-cols),minmax(0,1fr))]"
          style={{ "--cat-cols": cards.length } as React.CSSProperties}
        >
          {cards.map((category, idx) => (
            <div
              key={category.id}
              onClick={() => handleCardClick(category.link)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-[#F5F5F5] aspect-[3/4] border border-[#F5F5F5] transition-all duration-500 hover:shadow-xl ${
                idx === cards.length - 1 && cards.length % 2 === 1 ? "col-span-2 md:col-span-1" : "col-span-1"
              }`}
            >
              {/* Category Image */}
              <Image
                src={category.image}
                alt={`${category.name} collection`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                unoptimized={!isOptimizable(category.image)}
              />

              {/* Dark Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-[#111111]/10 to-transparent" />

              {/* Category details overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                {category.count && (
                  <span className="text-[9px] font-bold text-[#C9A227] tracking-wider uppercase">
                    {category.count}
                  </span>
                )}
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                  {category.name}
                </h3>

                {/* Arrow indicator */}
                {pick("explore") && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 group-hover:text-[#C9A227] transition-colors">
                    <span>{pick("explore")}</span>
                    <ArrowRight className={`h-3 w-3 transition-transform ${language === "ar" ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
