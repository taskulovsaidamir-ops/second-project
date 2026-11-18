"use client";

import React from "react";
import { ModalProvider } from "./modal-context";
import { Navbar } from "./navbar";
import { BottomNav } from "./bottom-nav";
import { QuickAddModal } from "./quick-add-modal";

interface AppShellProps {
  user: {
    userId: string;
    email: string;
    name?: string | null;
    currency: string;
  };
  categories: Array<{
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    icon: string;
    color: string;
  }>;
  children: React.ReactNode;
}

export function AppShell({ user, categories, children }: AppShellProps) {
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-12">
          {children}
        </main>
        <BottomNav />
        <QuickAddModal categories={categories} />
      </div>
    </ModalProvider>
  );
}
