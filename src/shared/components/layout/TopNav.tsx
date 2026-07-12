"use client";

import { PanelLeft } from "lucide-react";
import { Breadcrumb } from "@/shared/components/layout/Breadcrumb";
import { CommandPaletteHost } from "@/shared/components/layout/CommandPaletteHost";
import { GlobalSearch, GlobalSearchButton } from "@/shared/components/layout/GlobalSearch";
import { NotificationCenter } from "@/shared/components/layout/NotificationCenter";
import { ProfileMenu } from "@/shared/components/layout/ProfileMenu";
import { QuickActionButton } from "@/shared/components/layout/QuickActionButton";
import { ThemeToggle } from "@/shared/components/layout/ThemeToggle";
import { WorkspaceBadge, WorkspaceSwitcher } from "@/shared/components/layout/WorkspaceSwitcher";
import { Button } from "@/shared/components/ui";
import { useBreadcrumbs } from "@/shared/hooks/use-breadcrumbs";
import { focusGlobalSearch } from "@/shared/components/layout/GlobalSearch";
import { useShellShortcuts } from "@/shared/hooks/use-shell-shortcuts";
import { useShellStore } from "@/shared/store/shell-store";

type TopNavProps = {
  onLogout: () => void;
};

export function TopNav({ onLogout }: TopNavProps) {
  const { items, title } = useBreadcrumbs();
  const { setMobileNavOpen } = useShellStore();

  useShellShortcuts({ onFocusSearch: focusGlobalSearch });

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-subtle bg-page/90 px-4 backdrop-blur md:px-5">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <PanelLeft className="size-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <Breadcrumb items={items} className="hidden sm:flex" />
          <h1 className="truncate text-heading-sm font-semibold text-primary">{title}</h1>
        </div>

        <GlobalSearch />
        <GlobalSearchButton />
        <WorkspaceBadge />
        <QuickActionButton />
        <NotificationCenter />
        <ThemeToggle />
        <WorkspaceSwitcher />
        <ProfileMenu onLogout={onLogout} />
      </header>

      <CommandPaletteHost />
    </>
  );
}
