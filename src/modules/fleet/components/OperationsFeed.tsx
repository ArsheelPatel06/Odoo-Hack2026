import { Sparkles, Activity, AlertTriangle, TrendingUp, UserCheck } from "lucide-react";
import { cn } from "@/shared/lib";

type InsightType = "efficiency" | "maintenance" | "revenue" | "performance";

type Insight = {
  id: string;
  vehicle: string;
  type: InsightType;
  title: string;
  value: string;
  recommendation?: string;
};

const INSIGHT_CONFIG: Record<InsightType, { icon: React.ElementType; color: string; bg: string }> = {
  efficiency: { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
  maintenance: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  revenue: { icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
  performance: { icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
};

const insights: Insight[] = [
  {
    id: "1",
    vehicle: "Van-03",
    type: "efficiency",
    title: "Most efficient vehicle",
    value: "4.3 km/L",
  },
  {
    id: "2",
    vehicle: "Truck-14",
    type: "maintenance",
    title: "Will require maintenance within 180 km",
    value: "Maintenance Due",
    recommendation: "Schedule after TRP-041",
  },
  {
    id: "3",
    vehicle: "Vehicle-08",
    type: "revenue",
    title: "Highest revenue generated",
    value: "₹12,420",
  },
  {
    id: "4",
    vehicle: "Driver Alex",
    type: "performance",
    title: "Completed trips today",
    value: "8 trips",
  }
];

export function OperationsFeed() {
  return (
    <div className="flex flex-col gap-4">
      {/* Insights header removed per request */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight) => {
          const config = INSIGHT_CONFIG[insight.type];
          const Icon = config.icon;

          return (
            <div key={insight.id} className="group relative overflow-hidden rounded-[20px] bg-white p-5 shadow-soft transition-all hover:shadow-md hover:-translate-y-1">
              {/* Highlight bar */}
              <div className={cn("absolute left-0 top-0 h-full w-1", config.bg.replace("bg-", "bg-").replace("-50", "-500"))} />
              
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-900">{insight.vehicle}</span>
                    <div className={cn("flex size-8 items-center justify-center rounded-full", config.bg)}>
                      <Icon className={cn("size-4", config.color)} />
                    </div>
                  </div>
                  
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-4">
                    {insight.title}
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-slate-900">
                    {insight.value}
                  </p>
                  {insight.recommendation && (
                    <div className="mt-2 rounded-md bg-slate-50 p-2 text-[11px] font-semibold text-slate-500 border border-slate-100">
                      Recommended: {insight.recommendation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
