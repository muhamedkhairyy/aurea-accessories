"use client";

import React from "react";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import BestSellers from "@/components/sections/BestSellers";

// Home page sections; Header, Footer and the shop provider live in the (shop) layout
export default function Storefront() {
  return (
    <>
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
    </>
  );
}
