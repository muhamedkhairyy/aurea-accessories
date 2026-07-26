"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface CategoryItem {
  name: "Necklaces" | "Rings" | "Bracelets" | "Earrings" | "Sets";
  image: string;
  itemsCount: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
    itemsCount: "12 Pieces"
  },
  {
    name: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
    itemsCount: "8 Pieces"
  },
  {
    name: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600",
    itemsCount: "6 Pieces"
  },
  {
    name: "Earrings",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600",
    itemsCount: "10 Pieces"
  },
  {
    name: "Sets",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600",
    itemsCount: "5 Curation Sets"
  }
];

export default function Categories() {
  const { setSelectedCategory } = useShop();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const element = document.getElementById("bestsellers");
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

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Curated Collections
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            Shop By Category
          </h2>
          <p className="mt-3 text-sm text-[#71717A] leading-relaxed">
            Discover waterproof, highly durable stainless steel jewelry pieces plated with genuine 18K gold.
          </p>
        </div>

        {/* Categories Grid Layout */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((category, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(category.name)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-[#F5F5F5] aspect-[3/4] border border-[#F5F5F5] transition-all duration-500 hover:shadow-xl ${
                idx === 4 ? "col-span-2 md:col-span-1" : "col-span-1"
              }`}
            >
              {/* Category Image */}
              <Image
                src={category.image}
                alt={`${category.name} collection`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-[#111111]/10 to-transparent" />
              
              {/* Category details overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                <span className="text-[9px] font-bold text-[#C9A227] tracking-wider uppercase">
                  {category.itemsCount}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                  {category.name}
                </h3>
                
                {/* Arrow indicator */}
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 group-hover:text-[#C9A227] transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
