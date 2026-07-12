import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-body-sm text-muted", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors duration-200 hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary" : undefined}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : null}
          </span>
        );
      })}
    </nav>
  );
}
