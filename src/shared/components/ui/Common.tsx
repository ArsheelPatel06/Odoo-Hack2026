import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/shared/lib";

type NotificationBellProps = {
  count?: number;
  onClick?: () => void;
  className?: string;
};

export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className={cn("relative", className)} aria-label="Notifications">
      <Bell className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-inverse">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Button>
  );
}

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const avatarSizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base"
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={src} alt={name} className={cn("rounded-full object-cover", avatarSizes[size], className)} />;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-muted-surface font-medium text-secondary",
        avatarSizes[size],
        className
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

type AvatarStackProps = {
  names: string[];
  max?: number;
  className?: string;
};

export function AvatarStack({ names, max = 4, className }: AvatarStackProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((name) => (
        <Avatar key={name} name={name} size="sm" className="ring-2 ring-surface" />
      ))}
      {overflow > 0 ? (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted-surface text-xs font-medium text-muted ring-2 ring-surface">
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ value, max = 100, label, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-label text-secondary">{label}</p> : null}
      <div className="h-2 overflow-hidden rounded-full bg-muted-surface">
        <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item.id} className="relative rounded-input border border-subtle bg-surface px-4 py-3 animate-fade-in">
          <div className="text-body-md font-medium text-primary">{item.title}</div>
          {item.description ? <p className="mt-1 text-body-sm text-muted">{item.description}</p> : null}
          <p className="mt-2 text-caption text-muted">{item.timestamp}</p>
        </li>
      ))}
    </ol>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-dashed border-subtle px-6 py-12 text-center", className)}>
      {icon ? <div className="mb-4 text-muted">{icon}</div> : null}
      <h3 className="text-heading-sm font-medium text-primary">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-body-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-input bg-muted-surface", className)} />;
}
