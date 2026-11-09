"use client";

import React from "react";
import { Gem } from "lucide-react";
import type { MaterialPart } from "@/utils/materials";

// What a product is made of. "full" for the product page; "compact" for cart / checkout lines.
export default function ProductMaterials({
  materials,
  language,
  variant = "full",
}: {
  materials: MaterialPart[];
  language: "en" | "ar";
  variant?: "full" | "compact";
}) {
  if (materials.length === 0) return null;
  const l = language;

  if (variant === "compact") {
    return (
      <p className="mt-1 text-[11px] text-[#71717A]">
        {materials.map((m, i) => (
          <span key={m.part.en}>
            {i > 0 && " · "}
            {m.part[l]}: <span className="font-semibold text-[#111111]">{m.material[l]}</span>
          </span>
        ))}
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[#C9A227]/20 bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A]">
        <Gem className="h-4 w-4 text-[#C9A227]" />
        {l === "ar" ? "الخامات" : "Materials"}
      </p>
      <dl className="mt-3 space-y-3">
        {materials.map((m) => (
          <div key={m.part.en} className="flex items-start justify-between gap-4 text-sm">
            <dt className="text-[#71717A]">{m.part[l]}</dt>
            <dd className="text-end">
              <span className="font-semibold text-[#111111]">{m.material[l]}</span>
              <span className="block text-[11px] text-[#71717A]">{m.detail[l]}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
