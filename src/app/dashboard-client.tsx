"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { useModal } from "@/components/modal-context";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  ArrowRight,
  PieChart,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface RecentTx {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: number;
  description: string | null;
  paymentMethod: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

interface TopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
  percent: number;
}

interface DashboardClientProps {
  userName: string;
  currency: string;
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  monthSavings: number;
  recentTransactions: RecentTx[];
  topExpenseCategories: TopCategory[];
}

export function DashboardClient({
  userName,
  currency,
  totalBalance,
  monthIncome,
  monthExpense,
  monthSavings,
  recentTransactions,
  topExpenseCategories,
}: DashboardClientProps) {
  const { openQuickAdd } = useModal();

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Привет, <span className="text-brand-500">{userName}</span> 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Вот сводка вашего финансового баланса за текущий месяц
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openQuickAdd("EXPENSE")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-expense/10 hover:bg-expense/20 text-expense text-xs font-bold border border-expense/20 transition-all cursor-pointer"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Расход
          </button>
          <button
            onClick={() => openQuickAdd("INCOME")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold border border-brand-500/20 transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Доход
          </button>
        </div>
      </div>

      {/* COMPACT HERO WIDGET: Main Balance & Quick Monthly Stats */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden border border-white/30 dark:border-white/10 shadow-glass dark:shadow-glass-dark">
        {/* Ambient subtle backglow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Общий доступный баланс
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-500 border border-brand-500/30 font-mono">
              {currency}
            </span>
          </div>

          {/* Large Monospace Balance */}
          <div className="mb-6">
            <p className="text-4xl md:text-5xl font-black font-mono tracking-tight tabular-nums text-foreground">
              {formatCurrency(totalBalance, currency)}
            </p>
          </div>

          {/* Monthly Sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            {/* Income this month */}
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Доходы за месяц</p>
                <p className="text-base font-bold font-mono text-brand-500 tabular-nums">
                  +{formatCurrency(monthIncome, currency)}
                </p>
              </div>
            </div>

            {/* Expenses this month */}
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-expense/15 text-expense flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Расходы за месяц</p>
                <p className="text-base font-bold font-mono text-expense tabular-nums">
                  -{formatCurrency(monthExpense, currency)}
                </p>
              </div>
            </div>

            {/* Net Savings */}
            <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Чистая разница</p>
                <p
                  className={`text-base font-bold font-mono tabular-nums ${
                    monthSavings >= 0 ? "text-sky-500" : "text-expense"
                  }`}
                >
                  {monthSavings >= 0 ? "+" : ""}
                  {formatCurrency(monthSavings, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions (Left) + Top Categories Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Transactions: 3 cols on large screen */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>Последние операции</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-400">
                {recentTransactions.length}
              </span>
            </h2>
            <Link
              href="/transactions"
              className="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1 group"
            >
              Смотреть все
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-400">Пока нет записей</p>
                <button
                  onClick={() => openQuickAdd("EXPENSE")}
                  className="inline-flex items-center gap-1 text-xs text-brand-500 font-bold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить первую трату
                </button>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const Icon = getCategoryIcon(tx.categoryIcon);
                const isExpense = tx.type === "EXPENSE";
                return (
                  <div
                    key={tx.id}
                    className="glass-panel p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-brand-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: tx.categoryColor }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-bold truncate">{tx.categoryName}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {formatDate(tx.date)} {tx.description ? `• ${tx.description}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm md:text-base font-bold font-mono tabular-nums ${
                          isExpense ? "text-expense" : "text-brand-500"
                        }`}
                      >
                        {isExpense ? "-" : "+"}
                        {formatCurrency(tx.amount, currency)}
                      </p>
                      <span className="text-[10px] text-slate-400">{tx.paymentMethod}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Expense Categories Breakdown: 2 cols on large screen */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-500" />
              <span>Топ расходов за месяц</span>
            </h2>
            <Link href="/analytics" className="text-xs text-brand-500 hover:underline">
              Отчёт →
            </Link>
          </div>

          <div className="glass-panel p-5 rounded-3xl space-y-4">
            {topExpenseCategories.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                В этом месяце расходов ещё не зафиксировано
              </p>
            ) : (
              topExpenseCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: cat.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold truncate max-w-[130px]">{cat.name}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-expense">
                          {formatCurrency(cat.amount, currency)}
                        </span>{" "}
                        <span className="text-[10px] text-slate-400">({cat.percent}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percent}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
