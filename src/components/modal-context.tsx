"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isQuickAddOpen: boolean;
  quickAddType: "INCOME" | "EXPENSE";
  openQuickAdd: (type?: "INCOME" | "EXPENSE") => void;
  closeQuickAdd: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isQuickAddOpen: false,
  quickAddType: "EXPENSE",
  openQuickAdd: () => {},
  closeQuickAdd: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const openQuickAdd = (initialType?: "INCOME" | "EXPENSE") => {
    if (initialType) setType(initialType);
    setIsOpen(true);
  };

  const closeQuickAdd = () => setIsOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isQuickAddOpen: isOpen,
        quickAddType: type,
        openQuickAdd,
        closeQuickAdd,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
