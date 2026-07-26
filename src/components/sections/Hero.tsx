"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Droplets, ShieldCheck, Zap, Truck, CreditCard } from "lucide-react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

export default function Hero() {
  const { language } = useShop();
  const t = translations[language];
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
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
    <section className="relative overflow-hidden bg-[#F8F5F2] pt-6 pb-16 md:pb-24">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-0 h-64 w-64 rounded-full bg-[#C9A227]/5 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#C9A227]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Premium Headline & copy */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left z-10">
            
            {/* Promo Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A227]/10 px-4 py-1.5 text-xs font-bold text-[#C9A227] uppercase tracking-wider mx-auto lg:mx-0"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>{t.hero_promo_badge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#111111]"
            >
              {t.hero_headline_1} <br className="hidden sm:inline" />
              <span className="text-[#C9A227] font-serif font-extrabold italic">{t.hero_headline_2}</span>
            </motion.h1>

            {/* Subtitle list of waterproof/hypoallergenic benefits */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#71717A] max-w-xl mx-auto lg:mx-0 font-medium"
            >
              {t.hero_subtitle}
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleScrollToSection("bestsellers")}
                className="w-full sm:w-auto rounded-full bg-[#111111] hover:bg-[#C9A227] text-white px-8 py-4 text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl cursor-pointer"
              >
                <span>{t.hero_cta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => handleScrollToSection("collections")}
                className="w-full sm:w-auto rounded-full border-2 border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] px-8 py-3.5 text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.hero_secondary_cta}</span>
              </button>
            </motion.div>

            {/* Trust highlights under CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-2 text-xs text-[#71717A] font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-[#C9A227]" />
                <span>{t.hero_trust_shipping}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-[#C9A227]" />
                <span>{t.hero_trust_cod}</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Lifestyle Image Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white/40"
          >
            <Image
              src="https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=1200"
              alt="Luxury lifestyle - Woman styling stainless steel gold necklaces and rings"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-10000 hover:scale-105"
              priority
            />
            {/* Scarcity badge in the image corner */}
            <div className="absolute right-4 top-4 bg-[#111111]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-[#C9A227] fill-current animate-pulse" />
              <span>{t.hero_stock_badge}</span>
            </div>
            
            {/* Floating review count bubble */}
            <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-md text-[#111111] p-3 rounded-xl border border-[#C9A227]/20 flex items-center gap-3 shadow-lg">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100"
                ].map((src, i) => (
                  <div key={i} className="relative h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                    <Image src={src} alt="avatar" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left text-xs font-semibold leading-tight">
                <p className="font-bold text-[#111111]">{t.hero_customers_count}</p>
                <div className="flex text-[#C9A227] mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="text-[10px] text-[#71717A] ml-1.5 font-bold">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Hero Bottom Trust Badges Bar */}
        <div className="mt-16 md:mt-24 border-t border-b border-[#E4E4E7] py-6 grid grid-cols-2 gap-y-4 sm:grid-cols-4 md:grid-cols-7 text-center">
          {[
            { label: t.hero_badge_1_label, sub: t.hero_badge_1_sub, icon: Droplets },
            { label: t.hero_badge_2_label, sub: t.hero_badge_2_sub, icon: Sparkles },
            { label: t.hero_badge_3_label, sub: t.hero_badge_3_sub, icon: ShieldCheck },
            { label: t.hero_badge_4_label, sub: t.hero_badge_4_sub, icon: ShieldCheck },
            { label: t.hero_badge_5_label, sub: t.hero_badge_5_sub, icon: Sparkles },
            { label: t.hero_badge_6_label, sub: t.hero_badge_6_sub, icon: Truck },
            { label: t.hero_badge_7_label, sub: t.hero_badge_7_sub, icon: CreditCard }
          ].map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227] mb-1.5">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-[#111111]">{badge.label}</p>
                <p className="text-[9px] text-[#71717A] mt-0.5">{badge.sub}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
