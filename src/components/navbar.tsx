"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Plus, LogOut, LayoutDashboard, ArrowLeftRight, Tags, PieChart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useModal } from "./modal-context";
import { logoutAction } from "@/actions/auth";

interface NavbarProps {
  user: {
    name?: string | null;
    email: string;
    currency: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const { openQuickAdd } = useModal();

  const navLinks = [
    { href: "/", label: "Дашборд", icon: LayoutDashboard },
    { href: "/transactions", label: "Транзакции", icon: ArrowLeftRight },
    { href: "/categories", label: "Категории", icon: Tags },
    { href: "/analytics", label: "Аналитика", icon: PieChart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20 shadow-glow-emerald group-hover:scale-105 transition-all">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight flex items-center gap-1">
              Salary <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-500 font-mono font-bold">$</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-white/20 dark:border-white/10">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-500 text-white shadow-glow-emerald"
                    : "text-slate-600 dark:text-slate-300 hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Add + Theme Toggle + User */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openQuickAdd("EXPENSE")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold shadow-glow-emerald transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Новая запись</span>
          </button>

          <ThemeToggle />

          {/* User profile dropdown / logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/20 dark:border-white/10">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold leading-none truncate max-w-[120px]">
                {user.name || "Пользователь"}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">{user.currency}</span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Выйти"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/40 dark:bg-slate-800/50 hover:bg-expense/10 hover:text-expense text-slate-500 dark:text-slate-400 border border-white/20 dark:border-white/10 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
