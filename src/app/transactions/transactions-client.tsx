"use client";

import React, { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { deleteTransactionAction, updateTransactionAction } from "@/actions/transactions";
import { useModal } from "@/components/modal-context";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Banknote,
  Landmark,
  X,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string;
  color: string;
}

interface TransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: number;
  description: string | null;
  paymentMethod: "CARD" | "CASH" | "TRANSFER";
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

interface TransactionsClientProps {
  transactions: TransactionItem[];
  categories: Category[];
  currency: string;
}

export function TransactionsClient({
  transactions,
  categories,
  currency,
}: TransactionsClientProps) {
  const { openQuickAdd } = useModal();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "MONTH" | "WEEK">("MONTH");

  // Edit Modal State
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editType, setEditType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState<"CARD" | "CASH" | "TRANSFER">("CARD");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredTransactions = useMemo(() => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

    return transactions.filter((t) => {
      // Type filter
      if (typeFilter !== "ALL" && t.type !== typeFilter) return false;

      // Category filter
      if (categoryFilter !== "ALL" && t.categoryId !== categoryFilter) return false;

      // Time filter
      if (timeFilter === "WEEK" && t.date < oneWeekAgo) return false;
      if (timeFilter === "MONTH" && t.date < startOfMonth) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesDesc = (t.description || "").toLowerCase().includes(query);
        const matchesCat = t.categoryName.toLowerCase().includes(query);
        if (!matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter, timeFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Удалить эту запись?")) return;
    try {
      await deleteTransactionAction(id);
    } catch {
      alert("Не удалось удалить транзакцию");
    }
  }

  function openEdit(tx: TransactionItem) {
    setEditingTx(tx);
    setEditAmount(tx.amount.toString());
    setEditType(tx.type);
    setEditCategoryId(tx.categoryId);
    setEditDate(new Date(tx.date).toISOString().split("T")[0]);
    setEditDescription(tx.description || "");
    setEditPaymentMethod(tx.paymentMethod);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTx) return;
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("id", editingTx.id);
    formData.append("type", editType);
    formData.append("amount", editAmount);
    formData.append("categoryId", editCategoryId);
    formData.append("date", editDate);
    formData.append("description", editDescription);
    formData.append("paymentMethod", editPaymentMethod);

    await updateTransactionAction(null, formData);
    setIsUpdating(false);
    setEditingTx(null);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">История операций</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Всего записей: {filteredTransactions.length}
          </p>
        </div>

        <button
          onClick={() => openQuickAdd("EXPENSE")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold shadow-glow-emerald transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить запись</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-3xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по заметке или категории..."
              className="glass-input w-full h-10 pl-10 pr-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="glass-input h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900 text-white">Все типы (Все)</option>
            <option value="EXPENSE" className="bg-slate-900 text-white">Только расходы (-)</option>
            <option value="INCOME" className="bg-slate-900 text-white">Только доходы (+)</option>
          </select>

          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="glass-input h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="MONTH" className="bg-slate-900 text-white">Текущий месяц</option>
            <option value="WEEK" className="bg-slate-900 text-white">Последние 7 дней</option>
            <option value="ALL" className="bg-slate-900 text-white">За всё время</option>
          </select>
        </div>

        {/* Categories Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Категории:
          </span>
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1 rounded-full shrink-0 transition-all cursor-pointer font-medium ${
              categoryFilter === "ALL"
                ? "bg-brand-500 text-white shadow-sm"
                : "glass-input text-slate-500 hover:text-foreground"
            }`}
          >
            Все
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1 rounded-full shrink-0 transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                categoryFilter === c.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "glass-input text-slate-500 hover:text-foreground"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List Cards */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <p className="text-base font-semibold text-slate-400">Транзакций не найдено</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте изменить параметры поиска или добавьте новую операцию кнопкой ниже.
            </p>
            <button
              onClick={() => openQuickAdd("EXPENSE")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow-emerald cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Добавить первую запись
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = getCategoryIcon(tx.categoryIcon);
            const isExpense = tx.type === "EXPENSE";

            return (
              <div
                key={tx.id}
                className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-3 group hover:border-brand-500/40 hover:-translate-y-0.5 transition-all"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm relative"
                    style={{ backgroundColor: tx.categoryColor }}
                  >
                    <Icon className="w-5 h-5" />
                    <span
                      className={`w-3.5 h-3.5 rounded-full absolute -bottom-1 -right-1 flex items-center justify-center text-[9px] font-bold text-white ${
                        isExpense ? "bg-expense" : "bg-brand-500"
                      }`}
                    >
                      {isExpense ? "−" : "+"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate">{tx.categoryName}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/40 dark:bg-slate-800/40 text-slate-400 font-mono">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      {tx.description && (
                        <>
                          <span>•</span>
                          <span className="truncate italic text-slate-500 dark:text-slate-400 max-w-xs">
                            {tx.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p
                      className={`text-base md:text-lg font-bold font-mono tracking-tight tabular-nums ${
                        isExpense ? "text-expense" : "text-brand-500"
                      }`}
                    >
                      {isExpense ? "-" : "+"}
                      {formatCurrency(tx.amount, currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(tx)}
                      title="Редактировать"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-brand-500 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      title="Удалить"
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-expense transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-3xl shadow-glass-dark border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold">Редактировать запись</h2>
              <button
                onClick={() => setEditingTx(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditType("EXPENSE")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editType === "EXPENSE" ? "bg-expense text-white shadow-glow-rose" : "glass-input text-slate-500"
                  }`}
                >
                  Расход
                </button>
                <button
                  type="button"
                  onClick={() => setEditType("INCOME")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editType === "INCOME" ? "bg-brand-500 text-white shadow-glow-emerald" : "glass-input text-slate-500"
                  }`}
                >
                  Доход
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Сумма</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="glass-input w-full h-10 px-3 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Категория</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="glass-input w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  {categories
                    .filter((c) => c.type === editType)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Дата</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="glass-input w-full h-10 px-3 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Оплата</label>
                  <select
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value as any)}
                    className="glass-input w-full h-10 px-3 rounded-xl text-xs cursor-pointer"
                  >
                    <option value="CARD" className="bg-slate-900 text-white">Карта</option>
                    <option value="CASH" className="bg-slate-900 text-white">Наличные</option>
                    <option value="TRANSFER" className="bg-slate-900 text-white">Перевод</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Описание</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="glass-input w-full h-10 px-3 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow-emerald flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить изменения"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
