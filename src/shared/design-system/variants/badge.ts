import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
  {
    variants: {
      tone: {
        default: "border-subtle bg-muted-surface text-secondary",
        primary: "border-accent/20 bg-accent/10 text-accent",
        success: "border-success/20 bg-success/10 text-success",
        warning: "border-warning/20 bg-warning/10 text-warning",
        danger: "border-danger/20 bg-danger/10 text-danger",
        info: "border-info/20 bg-info/10 text-info",
        muted: "border-subtle bg-muted-surface text-muted"
      }
    },
    defaultVariants: {
      tone: "default"
    }
  }
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
