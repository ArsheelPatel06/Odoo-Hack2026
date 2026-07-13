"use client";

import { PanelLeft } from "lucide-react";
import { Breadcrumb } from "@/shared/components/layout/Breadcrumb";
import { CommandPaletteHost } from "@/shared/components/layout/CommandPaletteHost";
import { GlobalSearch, GlobalSearchButton } from "@/shared/components/layout/GlobalSearch";
import { NotificationCenter } from "@/shared/components/layout/NotificationCenter";
import { ProfileMenu } from "@/shared/components/layout/ProfileMenu";
import { QuickActionButton } from "@/shared/components/layout/QuickActionButton";
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
      <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-3 border-b border-subtle bg-page/95 px-5 backdrop-blur-md md:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <PanelLeft className="size-5" />
        </Button>

        {/* LEFT — breadcrumb + title */}
        <div className="flex min-w-0 shrink-0 flex-col justify-center md:min-w-[220px]">
          <Breadcrumb items={items} className="hidden sm:flex" />
          <h1 className="truncate text-[15px] font-semibold leading-snug tracking-[-0.01em] text-primary">
            {title}
          </h1>
        </div>

        {/* CENTER — prominent global search */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <GlobalSearch className="!block w-full max-w-[480px]" />
        </div>

        {/* RIGHT — actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <GlobalSearchButton />
          <NotificationCenter />
          <QuickActionButton />
          <ProfileMenu onLogout={onLogout} />
        </div>
      </header>

      <CommandPaletteHost />
    </>
  );
}
