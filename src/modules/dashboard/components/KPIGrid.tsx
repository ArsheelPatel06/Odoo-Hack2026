import { Activity, Car, Fuel, Route, TrendingUp } from "lucide-react";
import { cn } from "@/shared/lib";

export type KPIData = {
  fleetUtilization: number;
  tripsToday: number;
  activeTrips: number;
  fuelCostToday: number;
  vehicleHealth: number;
};

export function KPIGrid({ data }: { data: KPIData }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Fleet Utilization (Sparkline style) */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-subtle bg-surface p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Fleet Utilization</p>
            <div className="flex items-baseline gap-2">
              <p className="text-[36px] font-bold tracking-[-0.04em] text-primary">{data.fleetUtilization}%</p>
              <span className="flex items-center gap-0.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3" />
                {data.fleetUtilization > 80 ? "+12%" : "+4%"}
              </span>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Activity className="size-4" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Mock Sparkline (CSS gradient bars) */}
        <div className="mt-4 flex h-8 items-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
          {[40, 30, 50, 45, 70, 65, 80, 94].map((h, i) => (
            <div
              key={i}
              className="w-full rounded-t-sm bg-indigo-500"
              style={{ height: `${h}%`, opacity: i === 7 ? 1 : 0.2 + (i * 0.1) }}
            />
          ))}
        </div>
      </div>

      {/* 2. Trips Today (Split metric style) */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-subtle bg-surface p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Trips Today</p>
            <p className="text-[36px] font-bold tracking-[-0.04em] text-primary">{data.tripsToday}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Route className="size-4" strokeWidth={2.5} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted-surface px-3 py-2">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-sky-500" />
            In Transit
          </span>
          <span className="text-[13px] font-bold text-primary">{data.activeTrips}</span>
        </div>
      </div>

      {/* 3. Fuel Cost (Large currency style) */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-subtle bg-surface p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Fuel Cost (Today)</p>
            <p className="text-[36px] font-bold tracking-[-0.04em] text-primary">
              <span className="text-[20px] font-semibold text-muted">₹</span>
              {data.fuelCostToday.toLocaleString()}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Fuel className="size-4" strokeWidth={2.5} />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-muted">
          Based on {Math.floor(data.fuelCostToday / 95)} liters logged
        </p>
      </div>

      {/* 4. Vehicle Health (Score + Badge style) */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-subtle bg-surface p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Vehicle Health</p>
            <div className="flex items-center gap-3">
              <p className={cn(
                "text-[36px] font-bold tracking-[-0.04em]",
                data.vehicleHealth >= 90 ? "text-emerald-600 dark:text-emerald-400" :
                data.vehicleHealth >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"
              )}>
                {data.vehicleHealth}%
              </p>
              <span className={cn(
                "rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider",
                data.vehicleHealth >= 90 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                data.vehicleHealth >= 70 ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
              )}>
                {data.vehicleHealth >= 90 ? "Healthy" : data.vehicleHealth >= 70 ? "Fair" : "Degraded"}
              </span>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Car className="size-4" strokeWidth={2.5} />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-muted">
          Aggregate score across active fleet
        </p>
      </div>
    </div>
  );
}
