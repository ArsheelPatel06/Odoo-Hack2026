"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/lib";
import { Activity, ArrowRight, Car, Fuel, Wrench } from "lucide-react";

export type FeedActivityType = "trip_started" | "trip_completed" | "maintenance_started" | "maintenance_completed" | "fuel_logged" | "vehicle_status_changed";

export type FeedActivity = {
  id: string;
  type: FeedActivityType;
  narrative: string;
  timestamp: string;
  href?: string;
  entityId?: string;
};

type OperationsFeedProps = {
  activities: FeedActivity[];
};

const typeStyles: Record<FeedActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  trip_started: { icon: ArrowRight, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  trip_completed: { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  maintenance_started: { icon: Wrench, color: "text-rose-500", bg: "bg-rose-500/10" },
  maintenance_completed: { icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10" },
  fuel_logged: { icon: Fuel, color: "text-violet-500", bg: "bg-violet-500/10" },
  vehicle_status_changed: { icon: Car, color: "text-sky-500", bg: "bg-sky-500/10" },
};

export function OperationsFeed({ activities }: OperationsFeedProps) {
  // We use state to mount the activities with a slight delay for a "real-time" slide-in effect
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-subtle bg-surface shadow-soft">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-primary">Operations Feed</h2>
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col gap-1">
          {activities.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-muted">No recent activity</div>
          ) : (
            activities.map((activity, i) => {
              const style = typeStyles[activity.type];
              const Icon = style.icon;

              const content = (
                <div
                  className={cn(
                    "group flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-muted-surface",
                    !mounted && "translate-y-2 opacity-0",
                    mounted && "translate-y-0 opacity-100"
                  )}
                  style={{ transitionDelay: mounted ? `${i * 50}ms` : "0ms" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110", style.bg, style.color)}>
                      <Icon className="size-3.5" strokeWidth={2.5} />
                    </div>
                    <p className="truncate text-[13px] font-medium text-primary">
                      {/* Highlight specific entity IDs if possible for a richer feel */}
                      {activity.narrative.split(/(\b[A-Z0-9]+-[0-9]+\b)/).map((part, idx) => 
                        part.match(/\b[A-Z0-9]+-[0-9]+\b/) ? (
                          <strong key={idx} className="font-semibold text-primary">{part}</strong>
                        ) : (
                          <span key={idx} className="text-muted">{part}</span>
                        )
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-muted">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </span>
                </div>
              );

              return activity.href ? (
                <Link key={activity.id} href={activity.href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={activity.id}>{content}</div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
