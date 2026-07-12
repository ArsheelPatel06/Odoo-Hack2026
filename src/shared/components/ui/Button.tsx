import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  asChild?: boolean;
};

const variants = {
  primary: "bg-primary text-white shadow-panel hover:bg-blue-500",
  secondary: "border border-border bg-surface text-text hover:bg-slate-700",
  ghost: "text-muted hover:bg-surface hover:text-text",
  danger: "bg-danger text-white hover:bg-red-500"
};

export function Button({ asChild, className, variant = "primary", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
