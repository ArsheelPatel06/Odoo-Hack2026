import type { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-label text-secondary", className)} {...props} />;
}
