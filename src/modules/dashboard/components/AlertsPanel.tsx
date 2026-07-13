import { AlertTriangle, Info, BellRing, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { formatDistanceToNow } from "date-fns";

export type AlertSeverity = "critical" | "warning" | "info";

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  href?: string;
};

type AlertsPanelProps = {
  alerts: Alert[];
};

const iconMap = {
  critical: <BellRing className="size-3.5 text-rose-500" strokeWidth={2.5} />,
  warning: <AlertTriangle className="size-3.5 text-amber-500" strokeWidth={2.5} />,
  info: <Info className="size-3.5 text-indigo-500" strokeWidth={2.5} />,
};

const bgMap = {
  critical: "bg-rose-500/10 border-rose-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  info: "bg-indigo-500/10 border-indigo-500/20",
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const critical = alerts.filter(a => a.severity === "critical");
  const warnings = alerts.filter(a => a.severity === "warning");
  const info = alerts.filter(a => a.severity === "info");

  const groups = [
    { title: "Critical Action Required", items: critical, show: critical.length > 0 },
    { title: "Warnings", items: warnings, show: warnings.length > 0 },
    { title: "Information", items: info, show: info.length > 0 },
  ].filter(g => g.show);

  if (alerts.length === 0) {
    return (
      <div className="flex h-full flex-col justify-between rounded-[20px] border border-subtle bg-surface p-6 shadow-soft">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Exceptions & Alerts</h2>
        <div className="flex flex-1 flex-col items-center justify-center pt-6 pb-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
            <Info className="size-5 text-emerald-500" />
          </div>
          <p className="mt-3 text-[14px] font-medium text-primary">All systems nominal</p>
          <p className="text-[12px] text-muted">No active exceptions in the fleet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-subtle bg-surface shadow-soft">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Exceptions</h2>
          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
            {alerts.length} Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted">{group.title}</h3>
              <div className="flex flex-col gap-2.5">
                {group.items.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.href ?? "#"}
                    className={cn(
                      "group relative flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted-surface",
                      bgMap[alert.severity]
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{iconMap[alert.severity]}</div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-primary">{alert.title}</p>
                        <span className="shrink-0 text-[10px] text-muted">
                          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[12px] leading-snug text-muted line-clamp-2">{alert.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-subtle bg-muted-surface/40 px-6 py-4">
        <Link
          href="/compliance"
          className="group flex items-center justify-between text-[13px] font-medium text-muted transition-colors hover:text-primary"
        >
          View all alerts
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
