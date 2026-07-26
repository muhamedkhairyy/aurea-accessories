"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { X, Star, Check, ShoppingBag, Shield, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useShop();
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Set default variant when product changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedVariant(quickViewProduct.variants[0] || "Standard");
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedVariant);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 z-50 bg-[#111111]"
          />

          {/* Modal Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-[#111111] shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-[#111111] shadow-md border border-[#F5F5F5] transition-transform hover:scale-105"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Left Column: Image */}
              <div className="relative h-64 md:h-auto md:w-1/2 bg-[#F5F5F5] flex-shrink-0">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                  priority
                />
                {quickViewProduct.stock <= 8 && (
                  <span className="absolute left-4 top-4 rounded bg-[#EF4444] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Only {quickViewProduct.stock} Left in Stock
                  </span>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A227]">
                    {quickViewProduct.category}
                  </span>
                  
                  <h3 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#111111]">
                    {quickViewProduct.name}
                  </h3>

                  {/* Rating */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <div className="flex text-[#C9A227]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#111111]">{quickViewProduct.rating}</span>
                    <span className="text-xs text-[#71717A]">({quickViewProduct.reviewsCount} verified reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-[#111111]">${quickViewProduct.price.toFixed(2)}</span>
                    <span className="text-sm text-[#71717A] line-through">${quickViewProduct.oldPrice.toFixed(2)}</span>
                    <span className="rounded bg-[#C9A227]/10 px-2 py-0.5 text-xs font-bold text-[#C9A227]">
                      Save {Math.round(((quickViewProduct.oldPrice - quickViewProduct.price) / quickViewProduct.oldPrice) * 100)}%
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#71717A]">
                    {quickViewProduct.description}
                  </p>

                  {/* Variants */}
                  <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                      Select Style / Size
                    </label>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {quickViewProduct.variants.map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                            selectedVariant === v
                              ? "border-[#111111] bg-[#111111] text-white"
                              : "border-[#E4E4E7] bg-white text-[#111111] hover:border-[#111111]"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">Quantity</span>
                    <div className="flex items-center rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 text-[#71717A] hover:text-[#111111] transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 text-[#71717A] hover:text-[#111111] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="mt-8 space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 rounded-full bg-[#111111] text-white py-3.5 text-sm font-semibold hover:bg-[#C9A227] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Bag - ${(quickViewProduct.price * quantity).toFixed(2)}</span>
                    </button>
                    
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`rounded-full border p-3.5 transition-all ${
                        inWishlist
                          ? "border-[#EF4444] bg-[#EF4444]/5 text-[#EF4444]"
                          : "border-[#E4E4E7] bg-white text-[#71717A] hover:text-[#111111] hover:border-[#111111]"
                      }`}
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 text-[11px] text-[#71717A] pt-2 border-t border-[#F5F5F5]">
                    <div className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-[#C9A227]" />
                      <span>100% Waterproof</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-[#C9A227]" />
                      <span>Hypoallergenic</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-[#C9A227]" />
                      <span>Lifetime Shiny Gold</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
