"use client";

import React from "react";
import type { ProductColor } from "@/context/ShopContext";

// Color circles for a product; the picked one gets a ring. Used on product cards, Quick View and the sticky bar.
export default function ColorSwatches({
  colors,
  selected,
  onSelect,
  size = "md",
  label = "Color",
}: {
  colors: ProductColor[];
  selected: string;
  onSelect: (name: string) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  if (colors.length === 0) return null;
  const dot = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap items-center ${size === "sm" ? "gap-1.5" : "gap-2.5"}`}>
      {colors.map((c) => {
        const active = c.name === selected;
        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={c.name}
            title={c.name}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(c.name);
            }}
            className={`${dot} flex-shrink-0 rounded-full border border-black/15 cursor-pointer transition-all ${
              active ? "ring-2 ring-[#111111] ring-offset-2" : "hover:ring-2 hover:ring-[#C9A227]/60 hover:ring-offset-1"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        );
      })}
    </div>
  );
}
