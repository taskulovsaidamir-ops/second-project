"use server";

import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { seedDefaultCategories } from "@/lib/seed-categories";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  currency: z.string().default("USD"),
});

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    currency: formData.get("currency") || "USD",
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { name, email, password, currency } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .get();

  if (existing) {
    return { error: "Пользователь с таким email уже зарегистрирован" };
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  const now = Date.now();

  await db.insert(users).values({
    id: userId,
    email: normalizedEmail,
    passwordHash,
    name,
    currency,
    createdAt: now,
    updatedAt: now,
  });

  // Automatically create default income & expense categories
  await seedDefaultCategories(userId);

  // Issue session token and cookie
  const token = await signSessionToken({
    userId,
    email: normalizedEmail,
    name,
    currency,
  });
  await setSessionCookie(token);

  redirect("/");
}

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .get();

  if (!user) {
    return { error: "Неверный email или пароль" };
  }

  const passwordMatch = await verifyPassword(password, user.passwordHash);
  if (!passwordMatch) {
    return { error: "Неверный email или пароль" };
  }

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    currency: user.currency,
  });
  await setSessionCookie(token);

  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
