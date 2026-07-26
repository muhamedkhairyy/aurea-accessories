"use client";

import React from "react";
import { Droplets, Sparkles, UserCheck, Flame, Gift, CreditCard } from "lucide-react";

interface BenefitCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BENEFITS: BenefitCard[] = [
  {
    title: "100% Waterproof",
    description: "Wear it in the shower, swimming pool, or during workouts. Our accessories will never rust, corrode, or lose their shine.",
    icon: Droplets
  },
  {
    title: "Lifetime Shine",
    description: "Vacuum-plated in 18K gold using physical vapor deposition (PVD). Ten times thicker than standard jewelry plating.",
    icon: Sparkles
  },
  {
    title: "Skin Friendly",
    description: "Made with 316L medical-grade stainless steel. Zero nickel, zero lead, and completely hypoallergenic for sensitive skin.",
    icon: UserCheck
  },
  {
    title: "Doesn't Rust or Green",
    description: "Unlike brass or copper, stainless steel won't react with moisture or sweat, meaning your skin will never turn green.",
    icon: Flame
  },
  {
    title: "Premium Gift Packaging",
    description: "Every item arrives in an exquisite signature leather-texture pouch and embossed gold-foiled luxury gift box.",
    icon: Gift
  },
  {
    title: "Cash On Delivery (COD)",
    description: "Zero risk. Place your order in seconds and pay cash at your doorstep when you receive and inspect your package.",
    icon: CreditCard
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-16 bg-[#F8F5F2]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            The Aurèa Standard
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            Why Choose Our Jewelry?
          </h2>
          <p className="mt-3 text-sm text-[#71717A] leading-relaxed">
            We bridge the gap between expensive gold jewelry and low-quality alloys. Designed for style, built for life.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl bg-white p-6 border border-[#E4E4E7] luxury-shadow luxury-shadow-hover"
              >
                {/* Icon Container */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#C9A227] transition-all group-hover:bg-[#C9A227] group-hover:text-white mb-5">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-serif text-lg font-bold text-[#111111]">
                  {benefit.title}
                </h3>
                
                <p className="mt-2.5 text-xs sm:text-sm text-[#71717A] leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
