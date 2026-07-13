import { cn } from "@/shared/lib";

export type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral";

export type StatusConfig = {
  label: string;
  variant: StatusVariant;
  pulse?: boolean;
};

const variantStyles: Record<StatusVariant, { bg: string; text: string; border: string }> = {
  success: {
    bg: "bg-[#c6f928]", // Vibrant lime green
    text: "text-slate-900",
    border: "border-transparent",
  },
  warning: {
    bg: "bg-amber-400",
    text: "text-slate-900",
    border: "border-transparent",
  },
  danger: {
    bg: "bg-rose-500",
    text: "text-white",
    border: "border-transparent",
  },
  info: {
    bg: "bg-[#e5d4ff]", // Soft purple
    text: "text-slate-900",
    border: "border-transparent",
  },
  neutral: {
    bg: "bg-white",
    text: "text-slate-500",
    border: "border-slate-200",
  },
};

const STATUS_VARIANT_MAP: Record<string, StatusVariant> = {
  Available: "success",
  "On Trip": "success", // In Transit in the mockup is success
  "In Shop": "warning",
  Completed: "neutral", // Delivered in the mockup is neutral outline
  Draft: "info",
  Cancelled: "danger",
  Retired: "neutral",
  Suspended: "danger",
  Expired: "danger",
  Active: "success",
  Dispatched: "info", // Packed in the mockup is purple/info
  "Off Duty": "neutral",
  "Packed": "info",
  "In Transit": "success",
  "Delivered": "neutral"
};

type StatusBadgeProps = {
  label?: string;
  variant?: StatusVariant;
  tone?: "success" | "warning" | "danger" | "primary" | "muted" | "info" | "neutral";
  status?: string;
  pulse?: boolean;
  className?: string;
  size?: "sm" | "md";
};

// Map old tones to new variants
const toneMap: Record<string, StatusVariant> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  primary: "info",
  info: "info",
  muted: "neutral",
  neutral: "neutral",
};

export function StatusBadge({ label, variant, tone, status, pulse, className, size = "md" }: StatusBadgeProps) {
  const resolvedVariant = variant ?? (tone ? toneMap[tone] : undefined) ?? (status ? STATUS_VARIANT_MAP[status] : undefined) ?? "neutral";
  const styles = variantStyles[resolvedVariant];
  const displayLabel = label ?? status ?? "Unknown";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-bold uppercase tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-[10px]",
        styles.bg,
        styles.text,
        styles.border,
        pulse && "animate-pulse",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

export function StatusChip(props: StatusBadgeProps) {
  return <StatusBadge {...props} />;
}

