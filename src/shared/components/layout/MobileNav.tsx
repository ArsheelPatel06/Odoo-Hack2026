"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { cn } from "@/shared/lib";

type MobileNavProps = {
  open: boolean;
  pathname: string;
  navigation: Parameters<typeof SidebarNav>[0]["items"];
  onClose: () => void;
};

export function MobileNav({ open, pathname, navigation, onClose }: MobileNavProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-surface p-5 shadow-panel transition duration-200 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-card bg-primary text-sm font-bold text-white">TO</div>
            <div>
              <div className="text-base font-semibold">TransitOps</div>
              <div className="text-xs text-muted">Operations Console</div>
            </div>
          </div>
          <Button variant="ghost" className="size-10 p-0" onClick={onClose} aria-label="Close navigation">
            <X className="size-5" />
          </Button>
        </div>
        <SidebarNav items={navigation} pathname={pathname} onNavigate={onClose} />
      </aside>
    </>
  );
}
