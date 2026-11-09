"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { colorImage, isOptimizable } from "@/utils/catalog";

const TOAST_MS = 4000;

// Small confirmation after "Add to bag", with a shortcut to the cart page
export default function AddedToBagToast() {
  const { lastAdded, dismissLastAdded, cartCount, language } = useShop();
  const pathname = usePathname();
  const ar = language === "ar";

  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(dismissLastAdded, TOAST_MS);
    return () => clearTimeout(timer);
  }, [lastAdded, dismissLastAdded]);

  // Already looking at the bag — no need to point at it
  const show = lastAdded && pathname !== "/cart";
  const image = lastAdded ? colorImage(lastAdded.product, lastAdded.color) : "";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={lastAdded.at}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "tween", duration: 0.25 }}
          role="status"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-3 text-[#111111] shadow-2xl sm:left-auto sm:right-6 sm:bottom-6"
        >
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5]">
            <Image src={image} alt={lastAdded.product.name} fill sizes="56px" className="object-cover" unoptimized={!isOptimizable(image)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#C9A227]">
              <Check className="h-3.5 w-3.5" />
              {ar ? "تمت الإضافة للسلة" : "Added to bag"}
            </p>
            <p className="truncate font-serif text-sm font-semibold">{lastAdded.product.name}</p>
          </div>
          <Link
            href="/cart"
            onClick={dismissLastAdded}
            className="flex-shrink-0 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C9A227]"
          >
            {ar ? `السلة (${cartCount})` : `View bag (${cartCount})`}
          </Link>
          <button onClick={dismissLastAdded} className="rounded-full p-1 text-[#71717A] hover:text-[#111111]" aria-label={ar ? "إغلاق" : "Dismiss"}>
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
