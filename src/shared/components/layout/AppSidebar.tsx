"use client";

import Link from "next/link";
import { BookOpen, HelpCircle } from "lucide-react";
import { SidebarBrand } from "@/shared/components/layout/SidebarBrand";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { Tooltip } from "@/shared/components/ui/Overlays";

type AppSidebarProps = {
  pathname: string;
  navigation: Parameters<typeof SidebarNav>[0]["items"];
};

export function AppSidebar({ pathname, navigation }: AppSidebarProps) {
  return (
    <aside
      className="flex h-full w-[72px] flex-col items-center rounded-[24px] bg-white py-6 shadow-soft"
      aria-label="Primary navigation"
    >
      {/* Brand header */}
      <div className="mb-8 flex shrink-0 items-center justify-center">
        <SidebarBrand collapsed={true} />
      </div>

      {/* Navigation */}
      <div className="flex-1 w-full px-3">
        <SidebarNav items={navigation} pathname={pathname} collapsed={true} />
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-4 shrink-0 pt-4">
        {/* Support icon */}
        <Tooltip content="Support" position="right">
          <Link href="#" aria-label="Support" className="flex size-10 items-center justify-center rounded-[12px] text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <HelpCircle className="size-5" />
          </Link>
        </Tooltip>

        {/* Docs icon */}
        <Tooltip content="Documentation" position="right">
          <Link href="/docs" aria-label="Documentation" className="flex size-10 items-center justify-center rounded-[12px] text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
            <BookOpen className="size-5" />
          </Link>
        </Tooltip>
      </div>
    </aside>
  );
}
