import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

type ToolbarProps = {
  children?: ReactNode;
  className?: string;
};

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-card border border-subtle bg-surface p-2 shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FilterBar({ children, className }: ToolbarProps) {
  return <Toolbar className={cn("p-3", className)}>{children}</Toolbar>;
}
