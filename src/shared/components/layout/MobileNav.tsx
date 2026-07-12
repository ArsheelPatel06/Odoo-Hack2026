"use client";

import { X } from "lucide-react";
import { SidebarBrand } from "@/shared/components/layout/SidebarBrand";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { Button } from "@/shared/components/ui";
import { useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type MobileNavProps = {
  pathname: string;
  navigation: Parameters<typeof SidebarNav>[0]["items"];
};

export function MobileNav({ pathname, navigation }: MobileNavProps) {
  const { mobileNavOpen, setMobileNavOpen } = useShellStore();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-overlay backdrop-blur-[1px] transition-opacity duration-base md:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden={!mobileNavOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-subtle bg-sidebar p-5 shadow-panel transition-transform duration-slow ease-out md:hidden",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileNavOpen}
        aria-label="Mobile navigation"
      >
        <div className="mb-6 flex items-center justify-between">
          <SidebarBrand />
          <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
            <X className="size-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav items={navigation} pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
        </div>
      </aside>
    </>
  );
}
