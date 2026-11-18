import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?reset=1");

  // Fetch all categories for shell
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

  // Fetch all transactions
  const allTx = await db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      date: transactions.date,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, user.userId))
    .orderBy(desc(transactions.date));

  // 1. Group expenses by category
  const expenseCatMap = new Map<string, { name: string; value: number; color: string }>();
  let totalIncome = 0;
  let totalExpense = 0;
  let maxExpense = 0;
  let expenseCount = 0;

  // 2. Monthly cashflow for last 6 months
  const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const cashflowMap = new Map<string, { income: number; expense: number }>();

  // Pre-seed last 6 calendar months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    cashflowMap.set(key, { income: 0, expense: 0 });
  }

  for (const tx of allTx) {
    const txDate = new Date(tx.date);
    const mKey = `${monthNames[txDate.getMonth()]} ${txDate.getFullYear().toString().slice(-2)}`;

    if (tx.type === "INCOME") {
      totalIncome += tx.amount;
      if (cashflowMap.has(mKey)) {
        cashflowMap.get(mKey)!.income += tx.amount;
      }
    } else {
      totalExpense += tx.amount;
      expenseCount++;
      if (tx.amount > maxExpense) maxExpense = tx.amount;

      if (cashflowMap.has(mKey)) {
        cashflowMap.get(mKey)!.expense += tx.amount;
      }

      const existing = expenseCatMap.get(tx.categoryId) || {
        name: tx.categoryName,
        value: 0,
        color: tx.categoryColor,
      };
      existing.value += tx.amount;
      expenseCatMap.set(tx.categoryId, existing);
    }
  }

  const categoryExpenses = Array.from(expenseCatMap.values()).sort((a, b) => b.value - a.value);

  const cashflow = Array.from(cashflowMap.entries()).map(([month, val]) => ({
    month,
    income: val.income,
    expense: val.expense,
  }));

  const avgExpense = expenseCount > 0 ? totalExpense / expenseCount : 0;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <AppShell user={user} categories={userCategories}>
      <AnalyticsClient
        currency={user.currency}
        categoryExpenses={categoryExpenses}
        cashflow={cashflow}
        kpis={{
          totalTransactions: allTx.length,
          avgExpense,
          maxExpense,
          savingsRate,
          totalIncome,
          totalExpense,
        }}
      />
    </AppShell>
  );
}
