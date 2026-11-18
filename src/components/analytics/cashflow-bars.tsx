"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CashflowMonth {
  month: string;
  income: number;
  expense: number;
}

interface CashflowBarsProps {
  data: CashflowMonth[];
  currency: string;
}

export function CashflowBars({ data, currency }: CashflowBarsProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Нет данных за выбранные периоды
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const income = (payload[0]?.value as number) || 0;
                const expense = (payload[1]?.value as number) || 0;
                return (
                  <div className="glass-panel p-3 rounded-xl text-xs space-y-1 shadow-lg font-mono">
                    <p className="font-sans font-bold mb-1">{label}</p>
                    <p className="text-brand-500">Доходы: +{formatCurrency(income, currency)}</p>
                    <p className="text-expense">Расходы: -{formatCurrency(expense, currency)}</p>
                    <p className="pt-1 border-t border-white/10 text-slate-300">
                      Сальдо: {formatCurrency(income - expense, currency)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="income" name="Доходы" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Расходы" fill="#f43f5e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
