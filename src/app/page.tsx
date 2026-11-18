import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "./dashboard-client";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?reset=1");

  // Fetch all user categories for the modal and shell
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

  // Fetch all user transactions to compute stats accurately
  const allTx = await db
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

  // Compute stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let totalIncome = 0;
  let totalExpense = 0;
  let monthIncome = 0;
  let monthExpense = 0;

  const categoryExpenseMap = new Map<string, { name: string; color: string; icon: string; amount: number }>();

  for (const tx of allTx) {
    if (tx.type === "INCOME") {
      totalIncome += tx.amount;
      if (tx.date >= startOfMonth) {
        monthIncome += tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      if (tx.date >= startOfMonth) {
        monthExpense += tx.amount;
        const existing = categoryExpenseMap.get(tx.categoryId) || {
          name: tx.categoryName,
          color: tx.categoryColor,
          icon: tx.categoryIcon,
          amount: 0,
        };
        existing.amount += tx.amount;
        categoryExpenseMap.set(tx.categoryId, existing);
      }
    }
  }

  const totalBalance = totalIncome - totalExpense;
  const monthSavings = monthIncome - monthExpense;

  // Top 4 expense categories for current month
  const topExpenseCategories = Array.from(categoryExpenseMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      color: data.color,
      icon: data.icon,
      amount: data.amount,
      percent: monthExpense > 0 ? Math.round((data.amount / monthExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  const recentTransactions = allTx.slice(0, 5);

  return (
    <AppShell user={user} categories={userCategories}>
      <DashboardClient
        userName={user.name || "Пользователь"}
        currency={user.currency}
        totalBalance={totalBalance}
        monthIncome={monthIncome}
        monthExpense={monthExpense}
        monthSavings={monthSavings}
        recentTransactions={recentTransactions}
        topExpenseCategories={topExpenseCategories}
      />
    </AppShell>
  );
}
