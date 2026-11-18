"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "./modal-context";
import { createTransactionAction } from "@/actions/transactions";
import { X, Loader2, Calendar, CreditCard, Banknote, Landmark } from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";

interface CategoryOption {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string;
  color: string;
}

interface QuickAddModalProps {
  categories: CategoryOption[];
}

export function QuickAddModal({ categories }: QuickAddModalProps) {
  const { isQuickAddOpen, quickAddType, closeQuickAdd } = useModal();
  const [type, setType] = useState<"INCOME" | "EXPENSE">(quickAddType);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH" | "TRANSFER">("CARD");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setType(quickAddType);
  }, [quickAddType]);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.some((c) => c.id === selectedCatId)) {
      setSelectedCatId(filteredCategories[0].id);
    }
  }, [type, categories, selectedCatId]);

  if (!isQuickAddOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("amount", amount);
    formData.append("categoryId", selectedCatId);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("paymentMethod", paymentMethod);

    const res = await createTransactionAction(null, formData);
    setIsPending(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setAmount("");
      setDescription("");
      closeQuickAdd();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl shadow-glass-dark border border-white/20 dark:border-white/10 overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                type === "EXPENSE"
                  ? "bg-expense text-white shadow-glow-rose"
                  : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:text-foreground"
              }`}
            >
              Расход
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                type === "INCOME"
                  ? "bg-brand-500 text-white shadow-glow-emerald"
                  : "bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 hover:text-foreground"
              }`}
            >
              Доход
            </button>
          </div>

          <button
            onClick={closeQuickAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-expense text-xs">
              {error}
            </div>
          )}

          {/* Amount input */}
          <div className="text-center py-2">
            <label className="text-xs text-slate-400 block mb-1">Сумма ({type === "EXPENSE" ? "траты" : "дохода"})</label>
            <div className="inline-flex items-center justify-center gap-1">
              <span className="text-2xl font-bold font-mono text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-56 text-4xl md:text-5xl font-extrabold font-mono text-center bg-transparent border-b-2 border-brand-500/40 focus:border-brand-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Выберите категорию
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
              {filteredCategories.map((cat) => {
                const IconComponent = getCategoryIcon(cat.icon);
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-500/15 border-brand-500 text-brand-500 shadow-sm"
                        : "glass-input border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium truncate w-full">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details row: Date & Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Дата</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input w-full h-10 pl-9 pr-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Оплата</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="glass-input w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="CARD" className="bg-slate-900 text-white">Карта (Card)</option>
                <option value="CASH" className="bg-slate-900 text-white">Наличные (Cash)</option>
                <option value="TRANSFER" className="bg-slate-900 text-white">Перевод (Bank)</option>
              </select>
            </div>
          </div>

          {/* Note input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Заметка / Описание (необязательно)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Обед с коллегами"
              className="glass-input w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending || !selectedCatId || !amount}
            className={`w-full h-11 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              type === "EXPENSE"
                ? "bg-expense hover:bg-rose-600 shadow-glow-rose"
                : "bg-brand-500 hover:bg-brand-600 shadow-glow-emerald"
            }`}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Добавить ${type === "EXPENSE" ? "расход" : "доход"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
