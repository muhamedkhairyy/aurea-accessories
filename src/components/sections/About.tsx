"use client";

import React from "react";
import { Sparkles, Shield, Heart } from "lucide-react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

export default function About() {
  const { language } = useShop();
  const t = translations[language];

  const handleScrollToShop = () => {
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
    <section id="about" className="py-16 bg-[#F8F5F2]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Image Frame */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border-4 border-white bg-white/40 shadow-xl lg:order-1 order-2">
            <Image
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600"
              alt="Aurèa Accessories narrative - Elegance and durability"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-7 space-y-6 lg:order-2 order-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              {t.about_tag}
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] leading-tight">
              {t.about_title_1} <br />
              <span className="text-[#C9A227] italic font-serif font-extrabold">{t.about_title_2}</span>
            </h2>

            <p className="text-sm text-[#71717A] leading-relaxed font-medium">
              {t.about_p1}
            </p>

            <p className="text-sm text-[#71717A] leading-relaxed font-medium">
              {t.about_p2}
            </p>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="space-y-1.5 p-4 rounded-xl bg-white border border-[#E4E4E7]/40 shadow-sm">
                <Sparkles className="h-5 w-5 text-[#C9A227]" />
                <h4 className="text-xs font-extrabold uppercase text-[#111111]">{t.about_val1_title}</h4>
                <p className="text-[11px] text-[#71717A]">{t.about_val1_desc}</p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-white border border-[#E4E4E7]/40 shadow-sm">
                <Shield className="h-5 w-5 text-[#C9A227]" />
                <h4 className="text-xs font-extrabold uppercase text-[#111111]">{t.about_val2_title}</h4>
                <p className="text-[11px] text-[#71717A]">{t.about_val2_desc}</p>
              </div>

              <div className="space-y-1.5 p-4 rounded-xl bg-white border border-[#E4E4E7]/40 shadow-sm">
                <Heart className="h-5 w-5 text-[#C9A227]" />
                <h4 className="text-xs font-extrabold uppercase text-[#111111]">{t.about_val3_title}</h4>
                <p className="text-[11px] text-[#71717A]">{t.about_val3_desc}</p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleScrollToShop}
                className="w-full sm:w-auto rounded-full bg-[#111111] hover:bg-[#C9A227] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                {t.about_btn}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
