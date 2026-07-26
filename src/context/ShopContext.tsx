"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  category: "Necklaces" | "Rings" | "Bracelets" | "Earrings" | "Sets";
  price: number;
  oldPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  stock: number;
  variants: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

interface ShopContextType {
  products: Product[];
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

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

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
    const selectedVariant = variant || product.variants[0] || "Standard";
    
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      }

      return [...prev, { product, quantity, selectedVariant }];
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
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products: PRODUCTS,
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
