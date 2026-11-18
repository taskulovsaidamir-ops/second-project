"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Plus, Tags, PieChart } from "lucide-react";
import { useModal } from "./modal-context";

export function BottomNav() {
  const pathname = usePathname();
  const { openQuickAdd } = useModal();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-surface-border px-3 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around relative">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === "/" ? "text-brand-500 font-bold" : "text-slate-400 hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Главная</span>
        </Link>

        <Link
          href="/transactions"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === "/transactions" ? "text-brand-500 font-bold" : "text-slate-400 hover:text-foreground"
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px]">Записи</span>
        </Link>

        {/* Center elevated floating Quick Add button */}
        <div className="-mt-7">
          <button
            onClick={() => openQuickAdd("EXPENSE")}
            className="w-13 h-13 rounded-2xl bg-brand-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-brand-500/35 border-2 border-white dark:border-slate-900 transition-all cursor-pointer"
            aria-label="Быстрое добавление"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <Link
          href="/categories"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === "/categories" ? "text-brand-500 font-bold" : "text-slate-400 hover:text-foreground"
          }`}
        >
          <Tags className="w-5 h-5" />
          <span className="text-[10px]">Категории</span>
        </Link>

        <Link
          href="/analytics"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            pathname === "/analytics" ? "text-brand-500 font-bold" : "text-slate-400 hover:text-foreground"
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Отчёты</span>
        </Link>
      </div>
    </div>
  );
}
