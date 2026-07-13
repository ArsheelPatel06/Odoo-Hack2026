"use client";

import Link from "next/link";
import { Car, Navigation, Wrench, UserPlus, Receipt } from "lucide-react";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { cn } from "@/shared/lib";

export function QuickActionsPanel() {
  const { hasPermission } = usePermission();

  const actions = [
    { label: "Add Vehicle", href: "/fleet/new", icon: Car, permission: "fleet.edit", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Log Expense", href: "/expenses/new", icon: Receipt, permission: "expenses.edit", color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Driver", href: "/drivers/new", icon: UserPlus, permission: "drivers.edit", color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Maintenance", href: "/maintenance/new", icon: Wrench, permission: "maintenance.edit", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const visibleActions = actions.filter((a) => hasPermission(a.permission));

  if (!hasPermission("trips.edit") && visibleActions.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* Primary Dominant Action */}
      {hasPermission("trips.edit") && (
        <Link
          href="/trips/dispatch"
          className="group relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px] bg-indigo-600 p-8 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-white/20 text-white shadow-inner backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
              <Navigation className="size-6" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <h3 className="text-[18px] font-bold tracking-tight text-white">Dispatch Trip</h3>
              <p className="mt-1 text-[13px] font-medium text-indigo-100">Create new routing assignment</p>
            </div>
          </div>
        </Link>
      )}

      {/* Secondary Actions Grid */}
      {visibleActions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {visibleActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-2 rounded-[16px] border border-subtle bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-muted-surface hover:shadow-elevated"
              >
                <div className={cn("flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-110", action.bg, action.color)}>
                  <Icon className="size-4.5" strokeWidth={2.5} />
                </div>
                <span className="text-[12px] font-semibold text-primary">{action.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
