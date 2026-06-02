"use client";

import React, { createContext, useContext } from "react";

interface TabsContextProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

export function CustomTabs({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function CustomTabsList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-start p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CustomTabsTrigger({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("CustomTabsTrigger must be used within CustomTabs");

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function CustomTabsContent({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("CustomTabsContent must be used within CustomTabs");

  if (context.value !== value) return null;

  return (
    <div className={`mt-4 outline-none animate-in fade-in duration-300 ${className}`}>
      {children}
    </div>
  );
}
