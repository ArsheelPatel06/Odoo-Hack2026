import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Welcome back";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

type DashboardHeaderProps = {
  totalVehicles: number;
  activeTrips: number;
  healthScore: number;
  userName?: string;
};

export function DashboardHeader({ totalVehicles, activeTrips, healthScore, userName = "Commander" }: DashboardHeaderProps) {
  const firstName = userName.split(" ")[0];
  const greeting = getTimeGreeting();

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      {/* Left: Professional Hero */}
      <div className="space-y-1.5">
        <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-muted">
          {greeting}, {firstName}
        </p>
        <h1 className="text-display-md tracking-[-0.04em] text-primary">
          Fleet Operations
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[13px] font-medium text-muted">
          <span className="text-primary">{getFormattedDate()}</span>
          <span className="h-4 w-px bg-subtle" aria-hidden />
          <span><strong className="font-semibold text-primary">{totalVehicles}</strong> Vehicles</span>
          <span className="h-4 w-px bg-subtle" aria-hidden />
          <span><strong className="font-semibold text-primary">{activeTrips}</strong> Active Trips</span>
          <span className="h-4 w-px bg-subtle" aria-hidden />
          <span>
            <strong className="font-semibold text-primary">{healthScore}%</strong> Fleet Health
          </span>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex shrink-0 pb-1">
        <Button variant="ghost" size="sm" className="gap-2 text-muted hover:text-primary" aria-label="Export report">
          <Download className="size-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
