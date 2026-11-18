"use client";

import React from "react";
import { CategoryDonut } from "@/components/analytics/category-donut";
import { CashflowBars } from "@/components/analytics/cashflow-bars";
import { formatCurrency } from "@/lib/utils";
import { Download, PieChart, BarChart3, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

interface AnalyticsClientProps {
  currency: string;
  categoryExpenses: Array<{ name: string; value: number; color: string }>;
  cashflow: Array<{ month: string; income: number; expense: number }>;
  kpis: {
    totalTransactions: number;
    avgExpense: number;
    maxExpense: number;
    savingsRate: number;
    totalIncome: number;
    totalExpense: number;
  };
}

export function AnalyticsClient({
  currency,
  categoryExpenses,
  cashflow,
  kpis,
}: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      {/* Header and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Финансовая аналитика</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Структура расходов, динамика денежных потоков и ключевые показатели
          </p>
        </div>

        <a
          href="/api/export-csv"
          download
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-700/60 border border-white/20 dark:border-white/10 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-brand-500" />
          <span>Экспорт в CSV</span>
        </a>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Норма сбережений</span>
            <Target className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold font-mono text-brand-500 tabular-nums">
            {kpis.savingsRate}%
          </p>
          <p className="text-[10px] text-slate-400 mt-1">От всех полученных доходов</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Средний чек расхода</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold font-mono text-foreground tabular-nums">
            {formatCurrency(kpis.avgExpense, currency)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">На одну операцию расхода</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Максимальный расход</span>
            <TrendingDown className="w-4 h-4 text-expense" />
          </div>
          <p className="text-xl md:text-2xl font-bold font-mono text-expense tabular-nums">
            {formatCurrency(kpis.maxExpense, currency)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Крупнейшая единичная трата</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Всего операций</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-xl md:text-2xl font-bold font-mono text-foreground tabular-nums">
            {kpis.totalTransactions}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Зафиксировано в Salary</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Structure of Expenses */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-500" />
              <h2 className="text-sm md:text-base font-bold">Распределение расходов</h2>
            </div>
            <span className="text-xs text-slate-400">По категориям</span>
          </div>

          <CategoryDonut data={categoryExpenses} currency={currency} />
        </div>

        {/* Bar Chart: Cashflow Comparison */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" />
              <h2 className="text-sm md:text-base font-bold">Динамика Cashflow</h2>
            </div>
            <span className="text-xs text-slate-400">Доходы vs Расходы</span>
          </div>

          <CashflowBars data={cashflow} currency={currency} />
        </div>
      </div>
    </div>
  );
}
