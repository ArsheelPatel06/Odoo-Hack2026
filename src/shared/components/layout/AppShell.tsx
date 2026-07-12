"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/shared/components/layout/AppSidebar";
import { LoadingOverlay } from "@/shared/components/layout/LoadingOverlay";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { TopNav } from "@/shared/components/layout/TopNav";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { useSession } from "@/shared/providers/SessionProvider";
import { useAppStore } from "@/shared/store";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED, useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useSession();
  const { navigation } = usePermission();
  const { isGlobalLoading, loadingLabel } = useAppStore();
  const { sidebarCollapsed, setMobileNavOpen } = useShellStore();
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <div className="h-screen overflow-hidden bg-page text-text">
      <AppSidebar pathname={pathname} navigation={navigation} />
      <MobileNav pathname={pathname} navigation={navigation} />

      <div
        className={cn("flex h-screen min-w-0 flex-col transition-[margin-left] duration-slow ease-out md:ml-[var(--sidebar-width)]")}
        style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
      >
        <TopNav onLogout={handleLogout} />
        <PageContainer>{children}</PageContainer>
      </div>

      <div id="dialog-root" />
      <div id="loading-root" />
      {isGlobalLoading ? <LoadingOverlay label={loadingLabel} /> : null}
    </div>
  );
}
