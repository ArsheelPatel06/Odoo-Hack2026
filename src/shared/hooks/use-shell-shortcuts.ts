"use client";

import { useEffect } from "react";
import { useShellStore } from "@/shared/store/shell-store";

type UseShellShortcutsOptions = {
  onFocusSearch?: () => void;
};

export function useShellShortcuts({ onFocusSearch }: UseShellShortcutsOptions = {}) {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleSidebar, setMobileNavOpen, setNotificationCenterOpen } =
    useShellStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      if (meta && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
        return;
      }

      if (meta && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        onFocusSearch?.();
        return;
      }

      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setNotificationCenterOpen(false);
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    commandPaletteOpen,
    onFocusSearch,
    setCommandPaletteOpen,
    setMobileNavOpen,
    setNotificationCenterOpen,
    toggleSidebar
  ]);
}
