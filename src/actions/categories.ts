"use server";

import { z } from "zod";
import { db } from "@/db";
import { categories, transactions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().default("wallet"),
  color: z.string().default("#10b981"),
});

export async function createCategoryAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon") || "wallet",
    color: formData.get("color") || "#10b981",
  };

  const parsed = categorySchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { name, type, icon, color } = parsed.data;

  await db.insert(categories).values({
    id: crypto.randomUUID(),
    userId: user.userId,
    name: name.trim(),
    type,
    icon,
    color,
    isDefault: false,
    createdAt: Date.now(),
  });

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/");

  return { success: true };
}

export async function updateCategoryAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const id = formData.get("id") as string;
  if (!id) return { error: "ID категории отсутствует" };

  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon") || "wallet",
    color: formData.get("color") || "#10b981",
  };

  const parsed = categorySchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { name, type, icon, color } = parsed.data;

  await db
    .update(categories)
    .set({
      name: name.trim(),
      type,
      icon,
      color,
    })
    .where(and(eq(categories.id, id), eq(categories.userId, user.userId)));

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/");

  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Не авторизован");

  // Check if there are transactions using this category
  const linked = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(eq(transactions.categoryId, categoryId), eq(transactions.userId, user.userId)))
    .limit(1);

  if (linked.length > 0) {
    return { error: "Нельзя удалить категорию, к которой привязаны существующие транзакции" };
  }

  await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, user.userId)));

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/");

  return { success: true };
}
