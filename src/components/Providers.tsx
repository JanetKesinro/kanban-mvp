"use client";

import { ReactNode } from "react";
import { KanbanProvider } from "@/store/KanbanContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <KanbanProvider>
      {children}
    </KanbanProvider>
  );
}
