import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { CategoriesClient } from "./categories-client";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?reset=1");

  // Fetch all user categories
  const userCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      type: categories.type,
      icon: categories.icon,
      color: categories.color,
      isDefault: categories.isDefault,
    })
    .from(categories)
    .where(eq(categories.userId, user.userId));

  // Count transactions per category
  const txCounts = await db
    .select({
      categoryId: transactions.categoryId,
      count: sql<number>`count(*)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, user.userId))
    .groupBy(transactions.categoryId);

  const countMap = new Map(txCounts.map((t) => [t.categoryId, t.count]));

  const enrichedCategories = userCategories.map((c) => ({
    ...c,
    transactionCount: countMap.get(c.id) || 0,
  }));

  return (
    <AppShell user={user} categories={userCategories}>
      <CategoriesClient categories={enrichedCategories} />
    </AppShell>
  );
}
