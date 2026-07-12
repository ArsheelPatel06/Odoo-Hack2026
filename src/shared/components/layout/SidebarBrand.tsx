import { cn } from "@/shared/lib";

type SidebarBrandProps = {
  collapsed?: boolean;
  className?: string;
};

export function SidebarBrand({ collapsed = false, className }: SidebarBrandProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid size-10 shrink-0 place-items-center rounded-card bg-accent text-sm font-bold text-inverse shadow-soft">
        TO
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-primary">TransitOps</div>
          <div className="truncate text-caption text-muted">Operations Console</div>
        </div>
      ) : null}
    </div>
  );
}
