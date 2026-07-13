import { Truck } from "lucide-react";
import { cn } from "@/shared/lib";

type SidebarBrandProps = {
  collapsed?: boolean;
  className?: string;
};

export function SidebarBrand({ collapsed = false, className }: SidebarBrandProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded bg-[#FF3366] text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <Truck className="size-5" />
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
