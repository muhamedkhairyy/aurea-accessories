"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchCatalog } from "@/utils/catalog";
import { fetchHero, type HeroContent } from "@/utils/hero";
import { fetchCategoriesSection, type CategoriesSection } from "@/utils/categories-section";

export interface Product {
  id: string;
  name: string;
  category: string; // a category key from the dashboard (see ShopCategory)
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  stock: number;
  variants: string[];
}

export interface ShopCategory {
  key: string;
  name: { en: string; ar: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

interface ShopContextType {
  products: Product[];
  categories: ShopCategory[];
  categoryName: (key: string) => string;
  hero: HeroContent | null;
  categoriesSection: CategoriesSection | null;
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateQuantity: (productId: string, quantity: number, variant: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  refreshProducts: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// How often the storefront re-checks the dashboard for catalog changes
const CATALOG_POLL_MS = 15_000;

// Reuse unchanged product objects so polling doesn't reset UI that depends on them (e.g. a selected variant)
function keepIdentity(prev: Product[], incoming: Product[]): Product[] {
  return incoming.map((p) => {
    const old = prev.find((o) => o.id === p.id);
    return old && JSON.stringify(old) === JSON.stringify(p) ? old : p;
  });
}

// Keep saved cart lines in step with the live catalog: fresh price/details, capped to stock, removed if gone
function syncCart(cart: CartItem[], products: Product[]): CartItem[] {
  const next = cart.flatMap((item) => {
    const live = products.find((p) => p.id === item.product.id);
    if (!live || live.stock <= 0) return [];
    const quantity = Math.min(item.quantity, live.stock);
    return [live === item.product && quantity === item.quantity ? item : { ...item, product: live, quantity }];
  });
  return next.length === cart.length && next.every((item, i) => item === cart[i]) ? cart : next;
}

// Dashboard data loaded on the server, so the first render already shows the live catalog
export interface InitialShopData {
  products: Product[];
  categories: ShopCategory[];
  hero: HeroContent | null;
  categoriesSection: CategoriesSection | null;
}

export function ShopProvider({ children, initial }: { children: React.ReactNode; initial?: InitialShopData }) {
  // Catalog and categories come only from the dashboard — empty if the server couldn't reach it
  const [products, setProducts] = useState<Product[]>(initial?.products ?? []);
  const [categories, setCategories] = useState<ShopCategory[]>(initial?.categories ?? []);
  const categoryListJsonRef = useRef(JSON.stringify(initial?.categories ?? []));
  // null until the dashboard answers — Hero then falls back to the built-in translations
  const [hero, setHero] = useState<HeroContent | null>(initial?.hero ?? null);
  const heroJsonRef = useRef(initial?.hero ? JSON.stringify(initial.hero) : "");
  const [categoriesSection, setCategoriesSection] = useState<CategoriesSection | null>(initial?.categoriesSection ?? null);
  const categoriesJsonRef = useRef(initial?.categoriesSection ? JSON.stringify(initial.categoriesSection) : "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const productsRef = useRef<Product[]>(initial?.products ?? []);

  const applyCatalog = useCallback((incoming: Product[]) => {
    const list = keepIdentity(productsRef.current, incoming);
    productsRef.current = list;
    setProducts(list);
    setCart((prev) => syncCart(prev, list));
    setWishlist((prev) => {
      const kept = prev.filter((id) => list.some((p) => p.id === id));
      return kept.length === prev.length ? prev : kept;
    });
    setQuickViewProduct((prev) => (prev ? list.find((p) => p.id === prev.id) ?? null : prev));
  }, []);

  const applyCategories = useCallback((list: ShopCategory[] | undefined) => {
    if (!list) return; // older dashboard without categories — keep the current list
    const json = JSON.stringify(list);
    if (json === categoryListJsonRef.current) return;
    categoryListJsonRef.current = json;
    setCategories(list);
    // A filter on a category that no longer exists would show nothing
    setSelectedCategory((prev) => (prev === "All" || list.some((c) => c.key === prev) ? prev : "All"));
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const { products: list, categories: cats } = await fetchCatalog();
      applyCatalog(list);
      applyCategories(cats);
    } catch (e) {
      // Dashboard offline: keep showing the last known catalog
      console.warn("Could not refresh catalog from dashboard", e);
    }
  }, [applyCatalog, applyCategories]);

  // Pull the live catalog from the dashboard, then keep it fresh (poll + tab focus)
  useEffect(() => {
    const load = () => {
      fetchCatalog()
        .then(({ products: list, categories: cats }) => {
          applyCatalog(list);
          applyCategories(cats);
        })
        .catch((e) => console.warn("Could not load catalog from dashboard", e));
      fetchHero()
        .then((next) => {
          const json = JSON.stringify(next);
          if (json === heroJsonRef.current) return; // unchanged — skip the re-render
          heroJsonRef.current = json;
          setHero(next);
        })
        .catch((e) => console.warn("Could not load hero content from dashboard", e));
      fetchCategoriesSection()
        .then((next) => {
          const json = JSON.stringify(next);
          if (json === categoriesJsonRef.current) return;
          categoriesJsonRef.current = json;
          setCategoriesSection(next);
        })
        .catch((e) => console.warn("Could not load categories section from dashboard", e));
    };
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, CATALOG_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", load);
    };
  }, [applyCatalog, applyCategories]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aurea_cart");
    const savedWishlist = localStorage.getItem("aurea_wishlist");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error(e);
      }
    }
    const savedLanguage = localStorage.getItem("aurea_language");
    if (savedLanguage === 'en' || savedLanguage === 'ar') {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save cart and wishlist when changed
  useEffect(() => {
    localStorage.setItem("aurea_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("aurea_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("aurea_language", language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    if (product.stock <= 0) return;
    const selectedVariant = variant || product.variants[0] || "Standard";
    
    setCart((prev) => {
      // Never let the bag hold more units than the dashboard has in stock (across all variants)
      const inBag = prev.filter((item) => item.product.id === product.id).reduce((n, item) => n + item.quantity, 0);
      const addable = Math.min(quantity, product.stock - inBag);
      if (addable <= 0) return prev;

      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        return prev.map((item, i) => (i === existingIndex ? { ...item, quantity: item.quantity + addable } : item));
      }

      return [...prev, { product, quantity: addable, selectedVariant }];
    });
    
    // Automatically trigger cart drawer for conversion push
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedVariant === variant)));
  };

  const updateQuantity = (productId: string, quantity: number, variant: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) => {
      const target = prev.find((item) => item.product.id === productId && item.selectedVariant === variant);
      if (!target) return prev;
      const otherVariants = prev
        .filter((item) => item.product.id === productId && item !== target)
        .reduce((n, item) => n + item.quantity, 0);
      const capped = Math.min(quantity, Math.max(target.product.stock - otherVariants, 1));
      return prev.map((item) => (item === target ? { ...item, quantity: capped } : item));
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Localized display name of a category key (Arabic falls back to English)
  const categoryName = (key: string) => {
    const c = categories.find((x) => x.key === key);
    return (language === "ar" && c?.name.ar) || c?.name.en || key;
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        categoryName,
        hero,
        categoriesSection,
        cart,
        wishlist,
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        refreshProducts,
        cartTotal,
        cartCount,
        language,
        setLanguage,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
