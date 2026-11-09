import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Your Bag | Aurèa Accessories",
  robots: { index: false },
};

export default function Cart() {
  return <CartPage />;
}
