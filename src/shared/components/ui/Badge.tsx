import type { HTMLAttributes } from "react";
import { badgeVariants, type BadgeVariantProps } from "@/shared/design-system";
import { cn } from "@/shared/lib";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeVariantProps;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
