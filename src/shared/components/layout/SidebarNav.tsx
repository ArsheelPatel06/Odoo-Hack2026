import Link from "next/link";
import { icons } from "@/shared/constants";
import { matchesAppRoute } from "@/shared/auth";
import { Tooltip } from "@/shared/components/ui/Overlays";
import { useBadgeCounts } from "@/shared/hooks/use-badge-counts";
import { cn } from "@/shared/lib";

type NavigationItem = {
  label: string;
  route: string;
  icon: string;
  permission: string;
  group: string;
  accessLabel?: string;
  badgeKey?: "trips" | "maintenance" | "alerts";
};

type SidebarNavProps = {
  items: readonly NavigationItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
  const badges = useBadgeCounts();

  return (
    <nav className="flex flex-col items-center gap-2" aria-label="Sidebar navigation">
      {items.map((route) => {
        const Icon = icons[route.icon as keyof typeof icons];
        if (!Icon) return null;
        
        const isActive = matchesAppRoute(pathname, route.route);
        
        const badgeCount = 
          route.route.startsWith("/trips") && route.route !== "/trips/dispatch" ? badges.trips : 
          route.route.startsWith("/maintenance") ? badges.maintenance : 
          route.route.startsWith("/compliance") ? badges.alerts : 0;

        return (
          <Tooltip key={`${route.permission}-${route.route}`} content={route.label} position="right">
            <Link
              href={route.route}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex size-12 items-center justify-center rounded-2xl transition-all duration-200",
                isActive 
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              )}
            >
              <Icon
                className={cn(
                  "size-[22px]",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )}
              />
              {badgeCount > 0 && (
                <span className="absolute right-2 top-2 size-2 rounded-full bg-lime-500 ring-2 ring-white" />
              )}
            </Link>
          </Tooltip>
        );
      })}
    </nav>
  );
}
