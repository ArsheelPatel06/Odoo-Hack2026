"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { CommandPalette } from "@/shared/components/ui/CommandPalette";
import { KEYBOARD_SHORTCUTS, QUICK_ACTIONS } from "@/shared/domain/constants/shell";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { useSession } from "@/shared/providers/SessionProvider";
import { canAccessRoute } from "@/shared/auth";
import { useShellStore } from "@/shared/store/shell-store";

export function CommandPaletteHost() {
  const router = useRouter();
  const { user } = useSession();
  const { navigation } = usePermission();
  const { resolvedTheme, setTheme } = useTheme();
  const { commandPaletteOpen, setCommandPaletteOpen, toggleSidebar } = useShellStore();

  const items = useMemo(() => {
    if (!user) return [];

    const navigationItems = navigation.map((item) => ({
      id: `nav-${item.route}`,
      label: `Go to ${item.label}`,
      hint: item.route,
      onSelect: () => router.push(item.route)
    }));

    const actionItems = QUICK_ACTIONS.filter((action) => canAccessRoute(user.role, action.route)).map((action) => ({
      id: action.id,
      label: action.label,
      hint: action.hint,
      onSelect: () => router.push(action.route)
    }));

    const systemItems = [
      {
        id: "toggle-theme",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        hint: "Appearance",
        onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark")
      },
      {
        id: "toggle-sidebar",
        label: "Toggle sidebar",
        hint: "Layout",
        onSelect: () => toggleSidebar()
      },
      ...KEYBOARD_SHORTCUTS.map((shortcut) => ({
        id: `shortcut-${shortcut.label}`,
        label: shortcut.label,
        hint: shortcut.keys.join(" "),
        onSelect: () => undefined
      }))
    ];

    return [...navigationItems, ...actionItems, ...systemItems];
  }, [navigation, resolvedTheme, router, setTheme, toggleSidebar, user]);

  return (
    <CommandPalette
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      items={items}
      enableShortcut={false}
    />
  );
}
