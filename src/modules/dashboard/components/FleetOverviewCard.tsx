import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { VehicleStatus } from "@/shared/domain/enums";

type FleetStatusData = {
  available: number;
  onTrip: number;
  inShop: number;
  retired: number;
  total: number;
};

type FleetOverviewCardProps = {
  fleetStatus: FleetStatusData;
};

const statusConfig = {
  [VehicleStatus.Available]: { label: "Available", bg: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
  [VehicleStatus.OnTrip]: { label: "Running", bg: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400" },
  [VehicleStatus.InShop]: { label: "Maintenance", bg: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  [VehicleStatus.Retired]: { label: "Retired", bg: "bg-slate-400", text: "text-slate-600 dark:text-slate-400" },
};

export function FleetOverviewCard({ fleetStatus }: FleetOverviewCardProps) {
  const breakdown = [
    { status: VehicleStatus.Available, count: fleetStatus.available },
    { status: VehicleStatus.OnTrip, count: fleetStatus.onTrip },
    { status: VehicleStatus.InShop, count: fleetStatus.inShop },
    { status: VehicleStatus.Retired, count: fleetStatus.retired },
  ];

  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-subtle bg-surface shadow-soft">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Fleet</h2>
          <Car className="size-4 text-muted" />
        </div>

        <div className="mt-6 flex items-end gap-2">
          <span className="text-[52px] font-bold leading-none tracking-[-0.04em] text-primary">
            {fleetStatus.total}
          </span>
          <span className="mb-2 text-[14px] font-medium text-muted">Vehicles</span>
        </div>

        {/* Visual Stack Bar */}
        <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-muted-surface">
          {fleetStatus.total > 0 && breakdown.map((item) => (
            <div
              key={item.status}
              className={`${statusConfig[item.status].bg} transition-all duration-700`}
              style={{ width: `${(item.count / fleetStatus.total) * 100}%` }}
              title={`${statusConfig[item.status].label}: ${item.count}`}
            />
          ))}
        </div>

        {/* Mini stats */}
        <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 sm:grid-cols-4">
          {breakdown.map((item) => {
            const config = statusConfig[item.status];
            return (
              <div key={item.status} className="flex flex-col">
                <span className="text-[20px] font-bold text-primary">{item.count}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`size-1.5 rounded-full ${config.bg}`} />
                  <span className={`text-[12px] font-medium ${config.text}`}>{config.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-subtle bg-muted-surface/40 px-6 py-4">
        <Link
          href="/fleet"
          className="group flex items-center justify-between text-[13px] font-medium text-muted transition-colors hover:text-primary"
        >
          Manage full registry
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
