import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  [
    "rounded-card border border-subtle bg-card text-primary",
    "shadow-soft transition-all duration-200 ease-out"
  ].join(" "),
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5",
        lg: "p-6"
      },
      interactive: {
        true: "hover:shadow-elevated hover:border-strong/80 cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      padding: "md",
      interactive: false
    }
  }
);

export type CardVariantProps = VariantProps<typeof cardVariants>;
