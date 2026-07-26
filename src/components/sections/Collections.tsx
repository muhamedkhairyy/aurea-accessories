"use client";

import React, { useRef } from "react";
import { useShop } from "@/context/ShopContext";
import { ArrowLeft, ArrowRight, ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import { translations } from "@/utils/translations";

interface CollectionCard {
  title: string;
  subtitle: string;
  image: string;
  categoryFilter: string;
  searchFilter: string;
}

export default function Collections() {
  const { setSelectedCategory, setSearchQuery, language } = useShop();
  const trackRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const COLLECTIONS: CollectionCard[] = [
    {
      title: t.col_1_title,
      subtitle: t.col_1_desc,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
      categoryFilter: "All",
      searchFilter: ""
    },
    {
      title: t.col_2_title,
      subtitle: t.col_2_desc,
      image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600",
      categoryFilter: "All",
      searchFilter: "Gold"
    },
    {
      title: t.col_3_title,
      subtitle: t.col_3_desc,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
      categoryFilter: "All",
      searchFilter: "Silver"
    },
    {
      title: t.col_4_title,
      subtitle: t.col_4_desc,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600",
      categoryFilter: "Sets",
      searchFilter: ""
    },
    {
      title: t.col_5_title,
      subtitle: t.col_5_desc,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600",
      categoryFilter: "Necklaces",
      searchFilter: ""
    }
  ];

  const handleCollectionSelect = (col: CollectionCard) => {
    setSelectedCategory(col.categoryFilter);
    setSearchQuery(col.searchFilter);
    
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

  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      const { scrollLeft, clientWidth } = trackRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.5 : scrollLeft + clientWidth * 0.5;
      trackRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="collections" className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              {t.collections_tag}
            </span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
              {t.collections_title}
            </h2>
            <p className="mt-3 text-sm text-[#71717A] max-w-md">
              {t.collections_subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll(language === 'ar' ? "right" : "left")}
              className="rounded-full border border-[#E4E4E7] p-2.5 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => scroll(language === 'ar' ? "left" : "right")}
              className="rounded-full border border-[#E4E4E7] p-2.5 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable Collections Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {COLLECTIONS.map((col, idx) => (
            <div
              key={idx}
              onClick={() => handleCollectionSelect(col)}
              className="group relative w-[280px] sm:w-[350px] aspect-[4/5] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-[#E4E4E7]/40 luxury-shadow snap-start"
            >
              {/* Image */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 768px) 280px, 350px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Text overlays */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                  {col.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed max-w-[280px]">
                  {col.subtitle}
                </p>
                
                <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A227] group-hover:text-white transition-colors">
                  <span>{t.collections_explore}</span>
                  <ArrowRightCircle className={`h-4 w-4 transition-transform ${language === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
