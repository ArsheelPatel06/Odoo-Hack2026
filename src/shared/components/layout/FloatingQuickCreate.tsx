"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Truck, Car, UserPlus, Receipt, Wrench } from "lucide-react";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { cn } from "@/shared/lib";
import { Tooltip } from "@/shared/components/ui/Overlays";

type ActionItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  permission: string;
};

const actions: ActionItem[] = [
  { id: "expense", label: "Log Expense", href: "/expenses/new", icon: <Receipt className="size-4" />, permission: "expenses.view" },
  { id: "maintenance", label: "Maintenance", href: "/maintenance/new", icon: <Wrench className="size-4" />, permission: "maintenance.view" },
  { id: "driver", label: "Register Driver", href: "/drivers/new", icon: <UserPlus className="size-4" />, permission: "drivers.view" },
  { id: "vehicle", label: "Add Vehicle", href: "/fleet/new", icon: <Car className="size-4" />, permission: "fleet.view" },
  { id: "dispatch", label: "Dispatch Trip", href: "/trips/dispatch", icon: <Truck className="size-4" />, permission: "trips.view" },
];

export function FloatingQuickCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = usePermission();

  const visibleActions = actions.filter((a) => hasPermission(a.permission));

  if (visibleActions.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Menu items */}
      <div
        className={cn(
          "flex flex-col items-end gap-2 transition-all duration-300 ease-out",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        {visibleActions.map((action, i) => (
          <div
            key={action.id}
            className="flex items-center gap-3 transition-all duration-300"
            style={{ transitionDelay: isOpen ? `${i * 40}ms` : "0ms" }}
          >
            <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-semibold text-primary shadow-soft">
              {action.label}
            </span>
            <Link
              href={action.href}
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-subtle bg-surface text-muted shadow-soft transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
              aria-label={action.label}
            >
              {action.icon}
            </Link>
          </div>
        ))}
      </div>

      {/* Main button */}
      <Tooltip content="Quick Create">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex size-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_4px_24px_rgba(79,70,229,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95 dark:bg-indigo-500"
          aria-label="Toggle quick create menu"
        >
          <Plus
            className={cn("size-6 transition-transform duration-300", isOpen && "rotate-45")}
          />
        </button>
      </Tooltip>
    </div>
  );
}
