"use client";

import React, { useState, useEffect } from "react";
import { Zap, Clock, ChevronRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromoBanner() {
  const { language } = useShop();
  const t = translations[language];
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 1, minutes: 45, seconds: 0 });

  useEffect(() => {
    // We want the countdown to persist across page refreshes using sessionStorage
    const TIMER_DURATION = 1 * 3600 * 1000 + 45 * 60 * 1000; // 1 hour 45 minutes
    const now = Date.now();
    let targetTime = sessionStorage.getItem("aurea_promo_target");

    if (!targetTime) {
      targetTime = (now + TIMER_DURATION).toString();
      sessionStorage.setItem("aurea_promo_target", targetTime);
    }

    const calculateTimeLeft = () => {
      const difference = parseInt(targetTime!) - Date.now();
      
      if (difference <= 0) {
        // Reset the timer when it hits 0 to keep the promo active (evergreen FOMO)
        const newTarget = Date.now() + TIMER_DURATION;
        sessionStorage.setItem("aurea_promo_target", newTarget.toString());
        return { hours: 1, minutes: 45, seconds: 0 };
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleScrollToShop = () => {
    const element = document.getElementById("bestsellers");
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Banner Frame */}
        <div className="relative overflow-hidden rounded-3xl bg-[#111111] text-[#F8F5F2] px-6 py-12 md:py-16 md:px-12 text-center md:text-left border border-[#C9A227]/30 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          
          {/* Decorative Background Circles */}
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 h-40 w-40 rounded-full bg-[#C9A227]/5 blur-2xl pointer-events-none" />

          {/* Left Block: Promo Text */}
          <div className="space-y-4 md:max-w-xl z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#C9A227]">
              <Zap className="h-3 w-3 fill-current animate-bounce" />
              <span>{t.promo_badge}</span>
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              {t.promo_title_1} <br className="xs:hidden" />
              <span className="text-[#C9A227] italic font-serif font-extrabold">{t.promo_title_2}</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
              {t.promo_desc}
            </p>
          </div>

          {/* Right Block: Timer and CTA */}
          <div className="flex flex-col items-center md:items-end gap-6 z-10">
            
            {/* Timer boxes */}
            <div className="space-y-2 text-center md:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center justify-center md:justify-end gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#C9A227]" />
                <span>{t.promo_expires}</span>
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                {/* Hours Box */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-lg font-bold font-mono">
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{t.promo_hr}</span>
                </div>
                <span className="text-lg font-bold text-[#C9A227] mb-4">:</span>
                
                {/* Minutes Box */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-lg font-bold font-mono">
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{t.promo_min}</span>
                </div>
                <span className="text-lg font-bold text-[#C9A227] mb-4">:</span>

                {/* Seconds Box */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-lg font-bold font-mono text-[#C9A227]">
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{t.promo_sec}</span>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleScrollToShop}
              className="w-full sm:w-auto rounded-full bg-[#C9A227] hover:bg-white text-white hover:text-[#111111] px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl cursor-pointer active:scale-95"
            >
              <span>{t.promo_btn}</span>
              <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
