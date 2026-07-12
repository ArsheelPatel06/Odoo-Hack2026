import type { InputHTMLAttributes } from "react";
import { inputVariants, type InputVariantProps } from "@/shared/design-system";
import { cn } from "@/shared/lib";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  InputVariantProps & {
    error?: boolean;
  };

export function Input({ className, size, state, error, ...props }: InputProps) {
  return (
    <input
      className={cn(inputVariants({ size, state: error ? "error" : state }), className)}
      {...props}
    />
  );
}
