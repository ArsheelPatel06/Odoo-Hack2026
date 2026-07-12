import { Badge } from "./Badge";

type StatusBadgeProps = {
  label: string;
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
};

export function StatusBadge({ label, tone = "muted" }: StatusBadgeProps) {
  return <Badge tone={tone}>{label}</Badge>;
}
