"use client";

import React, { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { language } = useShop();
  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API registration
    setTimeout(() => {
      if (email.includes("@")) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <section className="py-16 bg-[#111111] text-white relative overflow-hidden border-t border-[#C9A227]/10">
      {/* Visual background details */}
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#C9A227]/5 blur-2xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-52 w-52 rounded-full bg-[#C9A227]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 text-center z-10 relative space-y-6">
        
        {/* Mail Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227]">
          <Mail className="h-5 w-5" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            {t.newsletter_tag}
          </span>
          
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {t.newsletter_title}
          </h2>
          
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            {t.newsletter_subtitle}
          </p>
        </div>

        {/* Subscription Input Form */}
        <div className="max-w-md mx-auto">
          {status === "success" ? (
            <div className="rounded-2xl bg-white/5 border border-[#C9A227]/20 p-4 text-xs text-[#C9A227] font-semibold flex items-center justify-center gap-2 animate-pulse">
              <Check className="h-4 w-4 rounded-full bg-[#C9A227]/10 p-0.5" />
              <span>{t.newsletter_success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={t.newsletter_placeholder}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3.5 pl-11 text-sm text-white placeholder-white/40 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  disabled={status === "loading"}
                />
                <Mail className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-4.5 h-4.5 w-4.5 text-white/30`} />
              </div>
              
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-full bg-white text-[#111111] hover:bg-[#C9A227] hover:text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "loading" ? t.newsletter_subscribing : t.newsletter_btn}
              </button>
            </form>
          )}

          {status === "error" && (
            <div className="mt-2.5 flex items-center gap-1.5 justify-center text-xs text-[#EF4444] font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>{t.newsletter_error}</span>
            </div>
          )}

          <p className="mt-4 text-[10px] text-white/40">
            {t.newsletter_disclaimer}
          </p>
        </div>

      </div>
    </section>
  );
}
