"use client";

import React, { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import Logo from "@/components/ui/Logo";
import { ShoppingBag, Heart, Search, Menu, X, Check, ArrowRight, Globe } from "lucide-react";
import { translations } from "@/utils/translations";

export default function Header() {
  const {
    cartCount,
    setCartOpen,
    wishlist,
    setWishlistOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    language,
    setLanguage,
  } = useShop();

  const t = translations[language];

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
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
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-[#111111] text-[#F8F5F2] py-2 px-4 text-center text-xs font-semibold tracking-wider flex items-center justify-center gap-4 overflow-hidden border-b border-[#C9A227]/20 z-50 relative">
        <div className="flex items-center gap-1.5 animate-pulse text-[#C9A227]">
          <Check className="h-3.5 w-3.5" />
          <span>{language === 'ar' ? 'الدفع عند الاستلام متاح' : 'Cash on Delivery Active'}</span>
        </div>
        <span className="h-3 w-px bg-white/20 hidden xs:inline" />
        <span className="hidden xs:inline">{t.announcement_desktop}</span>
        <span className="inline xs:hidden text-[10px]">{t.announcement_mobile}</span>
      </div>

      {/* Main Header Row */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 shadow-md border-b border-[#F5F5F5] py-2"
            : "bg-[#F8F5F2]/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-4 md:px-8">
          
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] md:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo Brand Block */}
          <div
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="cursor-pointer transition-transform hover:scale-[1.01] flex items-center"
          >
            <Logo className="h-12 sm:h-16 w-auto" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-[#111111]">
            <button
              onClick={() => scrollToSection("bestsellers")}
              className="hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {t.nav_bestsellers}
            </button>
            <button
              onClick={() => scrollToSection("why-us")}
              className="hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {t.nav_why_us}
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {t.nav_reviews}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {t.nav_faq}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#C9A227] transition-colors cursor-pointer"
            >
              {t.nav_about}
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1 font-bold text-xs"
              aria-label="Toggle Language"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Search Toggle Icon */}
            <div className="relative flex items-center">
              {searchOpen && (
                <input
                  type="text"
                  placeholder={t.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="absolute right-9 bg-white border border-[#E4E4E7] rounded-full px-3 py-1 text-xs outline-none focus:border-[#C9A227] w-36 xs:w-44 transition-all"
                  autoFocus
                />
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] transition-colors"
                aria-label="Search"
              >
                {searchOpen && searchQuery ? (
                  <X
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                  />
                ) : (
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${wishlist.length > 0 ? "fill-[#EF4444] text-[#EF4444]" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] transition-colors"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#C9A227]" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Slide Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#111111]/45 backdrop-blur-sm"
          />

          {/* Drawer menu panel */}
          <div className="relative flex w-4/5 max-w-xs flex-col bg-[#F8F5F2] text-[#111111] p-6 shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#111111] hover:bg-[#F5F5F5] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8">
              <Logo className="h-10 w-auto" />
            </div>

            <nav className="flex flex-col gap-6 text-base font-bold uppercase tracking-wider">
              <button
                onClick={() => scrollToSection("bestsellers")}
                className="flex items-center justify-between text-left hover:text-[#C9A227] border-b border-[#E4E4E7] pb-2 transition-colors cursor-pointer"
              >
                <span>{t.nav_bestsellers}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection("why-us")}
                className="flex items-center justify-between text-left hover:text-[#C9A227] border-b border-[#E4E4E7] pb-2 transition-colors cursor-pointer"
              >
                <span>{t.nav_why_us}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="flex items-center justify-between text-left hover:text-[#C9A227] border-b border-[#E4E4E7] pb-2 transition-colors cursor-pointer"
              >
                <span>{t.nav_reviews}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="flex items-center justify-between text-left hover:text-[#C9A227] border-b border-[#E4E4E7] pb-2 transition-colors cursor-pointer"
              >
                <span>{t.nav_faq}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="flex items-center justify-between text-left hover:text-[#C9A227] border-b border-[#E4E4E7] pb-2 transition-colors cursor-pointer"
              >
                <span>{t.nav_about}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </nav>

            <div className="mt-auto space-y-4">
              <div className="rounded-xl bg-white p-4 border border-[#C9A227]/15 text-center">
                <p className="text-xs text-[#71717A] font-semibold">{t.help_chat}</p>
                <p className="text-sm font-bold text-[#111111] mt-1">@AureaAccessories</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
