import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[96px] w-full resize-y rounded-input border border-subtle bg-surface px-3 py-2 text-sm text-primary",
        "placeholder:text-muted transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:border-accent/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-danger/50 focus-visible:ring-danger/25",
        className
      )}
      {...props}
    />
  );
}
