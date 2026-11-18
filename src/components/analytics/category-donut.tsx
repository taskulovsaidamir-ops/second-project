"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryDonutProps {
  data: CategoryData[];
  currency: string;
}

export function CategoryDonut({ data, currency }: CategoryDonutProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        Нет данных о расходах для отображения
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as CategoryData;
                  const percent = Math.round((item.value / total) * 100);
                  return (
                    <div className="glass-panel p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                      <p className="font-bold">{item.name}</p>
                      <p className="font-mono text-expense font-semibold">
                        {formatCurrency(item.value, currency)} ({percent}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-400 font-medium">Всего расходов</span>
          <span className="text-base font-extrabold font-mono text-expense">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>

      {/* Legend chips */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate text-slate-600 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-mono font-bold shrink-0">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
