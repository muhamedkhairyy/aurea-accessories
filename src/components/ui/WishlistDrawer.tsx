"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function WishlistDrawer() {
  const {
    products,
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id); // Remove from wishlist on add
  };

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 z-50 bg-[#111111]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full flex-col bg-white text-[#111111] shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F5F5F5] px-6 py-5">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-[#EF4444] text-[#EF4444]" />
                <h2 className="font-serif text-xl font-semibold tracking-tight">Your Wishlist ({wishlistProducts.length})</h2>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-[#F5F5F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {wishlistProducts.length === 0 ? (
                /* Empty Wishlist */
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-[#F5F5F5] p-6 text-[#71717A]">
                    <Heart className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-medium text-[#111111]">Your wishlist is empty</h3>
                  <p className="mt-2 text-xs text-[#71717A] max-w-[240px]">
                    Tap the heart icon on any jewelry piece to save it to your wishlist.
                  </p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="mt-6 rounded-full bg-[#111111] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#C9A227] transition-colors shadow-md"
                  >
                    Browse Pieces
                  </button>
                </div>
              ) : (
                /* Wishlist Items List */
                <div className="divide-y divide-[#F5F5F5]">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      {/* Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5] border border-[#F5F5F5]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-sm font-semibold">
                            <h4 className="font-serif text-[#111111] line-clamp-1">{product.name}</h4>
                            <span className="text-[#111111] ml-2">${product.price.toFixed(2)}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-[#71717A]">{product.category}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between text-xs mt-3">
                          {/* Move to Cart */}
                          <button
                            onClick={() => handleMoveToCart(product)}
                            className="rounded-full bg-[#111111] hover:bg-[#C9A227] text-white px-4 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Add to Bag</span>
                          </button>

                          {/* Delete from wishlist */}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-[#71717A] hover:text-[#EF4444] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlistProducts.length > 0 && (
              <div className="border-t border-[#F5F5F5] bg-white px-6 py-5">
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="w-full rounded-full border border-[#111111] py-3 text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
