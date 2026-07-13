"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/shared/components/layout/AppSidebar";
import { LoadingOverlay } from "@/shared/components/layout/LoadingOverlay";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { usePermission } from "@/shared/providers/PermissionProvider";
import { useAppStore } from "@/shared/store";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED, useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { navigation } = usePermission();
  const { isGlobalLoading, loadingLabel } = useAppStore();
  const { sidebarCollapsed, setMobileNavOpen } = useShellStore();
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;



  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-page text-primary">


      {/* Floating Sidebar */}
      <div className="absolute bottom-4 left-4 top-4 z-40">
        <AppSidebar pathname={pathname} navigation={navigation} />
      </div>
      <MobileNav pathname={pathname} navigation={navigation} />

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full flex-col transition-[margin-left] duration-300 ease-out md:ml-[104px]">
        <PageContainer>{children}</PageContainer>
      </div>

      <div id="dialog-root" />
      <div id="loading-root" />
      {isGlobalLoading ? <LoadingOverlay label={loadingLabel} /> : null}
    </div>
  );
}
