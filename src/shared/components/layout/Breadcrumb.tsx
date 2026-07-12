"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-xs text-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
            {index > 0 ? <ChevronRight className="size-3 shrink-0" /> : null}
            {item.href && !isLast ? (
              <Link href={item.href} className="truncate transition hover:text-text">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "truncate font-medium text-text" : "truncate"}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
