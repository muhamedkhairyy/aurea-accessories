"use client";

import React from "react";
import { ShopProvider } from "@/context/ShopContext";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import BestSellers from "@/components/sections/BestSellers";
import PromoBanner from "@/components/sections/PromoBanner";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Collections from "@/components/sections/Collections";
import About from "@/components/sections/About";
import SocialProof from "@/components/sections/SocialProof";
import MasonryGallery from "@/components/sections/MasonryGallery";
import FAQ from "@/components/sections/FAQ";
import Newsletter from "@/components/sections/Newsletter";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import QuickViewModal from "@/components/ui/QuickViewModal";
import FomoToasts from "@/components/ui/FomoToasts";
import StickyAddToCart from "@/components/ui/StickyAddToCart";

export default function Home() {
  return (
    <ShopProvider>
      <div className="relative flex flex-col min-h-screen bg-[#F8F5F2]">
        {/* Sticky Luxury Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Hero />
          <Categories />
          <BestSellers />
          {/* <PromoBanner /> */}
          {/* <WhyChooseUs /> */}
          {/*  <Collections />
          <About />
          <SocialProof />
          <MasonryGallery />
          <FAQ /> */}
          {/* <Newsletter /> */}
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Shopping Interactivity Layers */}
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
        {/*<FomoToasts />
        <StickyAddToCart /> */}
      </div>
    </ShopProvider>
  );
}
