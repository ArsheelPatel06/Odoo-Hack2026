import Link from "next/link";
import { icons } from "@/shared/constants";
import { cn } from "@/shared/lib";

type NavigationItem = {
  label: string;
  route: string;
  icon: string;
  permission: string;
  accessLabel?: string;
};

type SidebarNavProps = {
  items: readonly NavigationItem[];
  pathname: string;
  onNavigate?: () => void;
};

export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav className="grid gap-1">
      {items.map((route) => {
        const Icon = icons[route.icon as keyof typeof icons];
        const isActive = pathname === route.route;

        return (
          <Link
            key={`${route.permission}-${route.route}`}
            href={route.route}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-button px-3 text-sm text-muted transition duration-200 hover:bg-muted-surface hover:text-primary",
              isActive && "bg-accent/10 text-primary ring-1 ring-accent/20"
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="min-w-0 flex-1 truncate">{route.label}</span>
            {route.accessLabel ? <span className="text-[11px] text-muted">{route.accessLabel}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
