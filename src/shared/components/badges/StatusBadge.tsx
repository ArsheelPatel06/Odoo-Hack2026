type StatusBadgeProps = {
  label: string;
};

export function StatusBadge({ label }: StatusBadgeProps) {
  return <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">{label}</span>;
}
