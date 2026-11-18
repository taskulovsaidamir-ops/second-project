import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const txList = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      type: transactions.type,
      category: categories.name,
      amount: transactions.amount,
      paymentMethod: transactions.paymentMethod,
      description: transactions.description,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, user.userId))
    .orderBy(desc(transactions.date));

  const headers = ["ID", "Дата", "Тип", "Категория", `Сумма (${user.currency})`, "Способ оплаты", "Описание"];
  const rows = txList.map((t) => [
    t.id,
    new Date(t.date).toISOString().split("T")[0],
    t.type === "INCOME" ? "Доход" : "Расход",
    `"${(t.category || "").replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.paymentMethod,
    `"${(t.description || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  // UTF-8 BOM so Excel opens Cyrillic properly
  const bom = "\uFEFF";
  const blob = bom + csvContent;

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="salary_transactions_${Date.now()}.csv"`,
    },
  });
}
