"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CreditCard, Landmark, Lock, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { DASHBOARD_API_URL, optionLabel, colorImage, formatPrice, isOptimizable } from "@/utils/catalog";
import {
  DEFAULT_CHECKOUT_CONFIG,
  PAYMENT_ACCOUNTS,
  fetchCheckoutConfig,
  shippingFeeFor,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutForm,
  type PaymentProof,
} from "@/utils/checkout";
import { productMaterials } from "@/utils/materials";
import PaymentProofUpload from "@/components/cart/PaymentProofUpload";
import ProductMaterials from "@/components/ui/ProductMaterials";
import { translations } from "@/utils/translations";
import { localizeServerError } from "@/utils/checkout";

const inputClass =
  "w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]";
const fieldClass = (error?: string) => `${inputClass} ${error ? "border-red-300" : "border-[#E4E4E7]"}`;
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider text-[#71717A]";

const EMPTY_FORM: CheckoutForm = { name: "", phone: "", governorate: "", city: "", address: "", transferAmount: "" };

// What the dashboard sends back for a placed order (the fields shown on the confirmation)
interface PlacedOrder {
  id: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  payment: { transferAmount: number; proofUrl: string };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart, refreshProducts, language } = useShop();
  const ar = language === "ar";
  const t = translations[language];

  const [checkoutStep, setCheckoutStep] = useState<"idle" | "form" | "loading" | "success">("idle");
  const [formData, setFormData] = useState<CheckoutForm>(EMPTY_FORM);
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [showErrors, setShowErrors] = useState(false); // field errors appear after the first submit attempt
  const [checkoutError, setCheckoutError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [config, setConfig] = useState(DEFAULT_CHECKOUT_CONFIG);

  // Use the dashboard's live fees when reachable; the built-in table (same values) covers the rest
  useEffect(() => {
    fetchCheckoutConfig()
      .then(setConfig)
      .catch((e) => console.warn("Could not load checkout config; using built-in shipping fees", e));
  }, []);

  const shippingFee = shippingFeeFor(config, formData.governorate);
  const total = cartTotal + (shippingFee ?? 0);
  const transfer = Number(formData.transferAmount);
  const transferValid = formData.transferAmount.trim() !== "" && Number.isFinite(transfer) && transfer >= config.minTransfer && transfer <= total;
  const remaining = transferValid ? Math.max(total - transfer, 0) : null;

  const errors: CheckoutErrors = validateCheckout(formData, { total, proof: paymentProof, config, lang: language });
  const visibleErrors: CheckoutErrors = showErrors ? errors : {};
  const isValid = Object.keys(errors).length === 0;

  const feeFor = (key: string) => shippingFeeFor(config, key) ?? 0;
  const governorateName = (key: string) => config.governorates.find((g) => g.key === key)?.name[language] ?? "";

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === "loading") return;
    setShowErrors(true);
    setCheckoutError("");
    if (!isValid || shippingFee === null || !paymentProof) {
      // Bring the first problem into view
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setCheckoutStep("loading");
    let order: PlacedOrder;
    try {
      // Creates the order in the Aurèa dashboard, which re-checks prices, stock, shipping, the transfer and the screenshot
      const res = await fetch(`${DASHBOARD_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            governorate: formData.governorate,
            city: formData.city.trim(),
            address: formData.address.trim(),
          },
          items: cart.map((item) => ({
            productId: item.product.id,
            variant: item.selectedVariant,
            color: item.selectedColor || undefined, // omitted for products without colors
            quantity: item.quantity,
          })),
          shippingFee,
          transferAmount: transfer,
          paymentProof: paymentProof.dataUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) fetchCheckoutConfig().then(setConfig).catch(() => {}); // fee or stock changed
        if (res.status === 413) throw new Error(t.err_proof_too_large);
        throw new Error(data.error ? localizeServerError(data.error, language) : t.err_place_order);
      }
      order = data.order;
    } catch (err) {
      const message = err instanceof TypeError ? t.err_reach_server : (err as Error).message;
      setCheckoutError(message);
      setCheckoutStep("form");
      refreshProducts(); // pick up any stock change that caused the failure
      return;
    }

    refreshProducts(); // stock just went down
    setPlacedOrder(order);
    clearCart();
    setCheckoutStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Shared props for a text field: value, change handler and accessible error wiring
  const field = (name: keyof CheckoutForm) => ({
    id: `checkout-${name}`,
    name,
    value: formData[name],
    onChange: handleInputChange,
    className: fieldClass(visibleErrors[name]),
    "aria-invalid": !!visibleErrors[name],
    "aria-describedby": visibleErrors[name] ? `checkout-${name}-error` : undefined,
  });

  if (checkoutStep === "success" && placedOrder) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold">{t.order_received}</h1>
        <p className="mt-2 text-sm text-[#71717A]">{t.order_thanks(formData.name, placedOrder.id)}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#C9A227]/10 px-3 py-1 text-xs font-semibold text-[#8a6d12]">
          <Clock className="h-3.5 w-3.5" />
          {t.order_pending_verification}
        </p>
        <div className="mt-6 w-full space-y-1.5 rounded-xl border border-[#C9A227]/20 bg-white p-5 text-start text-sm text-[#71717A]">
          <p className="mb-2 font-semibold text-[#111111]">{t.delivery_details}</p>
          <p>{t.address_label}: {[formData.address, formData.city, governorateName(formData.governorate)].join(ar ? "، " : ", ")}</p>
          <p>{t.phone_label}: <span dir="ltr">{formData.phone}</span></p>
          <div className="mt-3 space-y-1 border-t border-[#F5F5F5] pt-3">
            <p className="flex justify-between"><span>{t.subtotal}</span><span className="text-[#111111]">{formatPrice(placedOrder.subtotal, language)}</span></p>
            <p className="flex justify-between"><span>{t.shipping}</span><span className="text-[#111111]">{formatPrice(placedOrder.shippingFee, language)}</span></p>
            <p className="flex justify-between font-bold text-[#111111]"><span>{t.total}</span><span>{formatPrice(placedOrder.total, language)}</span></p>
            <p className="flex justify-between"><span>{t.transferred}</span><span className="text-[#111111]">{formatPrice(placedOrder.payment.transferAmount, language)}</span></p>
            <p className="flex justify-between"><span>{t.due_on_delivery}</span><span className="font-semibold text-[#111111]">{formatPrice(Math.max(placedOrder.total - placedOrder.payment.transferAmount, 0), language)}</span></p>
          </div>
          <p className="mt-2 text-[#C9A227]">{t.estimated_delivery}</p>
        </div>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#111111] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#C9A227]">
          {t.continue_shopping}
        </Link>
      </motion.div>
    );
  }

  if (cart.length === 0 && checkoutStep !== "loading") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-white p-6 text-[#71717A]">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-semibold">{t.cart_empty_title}</h1>
        <p className="mt-2 text-sm text-[#71717A]">{t.cart_empty_desc}</p>
        <Link href="/#bestsellers" className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-xs font-semibold tracking-wide text-white shadow-md hover:bg-[#C9A227]">
          {t.start_shopping}
        </Link>
      </div>
    );
  }

  const lineKey = (item: (typeof cart)[number]) => `${item.product.id}-${item.selectedVariant}-${item.selectedColor ?? ""}`;
  const busy = checkoutStep === "loading";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="flex items-center gap-2 font-serif text-3xl font-bold tracking-tight">
          <ShoppingBag className="h-7 w-7 text-[#C9A227]" />
          {t.cart_heading(cartCount)}
        </h1>
        <Link href="/#bestsellers" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A] hover:text-[#C9A227] sm:inline-flex">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t.continue_shopping}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: items, or the delivery + payment form */}
        <div className="space-y-6">
          {checkoutStep === "idle" ? (
            <>
              {/* Shipping + payment notice */}
              <div className="flex items-start gap-2 rounded-xl border border-[#C9A227]/10 bg-white p-4 text-xs">
                <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C9A227]" />
                <span className="font-medium">
                  {t.cart_notice(formatPrice(feeFor("cairo"), language), formatPrice(feeFor("alexandria"), language), formatPrice(config.minTransfer, language))}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#F5F5F5] rounded-2xl border border-[#E4E4E7] bg-white px-4 sm:px-6">
                {cart.map((item) => {
                  const img = colorImage(item.product, item.selectedColor);
                  const href = `/product/${item.product.id}${item.selectedColor ? `?color=${encodeURIComponent(item.selectedColor)}` : ""}`;
                  return (
                    <div key={lineKey(item)} className="flex gap-4 py-5">
                      <Link href={href} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[#F5F5F5] bg-[#F5F5F5] sm:h-28 sm:w-28">
                        <Image src={img} alt={item.product.name} fill sizes="112px" className="object-cover" unoptimized={!isOptimizable(img)} />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-2 text-sm font-semibold">
                            <Link href={href} className="line-clamp-2 font-serif hover:text-[#C9A227] sm:text-base">{item.product.name}</Link>
                            <span className="whitespace-nowrap">{formatPrice(item.product.price * item.quantity, language)}</span>
                          </div>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#71717A]">
                            {item.selectedColor && (
                              <>
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-black/15"
                                  style={{ backgroundColor: item.product.colors.find((c) => c.name === item.selectedColor)?.hex }}
                                />
                                <span>{optionLabel(item.selectedColor, language)} ·</span>
                              </>
                            )}
                            <span>{optionLabel(item.selectedVariant, language)}</span>
                          </p>
                          <ProductMaterials materials={productMaterials(item.product)} language={language} variant="compact" />
                          <p className="mt-1 text-xs text-[#71717A]">{formatPrice(item.product.price, language)} {t.each}</p>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center rounded-full border border-[#E4E4E7] bg-white px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant, item.selectedColor)}
                              className="p-1 transition-colors hover:text-[#C9A227]"
                              aria-label={t.decrease_qty}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant, item.selectedColor)}
                              className="p-1 transition-colors hover:text-[#C9A227]"
                              aria-label={t.increase_qty}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant, item.selectedColor)}
                            className="flex items-center gap-1 p-1 text-[#71717A] transition-colors hover:text-[#EF4444]"
                            aria-label={t.remove_item}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">{t.remove}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#E4E4E7] bg-white py-4 text-center">
                {[
                  [t.badge_waterproof, t.badge_waterproof_desc],
                  [t.badge_tarnish, t.badge_tarnish_desc],
                  [t.badge_hypo, t.badge_hypo_desc],
                ].map(([title, desc], i) => (
                  <div key={title} className={`flex flex-col items-center ${i === 1 ? "border-x border-[#F5F5F5]" : ""}`}>
                    <span className="text-[10px] font-bold uppercase text-[#C9A227]">{title}</span>
                    <span className="mt-0.5 text-[9px] text-[#71717A]">{desc}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Checkout form — also shown, dimmed, while the order is being placed */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 ${busy ? "pointer-events-none opacity-60" : ""}`}
            >
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} noValidate className="space-y-8">
                {/* 1. Contact + shipping */}
                <section>
                  <h2 className="font-serif text-xl font-semibold">{t.delivery_info_title}</h2>
                  <p className="mt-1 text-xs text-[#71717A]">{t.delivery_info_desc}</p>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkout-name" className={labelClass}>{t.label_name}</label>
                      <input type="text" autoComplete="name" placeholder={t.ph_name} {...field("name")} />
                      <FieldError id="checkout-name-error" message={visibleErrors.name} />
                    </div>
                    <div>
                      <label htmlFor="checkout-phone" className={labelClass}>{t.label_phone}</label>
                      <input type="tel" autoComplete="tel" inputMode="tel" placeholder={t.ph_phone} dir="ltr" {...field("phone")} />
                      <FieldError id="checkout-phone-error" message={visibleErrors.phone} />
                    </div>
                    <div>
                      <label htmlFor="checkout-governorate" className={labelClass}>{t.label_governorate}</label>
                      <select {...field("governorate")} className={`${fieldClass(visibleErrors.governorate)} ${formData.governorate ? "" : "text-[#A1A1AA]"}`}>
                        <option value="" disabled>{t.select_governorate}</option>
                        {config.governorates.map((g) => (
                          <option key={g.key} value={g.key} className="text-[#111111]">
                            {g.name[language]} — {formatPrice(g.fee, language)}
                          </option>
                        ))}
                      </select>
                      <FieldError id="checkout-governorate-error" message={visibleErrors.governorate} />
                    </div>
                    <div>
                      <label htmlFor="checkout-city" className={labelClass}>{t.label_city}</label>
                      <input type="text" autoComplete="address-level2" placeholder={t.ph_city} {...field("city")} />
                      <FieldError id="checkout-city-error" message={visibleErrors.city} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-address" className={labelClass}>{t.label_address}</label>
                      <input type="text" autoComplete="street-address" placeholder={t.ph_address} {...field("address")} />
                      <FieldError id="checkout-address-error" message={visibleErrors.address} />
                    </div>
                  </div>

                  {shippingFee !== null && (
                    <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#C9A227]" aria-live="polite">
                      <Truck className="h-4 w-4" />
                      {t.shipping_to(governorateName(formData.governorate), formatPrice(shippingFee, language))}
                    </p>
                  )}
                </section>

                {/* 2. Payment proof */}
                <section className="border-t border-[#F5F5F5] pt-8">
                  <h2 className="font-serif text-xl font-semibold">{t.payment_proof_title}</h2>
                  <div className="mt-3 space-y-2 rounded-lg border border-[#C9A227]/20 bg-[#F8F5F2] p-4 text-xs text-[#71717A]">
                    <p className="flex items-center gap-2 font-semibold text-[#111111]">
                      <Landmark className="h-4 w-4 text-[#C9A227]" />
                      {t.proof_required_notice}
                    </p>
                    <p>{t.proof_instructions(formatPrice(config.minTransfer, language))}</p>
                    {PAYMENT_ACCOUNTS.length > 0 ? (
                      <ul className="space-y-1 pt-1">
                        {PAYMENT_ACCOUNTS.map((a) => (
                          <li key={a.label.en}>
                            {a.label[language]}: <strong className="select-all text-[#111111]" dir="ltr">{a.value}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{t.transfer_contact}</p>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4">
                    <div className="sm:max-w-xs">
                      <label htmlFor="checkout-transferAmount" className={labelClass}>{t.label_transfer}</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={config.minTransfer}
                        max={total || undefined}
                        step="any"
                        placeholder={t.ph_transfer(config.minTransfer)}
                        dir="ltr"
                        {...field("transferAmount")}
                      />
                      <FieldError id="checkout-transferAmount-error" message={visibleErrors.transferAmount} />
                    </div>
                    <PaymentProofUpload value={paymentProof} onChange={setPaymentProof} error={visibleErrors.paymentProof} disabled={busy} language={language} />
                  </div>
                </section>

                {checkoutError && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setCheckoutStep("idle")}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#71717A] hover:text-[#111111]"
                >
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  {t.back_to_bag}
                </button>
              </form>
            </motion.div>
          )}
        </div>

        {/* Right: order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-[#E4E4E7] bg-white p-6">
            <h2 className="font-serif text-lg font-semibold">{t.order_summary}</h2>

            {checkoutStep !== "idle" && (
              <ul className="space-y-3 border-b border-[#F5F5F5] pb-4 text-xs text-[#71717A]">
                {cart.map((item) => (
                  <li key={lineKey(item)}>
                    <div className="flex justify-between gap-2">
                      <span className="line-clamp-1">
                        {item.quantity} × {item.product.name}
                      </span>
                      <span className="whitespace-nowrap font-semibold text-[#111111]">{formatPrice(item.product.price * item.quantity, language)}</span>
                    </div>
                    <ProductMaterials materials={productMaterials(item.product)} language={language} variant="compact" />
                  </li>
                ))}
              </ul>
            )}

            <dl className="space-y-2 text-sm text-[#71717A]">
              <div className="flex justify-between">
                <dt>{t.subtotal}</dt>
                <dd className="font-semibold text-[#111111]">{formatPrice(cartTotal, language)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{t.shipping}{formData.governorate && ` (${governorateName(formData.governorate)})`}</dt>
                <dd className="font-semibold text-[#111111]" aria-live="polite">
                  {shippingFee !== null ? formatPrice(shippingFee, language) : <span className="text-xs font-normal text-[#71717A]">{t.select_governorate}</span>}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#F5F5F5] pt-3 text-base font-bold text-[#111111]">
                <dt>{t.total}</dt>
                <dd>{shippingFee !== null ? formatPrice(total, language) : t.total_plus_shipping(formatPrice(cartTotal, language))}</dd>
              </div>

              {checkoutStep !== "idle" && (
                <>
                  <div className="flex justify-between border-t border-[#F5F5F5] pt-3">
                    <dt>{t.transfer_amount}</dt>
                    <dd className="font-semibold text-[#111111]">{transferValid ? formatPrice(transfer, language) : "—"}</dd>
                  </div>
                  {remaining !== null && (
                    <div className="flex justify-between">
                      <dt>{t.due_on_delivery}</dt>
                      <dd className="font-semibold text-[#111111]">{formatPrice(remaining, language)}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <dt>{t.payment_screenshot}</dt>
                    <dd>
                      {paymentProof ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
                        <img src={paymentProof.dataUrl} alt={ar ? "إيصال التحويل" : "Payment screenshot"} className="h-12 w-12 rounded-md border border-[#E4E4E7] object-cover" />
                      ) : (
                        <span className="text-xs text-red-600">{t.required}</span>
                      )}
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {/* Distinct keys: reusing one <button> node would let the click that opens the form also submit it */}
            {checkoutStep === "idle" ? (
              <button
                key="checkout"
                type="button"
                onClick={() => setCheckoutStep("form")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#C9A227]"
              >
                <Lock className="h-4 w-4" />
                <span>{t.proceed_checkout}</span>
              </button>
            ) : (
              <>
                <button
                  key="place-order"
                  type="submit"
                  form="checkout-form"
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#C9A227] disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>{t.securing_order}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>{t.place_order}</span>
                    </>
                  )}
                </button>
                {showErrors && !isValid && !busy && (
                  <p role="alert" className="text-center text-xs font-medium text-red-600">
                    {t.complete_fields}
                  </p>
                )}
              </>
            )}

            <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-[#71717A]">
              <CreditCard className="h-3.5 w-3.5" />
              <span>{t.secure_ssl}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
