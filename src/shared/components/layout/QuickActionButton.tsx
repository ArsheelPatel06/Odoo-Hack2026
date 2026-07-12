"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { QUICK_ACTIONS } from "@/shared/domain/constants/shell";
import { Button } from "@/shared/components/ui";
import { Dropdown } from "@/shared/components/ui/Overlays";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { canAccessRoute } from "@/shared/auth";
import { useSession } from "@/shared/providers/SessionProvider";

export function QuickActionButton() {
  const router = useRouter();
  const { user } = useSession();
  const { hasPermission } = usePermission();

  const items = QUICK_ACTIONS.filter((action) => {
    if (!user) return false;
    if (!canAccessRoute(user.role, action.route)) return false;

    if (action.route.startsWith("/trips")) return hasPermission("trips.view");
    if (action.route.startsWith("/fleet")) return hasPermission("fleet.view") || hasPermission("fleet.read");
    if (action.route.startsWith("/drivers")) return hasPermission("drivers.view") || hasPermission("drivers.read");
    if (action.route.startsWith("/fuel")) return hasPermission("fuel.view");
    if (action.route.startsWith("/expenses")) return hasPermission("expenses.view");
    if (action.route.startsWith("/maintenance")) return hasPermission("maintenance.view");

    return true;
  }).map((action) => ({
    id: action.id,
    label: action.label,
    onSelect: () => router.push(action.route)
  }));

  if (items.length === 0) {
    return null;
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <Button size="sm" className="hidden gap-2 sm:inline-flex">
          <Plus className="size-4" />
          Quick action
        </Button>
      }
      items={items}
    />
  );
}
