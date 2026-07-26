"use client";

import React, { useRef } from "react";
import { Star, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

interface ReviewItem {
  name: string;
  location: string;
  rating: number;
  productName: string;
  content: string;
  avatar: string;
}

export default function SocialProof() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { language } = useShop();
  const t = translations[language];

  const REVIEWS: ReviewItem[] = [
    {
      name: t.review_1_name,
      location: t.review_1_loc,
      rating: 5,
      productName: "Aurelia Pendant Necklace",
      content: t.review_1_text,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120"
    },
    {
      name: t.review_2_name,
      location: t.review_2_loc,
      rating: 5,
      productName: "Celeste Spinner Ring",
      content: t.review_2_text,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120"
    },
    {
      name: t.review_3_name,
      location: t.review_3_loc,
      rating: 5,
      productName: "Elysian Layered Set",
      content: t.review_3_text,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120"
    },
    {
      name: t.review_4_name,
      location: t.review_4_loc,
      rating: 5,
      productName: "Solene Herringbone Bracelet",
      content: t.review_4_text,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120"
    },
    {
      name: t.review_5_name,
      location: t.review_5_loc,
      rating: 5,
      productName: "Maia Droplet Earrings",
      content: t.review_5_text,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=120"
    }
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="reviews" className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Block with Stars */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              {t.social_tag}
            </span>
            
            {/* Average Rating stats */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-lg font-black text-[#111111] leading-none">4.9/5</span>
            </div>
            
            <h2 className="mt-2.5 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
              {t.social_title}
            </h2>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll(language === 'ar' ? "right" : "left")}
              className="rounded-full border border-[#E4E4E7] p-3 text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll reviews left"
            >
              <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => scroll(language === 'ar' ? "left" : "right")}
              className="rounded-full border border-[#E4E4E7] p-3 text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll reviews right"
            >
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scrollable container of review cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
        >
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="w-[300px] xs:w-[340px] flex-shrink-0 bg-[#F8F5F2] border border-[#E4E4E7]/60 p-6 rounded-2xl luxury-shadow snap-start flex flex-col justify-between"
            >
              <div>
                {/* Stars and verified details */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#C9A227]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#C9A227] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 fill-[#C9A227]/10" />
                    <span>{t.social_verified}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-[#71717A] leading-relaxed italic">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              {/* User Identity row */}
              <div className="mt-6 flex items-center gap-3 border-t border-[#E4E4E7]/40 pt-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#C9A227]/20">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{review.name}</h4>
                  <p className="text-[10px] text-[#71717A]">{review.location}</p>
                  <p className="text-[9px] text-[#C9A227] font-semibold mt-0.5">{t.social_purchased}: {review.productName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
