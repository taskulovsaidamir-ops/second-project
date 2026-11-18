import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { TransactionsClient } from "./transactions-client";

export default async function TransactionsPage() {
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
    })
    .from(categories)
    .where(eq(categories.userId, user.userId));

  // Fetch transactions joined with category data
  const txList = await db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      date: transactions.date,
      description: transactions.description,
      paymentMethod: transactions.paymentMethod,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, user.userId))
    .orderBy(desc(transactions.date));

  return (
    <AppShell user={user} categories={userCategories}>
      <TransactionsClient
        transactions={txList}
        categories={userCategories}
        currency={user.currency}
      />
    </AppShell>
  );
}
