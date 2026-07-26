"use client";

import React from "react";
import Logo from "@/components/ui/Logo";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

export default function Footer() {
  const { language } = useShop();
  const t = translations[language];
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
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

  return (
    <footer className="bg-[#111111] text-white border-t border-[#C9A227]/20 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="cursor-pointer inline-block" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Logo className="h-16 w-auto" light={true} />
          </div>
          <p className="text-xs text-white/70 leading-relaxed max-w-xs">
            {t.footer_tagline}
          </p>
          <div className="flex gap-4 pt-2">
            {/* TikTok Icon Custom */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/5 p-2.5 hover:bg-[#C9A227] hover:text-white transition-all text-white/80"
              aria-label="Follow us on TikTok"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.05 1.13 2.5 1.83 4.02 1.93v3.87c-1.48-.07-2.91-.62-4.06-1.57-.27-.22-.52-.47-.75-.73v6.78c.07 1.85-.48 3.73-1.56 5.22-1.39 1.95-3.8 3.19-6.22 3.28-2.67.16-5.41-1.01-6.95-3.21-1.74-2.35-1.92-5.71-.43-8.24 1.34-2.34 3.96-3.83 6.66-3.85v3.89c-1.42.02-2.85.74-3.6 1.96-.86 1.31-.83 3.13.08 4.38.86 1.25 2.45 1.89 3.92 1.57 1.39-.27 2.51-1.5 2.69-2.92.05-1.25.02-2.5.03-3.75V0z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/5 p-2.5 hover:bg-[#C9A227] hover:text-white transition-all text-white/80"
              aria-label="Follow us on Instagram"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/5 p-2.5 hover:bg-[#C9A227] hover:text-white transition-all text-white/80"
              aria-label="Follow us on Facebook"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.2-1.2 1-1.2h3V2h-4.2C10.5 2 9 3.5 9 5.8V8z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C9A227]">
            {t.footer_quick_links_title}
          </h3>
          <ul className="space-y-2 text-xs text-white/70">
            <li>
              <button onClick={() => scrollToSection("bestsellers")} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                {t.nav_bestsellers}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("collections")} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                {t.footer_explore_collections}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("why-us")} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                {t.nav_why_us}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection("about")} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                {t.footer_brand_narrative}
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C9A227]">
            {t.footer_help}
          </h3>
          <ul className="space-y-2 text-xs text-white/70">
            <li>
              <button onClick={() => scrollToSection("faq")} className="hover:text-[#C9A227] transition-colors cursor-pointer">
                {t.footer_faq}
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A227] transition-colors">
                {t.footer_shipping}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A227] transition-colors">
                {t.footer_refund}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C9A227] transition-colors">
                {t.footer_lifetime_guarantee}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info & trust */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C9A227]">
            {t.footer_contact}
          </h3>
          <ul className="space-y-3 text-xs text-white/70">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#C9A227]" />
              <span>support@aurea-accessories.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#C9A227]" />
              <span>+1 (800) 555-GOLD (Mock Support)</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C9A227]" />
              <span>Beverly Hills, California, USA</span>
            </li>
          </ul>
          
          <div className="bg-white/5 border border-[#C9A227]/10 p-3 rounded-lg flex items-center gap-2 max-w-[240px]">
            <ShieldCheck className="h-5 w-5 text-[#C9A227] flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">{t.footer_secure_checkout}</p>
              <p className="text-[9px] text-white/50">{t.footer_secure_desc}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Bottom Banner */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Copy */}
        <p className="text-[11px] text-white/50 text-center sm:text-left">
          {t.footer_rights}
        </p>

        {/* Payment Methods Grid */}
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span className="text-[9px] uppercase tracking-wider text-white/50 mr-1.5">{t.footer_payments}</span>
          {/* Visa Card Logo shape SVG */}
          <span className="text-[9px] font-bold tracking-widest text-[#C9A227] border border-[#C9A227]/30 px-1.5 py-0.5 rounded">VISA</span>
          <span className="text-[9px] font-bold tracking-widest text-white/70 border border-white/20 px-1.5 py-0.5 rounded">MC</span>
          <span className="text-[9px] font-bold tracking-widest text-[#C9A227] border border-[#C9A227]/30 px-1.5 py-0.5 rounded">APPLE PAY</span>
          <span className="text-[9px] font-bold tracking-widest text-white/70 border border-white/20 px-1.5 py-0.5 rounded">CASH</span>
        </div>

        {/* Made with Love by Antigravity */}
        <p className="text-[10px] text-white/40 flex items-center gap-1">
          {t.footer_designed_with} <Heart className="h-3 w-3 text-[#C9A227] fill-[#C9A227]" /> {t.footer_premium_sales}
        </p>
      </div>
    </footer>
  );
}
