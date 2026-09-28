"use client";

import React from "react";
import { useShop, Product } from "@/context/ShopContext";
import { Star, Heart, Eye, ShoppingBag, SlidersHorizontal, Search, RefreshCw } from "lucide-react";
import Image from "next/image";
import { translations } from "@/utils/translations";
import { discountPercent, isOptimizable } from "@/utils/catalog";

export default function BestSellers() {
  const {
    products,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    addToCart,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    language,
    categories,
    categoryName,
  } = useShop();

  const t = translations[language];

  // Category filter tabs come from the dashboard's category list
  const CATEGORIES = ["All", ...categories.map((c) => c.key)];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const searchMatch =
        searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low-high") return a.price - b.price;
      if (sortBy === "price-high-low") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // Default Featured sorting (original array order)
    });

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section id="bestsellers" className="py-16 bg-[#F8F5F2]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            {language === 'ar' ? 'تشكيلة مصممة يدوياً' : 'Hand-Crafted Collection'}
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            {t.best_sellers_title}
          </h2>
          <p className="mt-3 text-sm text-[#71717A] leading-relaxed">
            {t.best_sellers_subtitle}
          </p>
        </div>

        {/* Filter & Sort Controls Row */}
        <div className="mb-8 flex flex-col gap-4 border-b border-[#E4E4E7] pb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-white shadow-md"
                    : "bg-white text-[#71717A] border border-[#E4E4E7] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {cat === "All" ? (language === 'ar' ? 'الكل' : 'All') : categoryName(cat)}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-[#71717A]" />
            <span className="text-xs font-semibold text-[#71717A]">{language === 'ar' ? 'ترتيب حسب:' : 'Sort By:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#E4E4E7] bg-white px-4 py-2 text-xs font-bold text-[#111111] outline-none focus:border-[#C9A227] cursor-pointer"
            >
              <option value="featured">{language === 'ar' ? 'الأكثر تميزاً' : 'Featured Pieces'}</option>
              <option value="price-low-high">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-high-low">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'ar' ? 'الأعلى تقييماً (★ 5.0)' : 'Top Rated (★ 5.0)'}</option>
            </select>
          </div>
        </div>

        {/* Search status summary if filters are active */}
        {(selectedCategory !== "All" || searchQuery) && (
          <div className="mb-6 flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E4E4E7] text-xs text-[#71717A]">
            <div className="flex items-center gap-1.5 font-medium">
              <Search className="h-3.5 w-3.5" />
              <span>
                {language === 'ar' ? 'عرض' : 'Showing'} <strong className="text-[#111111]">{filteredProducts.length}</strong> {language === 'ar' ? 'منتجات' : 'items'}
                {selectedCategory !== "All" && <> {language === 'ar' ? 'في فئة' : 'in category'} <strong className="text-[#111111]">{categoryName(selectedCategory)}</strong></>}
                {searchQuery && <> {language === 'ar' ? 'مطابقة لـ' : 'matching'} &quot;<strong className="text-[#111111]">{searchQuery}</strong>&quot;</>}
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 font-bold text-[#C9A227] hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}</span>
            </button>
          </div>
        )}

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          /* Empty Search Results */
          <div className="rounded-2xl border border-dashed border-[#E4E4E7] bg-white p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-[#71717A]" />
            <h3 className="mt-4 font-serif text-lg font-bold text-[#111111]">{language === 'ar' ? 'لم يتم العثور على قطع مجوهرات' : 'No jewelry pieces found'}</h3>
            <p className="mt-2 text-xs text-[#71717A] max-w-sm mx-auto">
              {language === 'ar' ? 'لم نتمكن من العثور على أي عناصر تطابق الفلاتر الخاصة بك. حاول التحقق من الإملاء أو مسح الفلاتر لتصفح المجموعة بأكملها.' : 'We couldn\'t find any items matching your filters. Try checking your spelling or clearing filters to browse the entire collection.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 rounded-full bg-[#111111] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#C9A227] transition-colors shadow-md"
            >
              {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = wishlist.includes(product.id);
              const discount = discountPercent(product);
              const soldOut = product.stock <= 0;
              const soldOutLabel = language === 'ar' ? 'نفدت الكمية' : 'Sold Out';

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E4E4E7] luxury-shadow luxury-shadow-hover"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={`object-cover object-center transition-transform duration-700 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`}
                      loading="lazy"
                      unoptimized={!isOptimizable(product.image)}
                    />

                    {/* Sale / Sold-out Badge */}
                    {soldOut ? (
                      <span className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 rounded-full bg-[#71717A] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white`}>
                        {soldOutLabel}
                      </span>
                    ) : discount > 0 && (
                      <span className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3 rounded-full bg-[#111111] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white`}>
                        {language === 'ar' ? 'تخفيض' : 'Sale'} -{discount}%
                      </span>
                    )}

                    {/* Wishlist toggle icon */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition-all hover:scale-110 cursor-pointer ${
                        inWishlist ? "text-[#EF4444]" : "text-[#71717A] hover:text-[#EF4444]"
                      }`}
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
                    </button>

                    {/* Quick actions overlay (hidden on mobile, visible on desktop hover) */}
                    <div className="absolute inset-0 bg-[#111111]/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 hidden md:flex">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="rounded-full bg-white text-[#111111] p-3 hover:bg-[#C9A227] hover:text-white transition-all shadow-lg hover:scale-105 cursor-pointer"
                        title={t.quick_view}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={soldOut}
                        className="rounded-full bg-[#111111] text-white p-3 hover:bg-[#C9A227] transition-all shadow-lg hover:scale-105 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-[#111111]"
                        title={soldOut ? soldOutLabel : "Add to Bag"}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-[#C9A227]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#111111]">{product.rating}</span>
                        <span className="text-[9px] text-[#71717A]">({product.reviewsCount})</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="mt-1.5 font-serif text-sm font-bold text-[#111111] line-clamp-1 hover:text-[#C9A227] cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      
                      <p className="text-[10px] text-[#71717A] font-semibold tracking-wider mt-0.5">
                        {categoryName(product.category)}
                      </p>
                    </div>

                    {/* Price & Cart footer */}
                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F5F5F5] pt-3">
                      <div>
                        <span className="text-sm font-extrabold text-[#111111]">${product.price.toFixed(2)}</span>
                        {discount > 0 && (
                          <span className="text-[10px] text-[#71717A] line-through ml-1.5">${product.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {/* Mobile action button (Add to Cart direct) */}
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={soldOut}
                        className="rounded-full bg-[#111111] hover:bg-[#C9A227] text-white p-2.5 transition-colors md:hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#111111]"
                        aria-label={soldOut ? soldOutLabel : "Add to cart"}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                      
                      {/* Desktop text action */}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#C9A227] hover:text-[#111111] transition-colors cursor-pointer"
                      >
                        {t.quick_view}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
