"use server";

import { z } from "zod";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number().positive("Сумма должна быть больше 0"),
  categoryId: z.string().min(1, "Выберите категорию"),
  date: z.string().min(1, "Укажите дату"),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"]).default("CARD"),
});

export async function createTransactionAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Не авторизован" };
  }

  const rawData = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    description: formData.get("description") || undefined,
    paymentMethod: formData.get("paymentMethod") || "CARD",
  };

  const parsed = transactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { type, amount, categoryId, date, description, paymentMethod } = parsed.data;

  // Convert date string YYYY-MM-DD to timestamp
  const dateTimestamp = new Date(date).getTime();
  const now = Date.now();

  await db.insert(transactions).values({
    id: crypto.randomUUID(),
    userId: user.userId,
    categoryId,
    type,
    amount,
    date: dateTimestamp,
    description: description || null,
    paymentMethod,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/analytics");

  return { success: true };
}

export async function deleteTransactionAction(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Не авторизован");

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, user.userId)));

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/analytics");

  return { success: true };
}

export async function updateTransactionAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const id = formData.get("id") as string;
  if (!id) return { error: "ID транзакции отсутствует" };

  const rawData = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
    description: formData.get("description") || undefined,
    paymentMethod: formData.get("paymentMethod") || "CARD",
  };

  const parsed = transactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { type, amount, categoryId, date, description, paymentMethod } = parsed.data;
  const dateTimestamp = new Date(date).getTime();

  await db
    .update(transactions)
    .set({
      type,
      amount,
      categoryId,
      date: dateTimestamp,
      description: description || null,
      paymentMethod,
      updatedAt: Date.now(),
    })
    .where(and(eq(transactions.id, id), eq(transactions.userId, user.userId)));

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/analytics");

  return { success: true };
}
