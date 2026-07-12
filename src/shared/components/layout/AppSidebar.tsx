"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarBrand } from "@/shared/components/layout/SidebarBrand";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { Button } from "@/shared/components/ui";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED, useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type AppSidebarProps = {
  pathname: string;
  navigation: Parameters<typeof SidebarNav>[0]["items"];
};

export function AppSidebar({ pathname, navigation }: AppSidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useShellStore();
  const width = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-subtle bg-sidebar shadow-soft transition-[width] duration-slow ease-out md:flex"
      style={{ width }}
      aria-label="Primary navigation"
    >
      <div className={cn("flex h-16 items-center border-b border-subtle px-4", sidebarCollapsed && "justify-center px-3")}>
        <SidebarBrand collapsed={sidebarCollapsed} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <SidebarNav items={navigation} pathname={pathname} collapsed={sidebarCollapsed} />
      </div>

      <div className={cn("border-t border-subtle p-3", sidebarCollapsed && "flex justify-center")}>
        <Button
          variant="ghost"
          size={sidebarCollapsed ? "icon" : "sm"}
          className={cn(!sidebarCollapsed && "w-full justify-start")}
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!sidebarCollapsed ? <span className="text-body-sm">Collapse</span> : null}
        </Button>
      </div>
    </aside>
  );
}
