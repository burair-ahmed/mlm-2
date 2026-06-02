"use client";

import React from "react";

export function CustomTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-md">
      <table className={`w-full border-collapse text-left text-sm text-foreground ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function CustomTableHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={`bg-white/5 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>
      {children}
    </thead>
  );
}

export function CustomTableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-white/5 ${className}`}>{children}</tbody>;
}

export function CustomTableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`transition-colors duration-200 hover:bg-white/5 group ${className}`}>
      {children}
    </tr>
  );
}

export function CustomTableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-4 font-semibold text-muted-foreground ${className}`}>
      {children}
    </th>
  );
}

export function CustomTableCell({ 
  children, 
  className = "", 
  colSpan 
}: { 
  children: React.ReactNode; 
  className?: string; 
  colSpan?: number; 
}) {
  return (
    <td 
      colSpan={colSpan}
      className={`px-6 py-4 align-middle text-muted-foreground group-hover:text-foreground transition-colors duration-200 ${className}`}
    >
      {children}
    </td>
  );
}
