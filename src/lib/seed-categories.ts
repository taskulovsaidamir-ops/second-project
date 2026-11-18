import { db } from "@/db";
import { categories } from "@/db/schema";

const DEFAULT_CATEGORIES = [
  // Доходы
  { name: "Зарплата", type: "INCOME" as const, icon: "briefcase", color: "#10b981" },
  { name: "Фриланс", type: "INCOME" as const, icon: "laptop", color: "#34d399" },
  { name: "Инвестиции", type: "INCOME" as const, icon: "trending-up", color: "#06b6d4" },
  { name: "Подарки", type: "INCOME" as const, icon: "gift", color: "#a855f7" },
  { name: "Прочее", type: "INCOME" as const, icon: "plus-circle", color: "#64748b" },

  // Расходы
  { name: "Продукты и еда", type: "EXPENSE" as const, icon: "shopping-cart", color: "#f43f5e" },
  { name: "Кафе и рестораны", type: "EXPENSE" as const, icon: "utensils", color: "#fb7185" },
  { name: "Транспорт и авто", type: "EXPENSE" as const, icon: "car", color: "#f59e0b" },
  { name: "Жильё и ЖКУ", type: "EXPENSE" as const, icon: "home", color: "#6366f1" },
  { name: "Покупки и одежда", type: "EXPENSE" as const, icon: "shopping-bag", color: "#ec4899" },
  { name: "Здоровье и аптеки", type: "EXPENSE" as const, icon: "heart-pulse", color: "#ef4444" },
  { name: "Развлечения", type: "EXPENSE" as const, icon: "film", color: "#8b5cf6" },
  { name: "Связь и интернет", type: "EXPENSE" as const, icon: "wifi", color: "#0ea5e9" },
  { name: "Другое", type: "EXPENSE" as const, icon: "more-horizontal", color: "#94a3b8" },
];

export async function seedDefaultCategories(userId: string) {
  const now = Date.now();
  const rows = DEFAULT_CATEGORIES.map((cat) => ({
    id: crypto.randomUUID(),
    userId,
    name: cat.name,
    type: cat.type,
    icon: cat.icon,
    color: cat.color,
    isDefault: true,
    createdAt: now,
  }));

  await db.insert(categories).values(rows);
}
