import { Radar } from "lucide-react";
import { cn } from "@/shared/lib";

type SidebarBrandProps = {
  collapsed?: boolean;
  className?: string;
};

export function SidebarBrand({ collapsed = false, className }: SidebarBrandProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo mark — indigo/violet gradient */}
      <div className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_2px_12px_rgba(99,102,241,0.4)]">
        <Radar className="size-5 text-white drop-shadow-sm" strokeWidth={2.5} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {!collapsed ? (
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white">
            TransitOps
          </div>
          <div className="truncate text-[11px] font-medium leading-tight text-slate-500">
            Smart Transport Operations
          </div>
        </div>
      ) : null}
    </div>
  );
}
