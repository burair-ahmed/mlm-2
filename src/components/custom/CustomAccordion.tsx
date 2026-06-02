"use client";

import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionContextProps {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
}

const AccordionContext = createContext<AccordionContextProps | null>(null);

export function CustomAccordion({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function CustomAccordionItem({
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CustomAccordionTrigger({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("CustomAccordionTrigger must be used inside CustomAccordion");

  const isOpen = context.activeValue === value;

  const handleToggle = () => {
    context.setActiveValue(isOpen ? null : value);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-base transition-colors duration-300 hover:text-primary ${
        isOpen ? "text-primary text-glow-emerald" : "text-foreground"
      } ${className}`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
          isOpen ? "rotate-180 text-primary" : ""
        }`}
      />
    </button>
  );
}

export function CustomAccordionContent({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("CustomAccordionContent must be used inside CustomAccordion");

  const isOpen = context.activeValue === value;

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[500px] border-t border-white/5 py-4 px-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      } overflow-hidden ${className}`}
    >
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
