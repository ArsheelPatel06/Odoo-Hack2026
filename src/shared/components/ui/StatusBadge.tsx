import { Badge, type BadgeProps } from "./Badge";

export type StatusTone = NonNullable<BadgeProps["tone"]>;

const STATUS_TONE_MAP: Record<string, StatusTone> = {
  Available: "success",
  "On Trip": "primary",
  "In Shop": "warning",
  Completed: "success",
  Draft: "muted",
  Cancelled: "danger",
  Retired: "muted",
  Suspended: "danger",
  Expired: "danger",
  Active: "warning",
  Dispatched: "primary",
  "Off Duty": "muted"
};

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  status?: string;
};

export function StatusBadge({ label, tone, status }: StatusBadgeProps) {
  const resolvedTone = tone ?? (status ? STATUS_TONE_MAP[status] : undefined) ?? "muted";
  return <Badge tone={resolvedTone}>{label}</Badge>;
}

export function StatusChip({ label, tone, status }: StatusBadgeProps) {
  return <StatusBadge label={label} tone={tone} status={status} />;
}
