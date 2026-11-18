"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction, AuthState } from "@/actions/auth";
import Link from "next/link";
import { Wallet, User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Coins } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-medium flex items-center justify-center gap-2 shadow-glow-emerald transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Создание аккаунта...
        </>
      ) : (
        <>
          Создать аккаунт
          <ArrowRight className="w-5 h-5" />
        </>
      )}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState<AuthState, FormData>(registerAction, {});

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-glass dark:shadow-glass-dark border border-white/20 dark:border-white/10 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4 border border-brand-500/20 shadow-glow-emerald">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Регистрация в Salary</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Создайте аккаунт и начните контролировать доходы и расходы
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-4 rounded-xl bg-expense/10 border border-expense/20 text-expense text-sm flex items-center gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Ваше имя
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                placeholder="Саидамир"
                className="glass-input w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="glass-input w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Пароль (минимум 6 символов)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="glass-input w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Основная валюта
            </label>
            <div className="relative">
              <Coins className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                name="currency"
                defaultValue="USD"
                className="glass-input w-full h-11 pl-11 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all appearance-none bg-transparent cursor-pointer"
              >
                <option value="USD" className="bg-slate-900 text-white">Доллар США ($ USD)</option>
                <option value="UZS" className="bg-slate-900 text-white">Узбекский сум (UZS)</option>
                <option value="RUB" className="bg-slate-900 text-white">Российский рубль (₽ RUB)</option>
                <option value="EUR" className="bg-slate-900 text-white">Евро (€ EUR)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-brand-500 hover:text-brand-600 font-semibold underline underline-offset-4"
          >
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
