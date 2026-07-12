import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

type TableToolbarProps = {
  children?: ReactNode;
  className?: string;
};

export function TableToolbar({ children, className }: TableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b border-subtle px-3 py-3", className)}>{children}</div>
  );
}
