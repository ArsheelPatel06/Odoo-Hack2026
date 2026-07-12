"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Moon, PanelLeft, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Breadcrumb } from "@/shared/components/layout/Breadcrumb";
import { LoadingOverlay } from "@/shared/components/layout/LoadingOverlay";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { ProfileMenu } from "@/shared/components/layout/ProfileMenu";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { Button } from "@/shared/components/ui";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { useSession } from "@/shared/providers/SessionProvider";
import { useAppStore } from "@/shared/store";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useSession();
  const { navigation } = usePermission();
  const { isGlobalLoading, loadingLabel } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeItem = navigation.find((item) => item.route === pathname);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-page text-text">
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-subtle bg-sidebar p-5 shadow-panel md:block">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-card bg-accent text-sm font-bold text-inverse">TO</div>
          <div>
            <div className="text-base font-semibold">TransitOps</div>
            <div className="text-xs text-muted">Operations Console</div>
          </div>
        </div>

        <div className="mt-8">
          <SidebarNav items={navigation} pathname={pathname} />
        </div>
      </aside>

      <MobileNav
        open={mobileNavOpen}
        pathname={pathname}
        navigation={navigation}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="min-h-screen md:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-subtle bg-page/90 px-5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              className="size-10 p-0 md:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <PanelLeft className="size-5" />
            </Button>
            <div className="min-w-0">
              <Breadcrumb
                items={[
                  { label: "Application", href: "/dashboard" },
                  { label: activeItem?.label ?? "Workspace" }
                ]}
              />
              <div className="truncate text-sm font-medium text-text">{activeItem?.label ?? "TransitOps"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="size-10 p-0" aria-label="Notifications placeholder">
              <Bell className="size-5" />
            </Button>
            <Button
              variant="ghost"
              className="size-10 p-0"
              aria-label="Theme toggle placeholder"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <ProfileMenu onLogout={handleLogout} />
          </div>
        </header>

        <main className="p-5">{children}</main>
      </div>

      <div id="dialog-root" />
      <div id="loading-root" />
      {isGlobalLoading ? <LoadingOverlay label={loadingLabel} /> : null}
    </div>
  );
}
