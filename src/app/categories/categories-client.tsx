"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, X, Loader2, AlertCircle } from "lucide-react";
import { getCategoryIcon, AVAILABLE_ICONS, AVAILABLE_COLORS } from "@/lib/icons";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/actions/categories";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string;
  color: string;
  isDefault: boolean;
  transactionCount?: number;
}

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [tab, setTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [icon, setIcon] = useState("wallet");
  const [color, setColor] = useState("#10b981");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = categories.filter((c) => c.type === tab);

  function openCreateModal(initialType: "INCOME" | "EXPENSE" = tab) {
    setEditingCategory(null);
    setName("");
    setType(initialType);
    setIcon("wallet");
    setColor(initialType === "EXPENSE" ? "#f43f5e" : "#10b981");
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(cat: Category) {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setIcon(cat.icon);
    setColor(cat.color);
    setError(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    if (editingCategory) {
      formData.append("id", editingCategory.id);
    }
    formData.append("name", name);
    formData.append("type", type);
    formData.append("icon", icon);
    formData.append("color", color);

    const res = editingCategory
      ? await updateCategoryAction(null, formData)
      : await createCategoryAction(null, formData);

    setIsPending(false);
    if (res?.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Удалить категорию «${cat.name}»?`)) return;
    try {
      const res = await deleteCategoryAction(cat.id);
      if (res?.error) {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message || "Ошибка при удалении");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Категории</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Настройте категории расходов и доходов под свой бюджет
          </p>
        </div>

        <button
          onClick={() => openCreateModal(tab)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold shadow-glow-emerald transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить категорию</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1.5 rounded-2xl glass-panel">
        <button
          onClick={() => setTab("EXPENSE")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === "EXPENSE"
              ? "bg-expense text-white shadow-glow-rose"
              : "text-slate-500 hover:text-foreground"
          }`}
        >
          Категории расходов ({categories.filter((c) => c.type === "EXPENSE").length})
        </button>
        <button
          onClick={() => setTab("INCOME")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === "INCOME"
              ? "bg-brand-500 text-white shadow-glow-emerald"
              : "text-slate-500 hover:text-foreground"
          }`}
        >
          Категории доходов ({categories.filter((c) => c.type === "INCOME").length})
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filtered.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <div
              key={cat.id}
              className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-3 group hover:border-brand-500/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{cat.name}</p>
                  <span className="text-[11px] text-slate-400">
                    {cat.transactionCount || 0} операций
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(cat)}
                  title="Редактировать"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-brand-500 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  title="Удалить"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-expense transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-3xl shadow-glass-dark border border-white/20 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold">
                {editingCategory ? "Редактировать категорию" : "Новая категория"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-expense text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Type toggle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Тип</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("EXPENSE")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === "EXPENSE"
                        ? "bg-expense text-white shadow-glow-rose"
                        : "glass-input text-slate-500"
                    }`}
                  >
                    Расход
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("INCOME")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === "INCOME"
                        ? "bg-brand-500 text-white shadow-glow-emerald"
                        : "glass-input text-slate-500"
                    }`}
                  >
                    Доход
                  </button>
                </div>
              </div>

              {/* Name input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Название</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Такси или Премия"
                  className="glass-input w-full h-10 px-3 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Color picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Цвет плашки</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                        color === c ? "ring-2 ring-offset-2 ring-brand-500 scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Иконка</label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 glass-input rounded-xl">
                  {AVAILABLE_ICONS.map((icName) => {
                    const Ic = getCategoryIcon(icName);
                    const isSelected = icon === icName;
                    return (
                      <button
                        key={icName}
                        type="button"
                        onClick={() => setIcon(icName)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-500 text-white shadow-glow-emerald"
                            : "hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 hover:text-foreground"
                        }`}
                      >
                        <Ic className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold shadow-glow-emerald flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить категорию"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
