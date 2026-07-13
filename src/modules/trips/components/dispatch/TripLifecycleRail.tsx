import { TRIP_LIFECYCLE_STAGES } from "@/modules/trips/components/dispatch/constants";
import { TripStatus } from "@/shared/domain/enums";
import { cn } from "@/shared/lib";

type TripLifecycleRailProps = {
  status: TripStatus;
};

export function TripLifecycleRail({ status }: TripLifecycleRailProps) {
  const cancelled = status === TripStatus.Cancelled;
  const stages = cancelled
    ? [
        { status: TripStatus.Draft, label: "Planning" },
        { status: TripStatus.Cancelled, label: "Cancelled" }
      ]
    : TRIP_LIFECYCLE_STAGES;

  const activeIndex = stages.findIndex((stage) => stage.status === status);

  return (
    <div className="rounded-card border border-subtle bg-surface p-4 shadow-soft">
      <ol className="grid gap-3 md:grid-cols-3">
        {stages.map((stage, index) => {
          const isActive = stage.status === status;
          // If the trip is fully completed, all stages should be marked as complete (green)
          const isComplete = activeIndex > index || (status === TripStatus.Completed && isActive);

          return (
            <li key={stage.status} className="relative">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-xs font-semibold",
                    isComplete && "bg-success text-inverse",
                    isActive && !isComplete && "bg-accent text-inverse",
                    !isActive && !isComplete && "bg-muted-surface text-muted"
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-body-md font-medium text-primary">{stage.label}</p>
                  <p className="text-caption text-muted">{stage.status}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
