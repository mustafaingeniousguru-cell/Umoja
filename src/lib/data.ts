import type { Product, Category, Chest, PreOrder, Step } from "@/types";

export const navLinks = ["HOME", "SHOP", "PRE-ORDERS", "ABOUT", "SHIPPING"];

export const tickerItems = [
  "Pokémon Card Game",
  "One Piece Card Game",
  "Dragon Ball Super Card Game",
  "Funko POP!",
  "Toys & Figures",
  "Hot Wheels",
];

export const announcementText = "✦ FREE SHIPPING ON ORDERS OVER $300 ✦ NEW TREASURES EVERY MONTH ✦ MEMBERS GET 5% OFF EVERYTHING ✦";

// Exact products from HTML
export const products: Product[] = [
  {
    id: 1,
    name: "Pokémon S&V Stellar Crown Booster Box",
    brand: "Pokémon TCG",
    category: "Sealed",
    price: 139.99,
    msrp: 143.64,
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&h=800&fit=crop",
    badge: "new",
    rating: 4.9,
    reviews: 127,
    stock: 12,
  },
  {
    id: 2,
    name: "One Piece OP-06 Booster Box",
    brand: "One Piece TCG",
    category: "Sealed",
    price: 89.99,
    msrp: 99.99,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop",
    badge: "hot",
    rating: 4.8,
    reviews: 89,
    stock: 5,
  },
  {
    id: 3,
    name: "MTG Bloomburrow Play Booster Box",
    brand: "Magic: The Gathering",
    category: "Sealed",
    price: 159.99,
    msrp: 179.99,
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&h=800&fit=crop&sat=-100",
    badge: "sale",
    rating: 4.7,
    reviews: 203,
    stock: 8,
  },
  {
    id: 4,
    name: "Lorcana Shimmering Skies Booster Box",
    brand: "Disney Lorcana",
    category: "Sealed",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop&sat=-100",
    badge: "new",
    rating: 4.6,
    reviews: 54,
    stock: 15,
  },
];

export const categories: Category[] = [
  { id: 1, name: "Pokémon TCG", subtitle: "Sealed & Singles", icon: "🎴", count: 340 },
  { id: 2, name: "One Piece", subtitle: "Booster & Decks", icon: "🏴‍☠️", count: 180 },
  { id: 3, name: "Magic: The Gathering", subtitle: "Sets & Singles", icon: "✦", count: 520 },
  { id: 4, name: "Disney Lorcana", subtitle: "Sealed & Cards", icon: "✧", count: 95 },
  { id: 5, name: "Graded Slabs", subtitle: "PSA, BGS, CGC", icon: "🏆", count: 67 },
  { id: 6, name: "Collectibles", subtitle: "Funko & Figures", icon: "🎨", count: 210 },
];

// Exact text from HTML
export const chests: Chest[] = [
  {
    id: 1,
    name: "Rare Chest",
    tier: "Starter",
    price: 169.99,
    msrp: 195.0,
    icon: "📦",
    desc: "Everything a new collector needs to dive in — a booster box, 10 packs, and a card binder.",
    items: ["1x Booster Box", "10x Booster Packs (mixed)", "1x Card Binder (200 slots)"],
  },
  {
    id: 2,
    name: "Epic Chest",
    tier: "Collector",
    price: 299.99,
    msrp: 340.0,
    icon: "💎",
    desc: "Two booster boxes, a Funko figure, and premium sleeves — the full hobby experience.",
    items: ["2x Booster Boxes (your choice)", "1x Funko POP! Figure", "1x Premium Sleeve Pack"],
    featured: true,
  },
  {
    id: 3,
    name: "Legendary Chest",
    tier: "Ultimate",
    price: 549.99,
    msrp: 640.0,
    icon: "👑",
    desc: "The ultimate haul — a sealed case, a graded slab, and tournament-grade storage.",
    items: ["3x Booster Boxes (your choice)", "1x Graded Slab (PSA 9+)", "1x Premium Storage Case"],
  },
];

// Exact pre-orders from HTML
export const preOrders: PreOrder[] = [
  {
    id: 1,
    name: "Pokémon TCG Surging Sparks Booster Box",
    brand: "Pokémon TCG",
    releaseDate: "Sep 15, 2025",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&h=400&fit=crop",
    countdownHours: 520,
  },
  {
    id: 2,
    name: "One Piece OP-07 500 Years in the Future",
    brand: "One Piece TCG",
    releaseDate: "Oct 10, 2025",
    price: 94.99,
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=400&fit=crop",
    countdownHours: 880,
  },
  {
    id: 3,
    name: "Disney Lorcana Archazia's Island Booster Box",
    brand: "Disney Lorcana",
    releaseDate: "Nov 05, 2025",
    price: 124.99,
    image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=400&h=400&fit=crop&sat=-100",
    countdownHours: 1340,
  },
];

// Exact steps from HTML
export const steps: Step[] = [
  { id: 1, title: "Browse", desc: "Shop sealed product, singles, figures, and accessories — all from trusted hobby brands.", icon: "search" },
  { id: 2, title: "Collect", desc: "Mix categories, grab a treasure chest, or hunt for your holy grail. No minimum order required.", icon: "cart" },
  { id: 3, title: "Secure", desc: "Pay your way — Card, PayPal, Crypto, Apple Pay. 100% SSL-secured, PCI-compliant checkout.", icon: "shield" },
  { id: 4, title: "Receive", desc: "Fast, tracked shipping. Free over $300 (or $150 for members). Packed with collector-grade care.", icon: "truck" },
];
