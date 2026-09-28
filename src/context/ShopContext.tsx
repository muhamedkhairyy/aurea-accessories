"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { DASHBOARD_API_URL, resolveImage } from "@/utils/catalog";
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

// Built-in categories, used until (or if) the dashboard's list loads
const DEFAULT_CATEGORIES: ShopCategory[] = [
  { key: "Necklaces", name: { en: "Necklaces", ar: "قلادات" } },
  { key: "Rings", name: { en: "Rings", ar: "خواتم" } },
  { key: "Bracelets", name: { en: "Bracelets", ar: "أساور" } },
  { key: "Earrings", name: { en: "Earrings", ar: "أقراط" } },
  { key: "Sets", name: { en: "Sets", ar: "أطقم" } },
];

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

const PRODUCTS: Product[] = [
  {
    id: "aurelia-pendant",
    name: "Aurelia Pendant Necklace",
    category: "Necklaces",
    price: 49.0,
    oldPrice: 95.0,
    rating: 4.9,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600",
    description: "Designed in 18k gold plated premium stainless steel. A timeless drop pendant that sits elegantly on your collarbone. 100% waterproof, sweatproof, and designed to wear 24/7.",
    stock: 8,
    variants: ["18K Gold", "Silver"],
  },
  {
    id: "celeste-spinner",
    name: "Celeste Spinner Ring",
    category: "Rings",
    price: 35.0,
    oldPrice: 70.0,
    rating: 4.8,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600",
    description: "Features a rotating center band designed to relieve stress and soothe the mind. Crafted in high-durability stainless steel with an ultra-polished luster.",
    stock: 14,
    variants: ["Size 6", "Size 7", "Size 8", "Size 9"],
  },
  {
    id: "solene-herringbone",
    name: "Solene Herringbone Bracelet",
    category: "Bracelets",
    price: 39.0,
    oldPrice: 80.0,
    rating: 4.9,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600",
    description: "A sleek, liquid-gold style flat herringbone chain that hugs your wrist beautifully. Perfect for stacking or wearing solo. Fully hypoallergenic and sweat-resistant.",
    stock: 5,
    variants: ["18K Gold", "Silver"],
  },
  {
    id: "maia-droplet",
    name: "Maia Droplet Earrings",
    category: "Earrings",
    price: 32.0,
    oldPrice: 65.0,
    rating: 4.7,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600",
    description: "Sculpted teardrops that capture light from every angle. Lightweight, skin-friendly, and designed for comfortable, secure all-day wear.",
    stock: 19,
    variants: ["18K Gold", "Silver"],
  },
  {
    id: "elysian-layered",
    name: "Elysian Layered Set",
    category: "Sets",
    price: 75.0,
    oldPrice: 160.0,
    rating: 5.0,
    reviewsCount: 412,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600",
    description: "The ultimate luxury curation. Includes the Aurelia Pendant Necklace and the Solene Herringbone Bracelet at a bundled discount. Comes in signature premium packaging.",
    stock: 3,
    variants: ["18K Gold Set", "Silver Set"],
  },
  {
    id: "amara-eternity",
    name: "Amara Eternity Ring",
    category: "Rings",
    price: 38.0,
    oldPrice: 80.0,
    rating: 4.9,
    reviewsCount: 187,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600",
    description: "Adorned with high-grade cubic zirconia crystals that shine like diamonds. Fully waterproof stainless steel base ensures crystals stay secure and metal never tarnishes.",
    stock: 7,
    variants: ["Size 6", "Size 7", "Size 8"],
  },
  {
    id: "lumiere-hoop",
    name: "Lumiere Hoop Earrings",
    category: "Earrings",
    price: 29.0,
    oldPrice: 60.0,
    rating: 4.8,
    reviewsCount: 289,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600",
    description: "Classic chunky hoops that add instant polish to any outfit. Hollow-core design ensures they are ultra-lightweight and comfortable.",
    stock: 11,
    variants: ["Small", "Medium", "Large"],
  },
  {
    id: "seraphina-cable",
    name: "Seraphina Cable Chain",
    category: "Necklaces",
    price: 45.0,
    oldPrice: 90.0,
    rating: 4.9,
    reviewsCount: 203,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600",
    description: "A delicate, shimmering paperclip link chain. Sleek, minimalist, and tarnish-free. Designed for the active modern woman.",
    stock: 6,
    variants: ["18K Gold", "Silver"],
  },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// How often the storefront re-checks the dashboard for catalog changes
const CATALOG_POLL_MS = 15_000;

async function fetchCatalog(): Promise<{ products: Product[]; categories: ShopCategory[] | undefined }> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  const data: { products: Product[]; categoryList?: ShopCategory[] } = await res.json();
  return { products: data.products.map((p) => ({ ...p, image: resolveImage(p.image) })), categories: data.categoryList };
}

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

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<ShopCategory[]>(DEFAULT_CATEGORIES);
  const categoryListJsonRef = useRef(JSON.stringify(DEFAULT_CATEGORIES));
  // null until the dashboard answers — Hero then falls back to the built-in translations
  const [hero, setHero] = useState<HeroContent | null>(null);
  const heroJsonRef = useRef("");
  const [categoriesSection, setCategoriesSection] = useState<CategoriesSection | null>(null);
  const categoriesJsonRef = useRef("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const productsRef = useRef<Product[]>(PRODUCTS);

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
    if (!list) return; // older dashboard without categories — keep the built-in list
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
