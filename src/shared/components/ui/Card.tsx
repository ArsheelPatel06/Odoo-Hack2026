import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card border border-border bg-surface p-5 shadow-panel", className)} {...props} />;
}
