import Link from "next/link";
import { icons } from "@/shared/constants";
import { matchesAppRoute } from "@/shared/auth";
import { NAV_GROUPS } from "@/shared/domain/constants/shell";
import { Tooltip } from "@/shared/components/ui/Overlays";
import { cn } from "@/shared/lib";

type NavigationItem = {
  label: string;
  route: string;
  icon: string;
  permission: string;
  group: string;
  accessLabel?: string;
};

type SidebarNavProps = {
  items: readonly NavigationItem[];
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ items, pathname, collapsed = false, onNavigate }: SidebarNavProps) {
  const grouped = NAV_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.group === group.id)
  })).filter((group) => group.items.length > 0);

  return (
    <nav className="grid gap-5">
      {grouped.map((group) => (
        <div key={group.id} className="grid gap-1">
          {!collapsed ? (
            <p className="px-3 text-label uppercase tracking-[0.08em] text-muted">{group.label}</p>
          ) : (
            <div className="mx-auto h-px w-8 bg-subtle" aria-hidden />
          )}

          {group.items.map((route) => {
            const Icon = icons[route.icon as keyof typeof icons];
            const isActive = matchesAppRoute(pathname, route.route);

            const link = (
              <Link
                key={`${route.permission}-${route.route}`}
                href={route.route}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex h-11 items-center gap-3 rounded-button px-3 text-body-sm text-muted transition duration-base hover:bg-muted-surface hover:text-primary",
                  collapsed && "justify-center px-0",
                  isActive && "bg-accent/10 text-primary ring-1 ring-accent/20"
                )}
              >
                {isActive ? (
                  <span
                    className={cn(
                      "absolute inset-y-2 left-0 w-1 rounded-full bg-accent transition-all duration-base",
                      collapsed && "inset-y-1.5"
                    )}
                    aria-hidden
                  />
                ) : null}
                {Icon ? <Icon className="size-4 shrink-0" /> : null}
                {!collapsed ? (
                  <>
                    <span className="min-w-0 flex-1 truncate">{route.label}</span>
                    {route.accessLabel ? <span className="text-caption text-muted">{route.accessLabel}</span> : null}
                  </>
                ) : null}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={`${route.permission}-${route.route}`} content={route.label}>
                  {link}
                </Tooltip>
              );
            }

            return link;
          })}
        </div>
      ))}
    </nav>
  );
}
