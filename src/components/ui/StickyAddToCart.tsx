"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { ShoppingBag, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { discountPercent, isOptimizable } from "@/utils/catalog";

export default function StickyAddToCart() {
  const { products, addToCart } = useShop();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("");

  // First in-stock product in the live catalog (Aurelia Pendant Necklace by default)
  const flagshipProduct = products.find((p) => p.stock > 0);

  useEffect(() => {
    if (flagshipProduct) {
      setSelectedVariant(flagshipProduct.variants[0] || "Standard");
    }

    const handleScroll = () => {
      // Show after scrolling 500px down
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [flagshipProduct]);

  if (!flagshipProduct) return null;

  const handleQuickAdd = () => {
    addToCart(flagshipProduct, 1, selectedVariant);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-[#F5F5F5] px-4 py-3 shadow-[0_-8px_30px_rgb(17,17,17,0.06)] glassmorphism md:py-4"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            
            {/* Left side: Product Info (Hidden on very small screens) */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5] border border-[#F5F5F5] hidden sm:block">
                <Image
                  src={flagshipProduct.image}
                  alt={flagshipProduct.name}
                  fill
                  sizes="48px"
                  className="object-cover object-center"
                  unoptimized={!isOptimizable(flagshipProduct.image)}
                />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#111111] line-clamp-1">{flagshipProduct.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center text-[#C9A227]">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-bold ml-0.5">{flagshipProduct.rating}</span>
                  </div>
                  <span className="text-xs text-[#71717A]">({flagshipProduct.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex flex-1 items-center justify-end gap-3 sm:flex-initial">
              {/* Variant Selector */}
              {flagshipProduct.variants.length > 0 && (
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#111111] outline-none focus:border-[#C9A227] cursor-pointer"
              >
                {flagshipProduct.variants.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              )}

              {/* Price & CTA */}
              <div className="flex items-center gap-2">
                <div className="text-right mr-1 hidden xs:block">
                  <p className="text-sm font-bold text-[#111111]">${flagshipProduct.price.toFixed(2)}</p>
                  {discountPercent(flagshipProduct) > 0 && (
                    <p className="text-[10px] text-[#71717A] line-through">${flagshipProduct.oldPrice.toFixed(2)}</p>
                  )}
                </div>
                
                <button
                  onClick={handleQuickAdd}
                  className="rounded-full bg-[#111111] hover:bg-[#C9A227] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Zap className="h-3.5 w-3.5 fill-current text-[#C9A227] animate-pulse" />
                  <span>Claim Yours</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
