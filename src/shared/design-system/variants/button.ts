import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-page",
    "disabled:pointer-events-none disabled:opacity-50",
    "rounded-button"
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-accent text-inverse shadow-soft hover:bg-accent-hover active:scale-[0.98]",
        secondary: "border border-subtle bg-surface text-primary hover:bg-muted-surface hover:border-strong",
        ghost: "text-secondary hover:bg-muted-surface hover:text-primary",
        outline: "border border-strong bg-transparent text-primary hover:bg-muted-surface",
        danger: "bg-danger text-inverse shadow-soft hover:bg-danger/90 active:scale-[0.98]"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
