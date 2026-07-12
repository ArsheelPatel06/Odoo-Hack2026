import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  [
    "flex w-full bg-surface text-primary placeholder:text-muted",
    "border border-subtle rounded-input px-3 py-2 text-sm",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:border-accent/40",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted-surface"
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-11 text-base"
      },
      state: {
        default: "",
        error: "border-danger/50 focus-visible:ring-danger/25 focus-visible:border-danger/50"
      }
    },
    defaultVariants: {
      size: "md",
      state: "default"
    }
  }
);

export type InputVariantProps = VariantProps<typeof inputVariants>;
