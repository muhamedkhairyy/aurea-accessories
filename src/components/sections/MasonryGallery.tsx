"use client";

import React from "react";
import Image from "next/image";

interface GalleryItem {
  image: string;
  handle: string;
  source: "TikTok" | "Instagram";
  aspect: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600",
    handle: "@sarah_fit",
    source: "Instagram",
    aspect: "aspect-[3/4]"
  },
  {
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=600",
    handle: "@chloe.styles",
    source: "TikTok",
    aspect: "aspect-square"
  },
  {
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600",
    handle: "@aurea_emma",
    source: "Instagram",
    aspect: "aspect-[3/4]"
  },
  {
    image: "https://images.unsplash.com/photo-1588444839799-eb642997409f?q=80&w=600",
    handle: "@olivia_vibe",
    source: "TikTok",
    aspect: "aspect-[4/5]"
  },
  {
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    handle: "@amelia_jewels",
    source: "Instagram",
    aspect: "aspect-square"
  },
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600",
    handle: "@aurea_girls",
    source: "TikTok",
    aspect: "aspect-[3/4]"
  }
];

export default function MasonryGallery() {
  return (
    <section id="gallery" className="py-16 bg-[#F8F5F2]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Social Feed
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            Styled By You
          </h2>
          <p className="mt-3 text-sm text-[#71717A] leading-relaxed">
            Tag us <strong className="text-[#111111]">@AureaAccessories</strong> on TikTok or Instagram to be featured!
          </p>
        </div>

        {/* Masonry Columns Grid */}
        <div className="columns-2 gap-4 md:columns-3 lg:columns-3 space-y-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`break-inside-avoid relative overflow-hidden rounded-2xl group bg-[#F5F5F5] border border-[#E4E4E7]/40 mb-4 cursor-pointer`}
            >
              {/* Product styling image */}
              <div className={`${item.aspect} relative w-full`}>
                <Image
                  src={item.image}
                  alt={`Customer styled review ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Hover styling Overlay */}
              <div className="absolute inset-0 bg-[#111111]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white w-full flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide">{item.handle}</span>
                  
                  {/* Icon depending on social channel */}
                  <span className="rounded-full bg-white/20 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                    {item.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
