"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { getActiveNavigationItem } from "@/shared/auth";
import { MODULE_ROUTE_LABELS, ROUTE_SEGMENT_LABELS } from "@/shared/domain/constants/shell";
import { usePermission } from "@/shared/providers/PermissionProvider";
import type { BreadcrumbItem } from "@/shared/components/ui/Breadcrumb";

function humanizeSegment(segment: string) {
  if (ROUTE_SEGMENT_LABELS[segment]) {
    return ROUTE_SEGMENT_LABELS[segment];
  }

  if (/^[a-z0-9-]+$/i.test(segment) && segment.includes("-")) {
    return segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  if (/^[a-z]+\d+$/i.test(segment) || /^[a-f0-9-]{8,}$/i.test(segment)) {
    return "Details";
  }

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function useBreadcrumbs(): { items: BreadcrumbItem[]; title: string } {
  const pathname = usePathname();
  const { navigation } = usePermission();

  return useMemo(() => {
    const activeItem = getActiveNavigationItem(pathname, navigation);
    const moduleLabel = activeItem?.label ?? MODULE_ROUTE_LABELS[pathname] ?? "Workspace";
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: "TransitOps", href: "/dashboard" }];

    if (segments.length === 0) {
      return { items: [...items, { label: "Dashboard" }], title: "Dashboard" };
    }

    const moduleRoute = activeItem?.route ?? `/${segments[0]}`;
    items.push({
      label: moduleLabel,
      href: segments.length > 1 ? moduleRoute : undefined
    });

    if (segments.length > 1) {
      const tail = segments.slice(1);
      let currentPath: string = moduleRoute;

      tail.forEach((segment, index) => {
        currentPath = `${currentPath}/${segment}`;
        const isLast = index === tail.length - 1;
        items.push({
          label: humanizeSegment(segment),
          href: isLast ? undefined : currentPath
        });
      });
    }

    const title = items[items.length - 1]?.label ?? "TransitOps";
    return { items, title };
  }, [navigation, pathname]);
}
