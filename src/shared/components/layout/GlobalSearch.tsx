"use client";

import { Search } from "lucide-react";
import { SearchInput } from "@/shared/components/ui/InputVariants";
import { useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type GlobalSearchProps = {
  className?: string;
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const { setCommandPaletteOpen } = useShellStore();

  const openPalette = () => setCommandPaletteOpen(true);

  return (
    <div className={cn("relative hidden min-w-0 flex-1 md:block md:max-w-md", className)}>
      <SearchInput
        id="global-search-input"
        readOnly
        placeholder="Search modules, actions, trips…"
        icon={<Search className="size-4" />}
        className="cursor-pointer"
        onFocus={openPalette}
        onClick={openPalette}
        aria-label="Open global search"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-input border border-subtle bg-muted-surface px-1.5 py-0.5 text-caption text-muted lg:inline">
        ⌘K
      </kbd>
    </div>
  );
}

export function GlobalSearchButton({ className }: GlobalSearchProps) {
  const { setCommandPaletteOpen } = useShellStore();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-button text-muted transition duration-base hover:bg-muted-surface hover:text-primary md:hidden",
        className
      )}
      aria-label="Open search"
      onClick={() => setCommandPaletteOpen(true)}
    >
      <Search className="size-5" />
    </button>
  );
}

export function focusGlobalSearch() {
  document.getElementById("global-search-input")?.focus();
}
