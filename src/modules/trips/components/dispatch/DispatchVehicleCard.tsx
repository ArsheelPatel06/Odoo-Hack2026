import { Truck } from "lucide-react";
import { VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import type { Vehicle } from "@/shared/domain/models";
import { getVehicleCapacityFit } from "@/modules/trips/components/dispatch/helpers";
import { Button, Card, ProgressBar, StatusBadge } from "@/shared/components/ui";
import { cn } from "@/shared/lib";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

type DispatchVehicleCardProps = {
  vehicle: Vehicle;
  cargoWeight: number;
  selected: boolean;
  onSelect: () => void;
};

export function DispatchVehicleCard({ vehicle, cargoWeight, selected, onSelect }: DispatchVehicleCardProps) {
  const tone = toneMap[VEHICLE_STATUS_COLORS[vehicle.status] as keyof typeof toneMap] ?? "muted";
  const capacity = getVehicleCapacityFit(vehicle, cargoWeight);
  const blocked = capacity.fit === "exceeded";

  return (
    <Card
      interactive
      className={cn(
        "space-y-4",
        selected && "ring-2 ring-accent/40 shadow-elevated",
        blocked && "opacity-80"
      )}
      onClick={blocked ? undefined : onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-input bg-muted-surface text-accent">
            <Truck className="size-5" />
          </span>
          <div>
            <p className="text-heading-sm font-semibold text-primary">{vehicle.name}</p>
            <p className="text-body-sm text-muted">{vehicle.registrationNumber}</p>
          </div>
        </div>
        <StatusBadge label={vehicle.status} tone={tone} />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-body-sm">
        <div>
          <dt className="text-muted">Type</dt>
          <dd className="font-medium text-primary">{vehicle.type}</dd>
        </div>
        <div>
          <dt className="text-muted">Capacity</dt>
          <dd className="font-medium text-primary">{vehicle.capacity.toLocaleString()} kg</dd>
        </div>
      </dl>

      <ProgressBar value={Math.min(capacity.percent, 100)} label={capacity.label} />

      <p
        className={cn(
          "text-body-sm",
          capacity.fit === "exceeded" && "text-danger",
          capacity.fit === "tight" && "text-warning",
          capacity.fit === "ok" && "text-muted"
        )}
      >
        {capacity.message}
      </p>

      <Button
        className="w-full"
        variant={selected ? "secondary" : blocked ? "outline" : "primary"}
        disabled={blocked}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        {blocked ? "Over capacity" : selected ? "Selected" : "Assign vehicle"}
      </Button>
    </Card>
  );
}
