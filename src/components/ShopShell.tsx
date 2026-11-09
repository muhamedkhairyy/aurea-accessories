"use client";

import React from "react";
import { ShopProvider, type InitialShopData } from "@/context/ShopContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import AddedToBagToast from "@/components/ui/AddedToBagToast";

export default function ShopShell({ initial, children }: { initial?: InitialShopData; children: React.ReactNode }) {
  return (
    <ShopProvider initial={initial}>
      <div className="relative flex flex-col min-h-screen bg-[#F8F5F2]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* Global Shopping Interactivity Layers */}
        <WishlistDrawer />
        <AddedToBagToast />
      </div>
    </ShopProvider>
  );
}
