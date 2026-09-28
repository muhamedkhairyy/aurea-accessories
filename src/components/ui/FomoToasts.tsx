"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { isOptimizable } from "@/utils/catalog";

interface PurchaseNotification {
  name: string;
  city: string;
  productName: string;
  productImage: string;
  timeAgo: string;
}

const CUSTOMER_NAMES = ["Sarah", "Emily", "Chloe", "Emma", "Olivia", "Sophia", "Isabella", "Mia", "Amelia", "Charlotte"];
const CITIES = ["Miami", "New York", "Los Angeles", "Chicago", "Dallas", "Atlanta", "Seattle", "Boston", "Denver", "Phoenix"];
const TIMES = ["Just now", "45s ago", "1m ago", "2m ago", "3m ago"];

export default function FomoToasts() {
  const { products } = useShop();
  const [activeToast, setActiveToast] = useState<PurchaseNotification | null>(null);

  useEffect(() => {
    if (products.length === 0) return;

    const showRandomToast = () => {
      // Pick random customer details
      const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomTime = TIMES[Math.floor(Math.random() * TIMES.length)];
      
      // Pick random product
      const randomProduct = products[Math.floor(Math.random() * products.length)];

      setActiveToast({
        name: randomName,
        city: randomCity,
        productName: randomProduct.name,
        productImage: randomProduct.image,
        timeAgo: randomTime,
      });

      // Hide toast after 6 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 6000);
    };

    // Initial delay of 5 seconds, then repeat every 18 seconds
    const initialTimeout = setTimeout(() => {
      showRandomToast();
    }, 5000);

    const interval = setInterval(() => {
      showRandomToast();
    }, 18000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [products]);

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-[calc(100vw-32px)] sm:bottom-6 sm:left-6 sm:max-w-xs">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-[#111111] shadow-2xl glassmorphism border border-[#C9A227]/10"
          >
            {/* Product Thumbnail */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5]">
              <Image
                src={activeToast.productImage}
                alt={activeToast.productName}
                fill
                sizes="48px"
                className="object-cover object-center"
                unoptimized={!isOptimizable(activeToast.productImage)}
              />
            </div>

            {/* Notification content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#71717A]">
                <span className="text-[#111111] font-bold">{activeToast.name}</span> from {activeToast.city}
                <CheckCircle className="h-3 w-3 fill-[#C9A227]/15 text-[#C9A227]" />
              </div>
              <p className="mt-0.5 text-xs text-[#111111] font-medium truncate">
                Purchased <span className="font-semibold">{activeToast.productName}</span>
              </p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-[#C9A227] font-semibold">
                <ShoppingBag className="h-2.5 w-2.5" />
                <span>{activeToast.timeAgo}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
