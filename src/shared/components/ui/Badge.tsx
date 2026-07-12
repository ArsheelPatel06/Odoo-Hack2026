import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
};

const tones = {
  primary: "border-primary/30 bg-primary/15 text-blue-200",
  success: "border-success/30 bg-success/15 text-green-200",
  warning: "border-warning/30 bg-warning/15 text-amber-200",
  danger: "border-danger/30 bg-danger/15 text-red-200",
  muted: "border-border bg-slate-800 text-muted"
};

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
