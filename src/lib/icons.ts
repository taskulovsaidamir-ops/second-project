import React from "react";
import {
  Wallet,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  HeartPulse,
  Film,
  Wifi,
  MoreHorizontal,
  Coffee,
  Plane,
  BookOpen,
  Dumbbell,
  Smartphone,
  CreditCard,
  PiggyBank,
  LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  wallet: Wallet,
  briefcase: Briefcase,
  laptop: Laptop,
  "trending-up": TrendingUp,
  gift: Gift,
  "plus-circle": PlusCircle,
  "shopping-cart": ShoppingCart,
  utensils: Utensils,
  car: Car,
  home: Home,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  film: Film,
  wifi: Wifi,
  "more-horizontal": MoreHorizontal,
  coffee: Coffee,
  plane: Plane,
  "book-open": BookOpen,
  dumbbell: Dumbbell,
  smartphone: Smartphone,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

export const AVAILABLE_COLORS = [
  "#10b981", // emerald
  "#34d399", // mint
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ef4444", // red
  "#f59e0b", // amber
  "#eab308", // yellow
  "#64748b", // slate
];

export function getCategoryIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Wallet;
}
