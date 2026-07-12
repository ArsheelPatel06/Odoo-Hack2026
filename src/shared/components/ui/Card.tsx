import type { HTMLAttributes } from "react";
import { cardVariants, type CardVariantProps } from "@/shared/design-system";
import { cn } from "@/shared/lib";

export type CardProps = HTMLAttributes<HTMLDivElement> & CardVariantProps;

export function Card({ className, padding, interactive, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, interactive }), className)} {...props} />;
}
