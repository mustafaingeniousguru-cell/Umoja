export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  msrp?: number;
  image: string;
  badge?: "new" | "hot" | "sale" | "limited" | "preorder";
  rating: number;
  reviews: number;
  stock: number;
  description?: string;
  /** Bento grid size: "lg" = large tile, "md" = medium, "sm" = small */
  size?: "lg" | "md" | "sm";
}

export interface Category {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  count: number;
}

export interface Chest {
  id: number;
  name: string;
  tier: string;
  price: number;
  msrp: number;
  icon: string;
  desc: string;
  items: string[];
  featured?: boolean;
}

export interface PreOrder {
  id: number;
  name: string;
  brand: string;
  releaseDate: string;
  price: number;
  image: string;
  countdownHours: number;
}

export interface Step {
  id: number;
  title: string;
  desc: string;
  icon: string;
}
