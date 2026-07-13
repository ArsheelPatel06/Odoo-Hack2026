import Link from "next/link";
import { Users2, Wrench } from "lucide-react";
import { cn } from "@/shared/lib";

export type FleetHealthData = {
  utilization: number;
  maintenanceRatio: number;
  availability: number;
  retiredRatio: number;
  driversOnDuty: number;
  totalDrivers: number;
  tripsCompletedThisWeek: number;
};

type ProgressBarProps = {
  label: string;
  value: number;
  max?: number;
  description?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "violet";
};

const barColorMap = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
};

const barTrackMap = {
  indigo: "bg-indigo-500/10",
  emerald: "bg-emerald-500/10",
  amber: "bg-amber-500/10",
  rose: "bg-rose-500/10",
  violet: "bg-violet-500/10",
};

function HealthBar({ label, value, max = 100, description, color = "indigo" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-primary">{label}</span>
        <span className="text-[13px] font-bold text-primary">{pct}%</span>
      </div>
      {/* Track */}
      <div className={cn("h-2 overflow-hidden rounded-full", barTrackMap[color])}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {description && <p className="text-[11px] text-muted">{description}</p>}
    </div>
  );
}

export function FleetHealthCard({ data }: { data: FleetHealthData }) {
  // Overall health score (weighted average)
  const overall = Math.round(
    (data.availability * 0.4 + (100 - data.maintenanceRatio) * 0.35 + (100 - data.retiredRatio) * 0.25)
  );

  const healthColor =
    overall >= 80 ? "text-emerald-600 dark:text-emerald-400"
    : overall >= 60 ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";

  const healthLabel =
    overall >= 80 ? "Healthy"
    : overall >= 60 ? "Fair"
    : "Degraded";

  return (
    <div className="flex flex-col rounded-[20px] border border-subtle bg-surface shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle px-6 py-5">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Fleet Health</h2>
          <p className="mt-0.5 text-[12px] text-muted">Vehicle availability & maintenance ratio</p>
        </div>
        <Link href="/fleet" className="text-[12px] font-medium text-muted hover:text-primary">
          Details
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Overall score */}
        <div className="flex items-end justify-between rounded-[14px] bg-muted-surface/60 px-5 py-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">Overall health</p>
            <p className={cn("mt-1 text-[52px] font-bold leading-none tracking-[-0.05em]", healthColor)}>
              {overall}
              <span className="text-[24px]">%</span>
            </p>
            <p className={cn("mt-1 text-[12px] font-semibold", healthColor)}>{healthLabel}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-[11px] text-muted">Trips completed</p>
              <p className="text-[20px] font-bold text-primary">{data.tripsCompletedThisWeek}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-[8px] bg-surface px-2.5 py-1.5 shadow-soft">
              <Users2 className="size-3.5 text-indigo-500" strokeWidth={2} />
              <span className="text-[12px] font-semibold text-primary">{data.driversOnDuty}</span>
              <span className="text-[12px] text-muted">/ {data.totalDrivers} drivers</span>
            </div>
          </div>
        </div>

        {/* Metric bars */}
        <div className="space-y-5">
          <HealthBar
            label="Availability"
            value={data.availability}
            color="emerald"
            description={`${data.availability}% of fleet ready for dispatch`}
          />
          <HealthBar
            label="Fleet Utilization"
            value={data.utilization}
            color="indigo"
            description={`${data.utilization}% of vehicles deployed`}
          />
          <HealthBar
            label="In Maintenance"
            value={data.maintenanceRatio}
            color={data.maintenanceRatio > 30 ? "rose" : data.maintenanceRatio > 15 ? "amber" : "violet"}
            description={`${data.maintenanceRatio}% of fleet in shop`}
          />
        </div>

        {/* Maintenance shortcut */}
        {data.maintenanceRatio > 0 && (
          <div className="mt-auto flex items-center justify-between rounded-[12px] border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Wrench className="size-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              <div>
                <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400">Vehicles in shop</p>
                <p className="text-[11px] text-muted">{data.maintenanceRatio}% of fleet undergoing maintenance</p>
              </div>
            </div>
            <Link
              href="/maintenance"
              className="shrink-0 rounded-[8px] bg-amber-500/15 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-500/25 dark:text-amber-400"
            >
              View →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
