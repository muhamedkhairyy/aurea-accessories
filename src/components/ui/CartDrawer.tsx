"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { X, ShoppingBag, Plus, Minus, Trash2, Lock, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DASHBOARD_API_URL, isOptimizable } from "@/utils/catalog";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
    refreshProducts,
  } = useShop();

  const [checkoutStep, setCheckoutStep] = useState<"idle" | "form" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", city: "" });
  const [checkoutError, setCheckoutError] = useState("");

  const FREE_SHIPPING_THRESHOLD = 75;
  const progressPercent = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const neededForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) return;
    
    setCheckoutError("");
    setCheckoutStep("loading");
    try {
      // Creates a real order in the Aurèa dashboard (prices and stock are checked server-side)
      const res = await fetch(`${DASHBOARD_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart.map((item) => ({
            productId: item.product.id,
            variant: item.selectedVariant,
            quantity: item.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "We couldn't place your order. Please try again.");
      }
    } catch (err) {
      const message = err instanceof TypeError ? "We couldn't reach our store server. Please try again in a moment." : (err as Error).message;
      setCheckoutError(message);
      setCheckoutStep("form");
      refreshProducts(); // pick up any stock change that caused the failure
      return;
    }

    refreshProducts(); // stock just went down
    setCheckoutStep("success");
    setTimeout(() => {
      clearCart();
      setCheckoutStep("idle");
      setCartOpen(false);
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (checkoutStep !== "loading") setCartOpen(false);
            }}
            className="fixed inset-0 z-50 bg-[#111111]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 flex h-full w-full flex-col bg-white text-[#111111] shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F5F5F5] px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#C9A227]" />
                <h2 className="font-serif text-xl font-semibold tracking-tight">Your Bag ({cartCount})</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                disabled={checkoutStep === "loading"}
                className="rounded-full p-2 transition-colors hover:bg-[#F5F5F5] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {checkoutStep === "success" ? (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center text-center py-8"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#111111]">Order Confirmed!</h3>
                  <p className="mt-2 text-sm text-[#71717A]">
                    Thank you, <strong className="text-[#111111]">{formData.name}</strong>. Your Cash on Delivery order is registered!
                  </p>
                  <div className="mt-6 rounded-lg bg-[#F8F5F2] p-4 text-left text-xs text-[#71717A] w-full border border-[#C9A227]/20">
                    <p className="font-semibold text-[#111111] mb-2">🚚 Delivery Details:</p>
                    <p>Address: {formData.address}, {formData.city}</p>
                    <p>Phone: {formData.phone}</p>
                    <p className="mt-2 text-[#C9A227]">Estimated Delivery: 2-3 Business Days</p>
                  </div>
                  <p className="mt-8 text-xs text-[#C9A227]/70 italic animate-pulse">Closing cart in a few seconds...</p>
                </motion.div>
              ) : checkoutStep === "loading" ? (
                /* Processing Screen */
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />
                  <p className="mt-4 font-serif text-lg font-medium text-[#111111]">Securing your order...</p>
                  <p className="text-xs text-[#71717A] mt-1">Please do not refresh or close this tab.</p>
                </div>
              ) : checkoutStep === "form" ? (
                /* Checkout Form (COD optimized for high conversion) */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 py-2"
                >
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#111111]">Delivery Information</h3>
                    <p className="text-xs text-[#71717A] mt-1">Fill out the details below to complete your order. Pay Cash on Delivery.</p>
                  </div>
                  
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Sarah Connor"
                        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Phone Number (For Delivery Confirmation)</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 234 567 8900"
                        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">Shipping Address</label>
                      <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street Name, Apartment, Building No."
                        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-1">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Los Angeles"
                        className="w-full rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                      />
                    </div>

                    <div className="bg-[#F8F5F2] border border-[#C9A227]/10 rounded-lg p-4 space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A227]">
                        <Truck className="h-4 w-4" />
                        <span>FREE Shipping & Cash on Delivery Active</span>
                      </div>
                      <p className="text-[11px] text-[#71717A]">No pre-payment required. You will pay the courier upon receiving your package.</p>
                    </div>

                    {checkoutError && (
                      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                        {checkoutError}
                      </p>
                    )}

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("idle")}
                        className="flex-1 rounded-full border border-[#E4E4E7] py-3 text-sm font-semibold hover:bg-[#F5F5F5] transition-colors"
                      >
                        Back to Bag
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] rounded-full bg-[#111111] text-white py-3 text-sm font-semibold hover:bg-[#C9A227] transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Lock className="h-4 w-4" />
                        <span>Place COD Order</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : cart.length === 0 ? (
                /* Empty Cart */
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-[#F5F5F5] p-6 text-[#71717A]">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-medium text-[#111111]">Your bag is empty</h3>
                  <p className="mt-2 text-xs text-[#71717A] max-w-[240px]">
                    Add pieces from our collection to begin your luxury shine journey.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-[#111111] px-6 py-2.5 text-xs font-semibold tracking-wide text-white hover:bg-[#C9A227] transition-colors shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-6">
                  {/* Free Shipping Progress */}
                  <div className="bg-[#F8F5F2] border border-[#C9A227]/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Truck className="h-4 w-4 text-[#C9A227]" />
                      <span className="font-medium">
                        {progressPercent >= 100 ? (
                          <span className="text-[#C9A227] font-semibold">🎉 You have unlocked Free Shipping!</span>
                        ) : (
                          <>
                            Add <span className="font-bold text-[#C9A227]">${neededForFreeShipping.toFixed(2)}</span> more for <span className="font-bold">FREE Shipping & COD</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E4E4E7] overflow-hidden">
                      <motion.div
                        className="h-full bg-[#C9A227]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#F5F5F5]">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.selectedVariant}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        {/* Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5] border border-[#F5F5F5]">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                            unoptimized={!isOptimizable(item.product.image)}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between text-sm font-semibold">
                              <h4 className="font-serif text-[#111111] line-clamp-1">{item.product.name}</h4>
                              <span className="text-[#111111] ml-2">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-[#71717A]">{item.selectedVariant}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center rounded-full border border-[#E4E4E7] bg-white px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                                className="p-1 hover:text-[#C9A227] transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-[#111111]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                                className="p-1 hover:text-[#C9A227] transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                              className="text-[#71717A] hover:text-[#EF4444] transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-[#F5F5F5] py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-[#C9A227] uppercase">Waterproof</span>
                      <span className="text-[9px] text-[#71717A] mt-0.5">Won&apos;t rust</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-r border-[#F5F5F5]">
                      <span className="text-[10px] font-bold text-[#C9A227] uppercase">Anti-Tarnish</span>
                      <span className="text-[9px] text-[#71717A] mt-0.5">Lifetime shine</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-[#C9A227] uppercase">Hypoallergenic</span>
                      <span className="text-[9px] text-[#71717A] mt-0.5">Safe for skin</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary (Sticky at Bottom) */}
            {cart.length > 0 && checkoutStep === "idle" && (
              <div className="border-t border-[#F5F5F5] bg-white px-6 py-6 space-y-4">
                <div className="space-y-1.5 text-xs text-[#71717A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#111111]">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {progressPercent >= 100 ? (
                      <span className="text-[#C9A227] font-semibold uppercase">Free</span>
                    ) : (
                      <span className="font-semibold text-[#111111]">$4.99</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#F5F5F5]">
                    <span>Total (Est.)</span>
                    <span>${(cartTotal + (progressPercent >= 100 ? 0 : 4.99)).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full rounded-full bg-[#111111] text-white py-3.5 text-sm font-semibold tracking-wide hover:bg-[#C9A227] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="h-4 w-4" />
                  <span>Secure Checkout (COD Available)</span>
                </button>

                {/* Secure payments footer */}
                <div className="flex items-center justify-center gap-3 text-[10px] text-[#71717A] pt-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Secure SSL Encryption Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
