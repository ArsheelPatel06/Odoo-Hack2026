import { ArrowRight, MapPin, Package, Route } from "lucide-react";
import { AlertCard, Button, Card, Input, Label, MetricCard } from "@/shared/components/ui";

type DispatchRouteStepProps = {
  origin: string;
  destination: string;
  cargoWeight: string;
  plannedDistance: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onCargoWeightChange: (value: string) => void;
  onPlannedDistanceChange: (value: string) => void;
  onContinue: () => void;
};

export function DispatchRouteStep({
  origin,
  destination,
  cargoWeight,
  plannedDistance,
  onOriginChange,
  onDestinationChange,
  onCargoWeightChange,
  onPlannedDistanceChange,
  onContinue
}: DispatchRouteStepProps) {
  const cargo = Number(cargoWeight) || 0;
  const distance = Number(plannedDistance) || 0;
  const canContinue = origin.trim().length > 0 && destination.trim().length > 0 && cargo > 0 && distance > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <Card className="space-y-5">
        <div>
          <h2 className="text-heading-md font-semibold text-primary">Route & cargo</h2>
          <p className="mt-1 text-body-sm text-muted">Define the operational lane before assigning fleet resources.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input id="origin" value={origin} onChange={(e) => onOriginChange(e.target.value)} placeholder="Pune Depot" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              placeholder="Mumbai Hub"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo weight (kg)</Label>
            <Input
              id="cargo"
              type="number"
              value={cargoWeight}
              onChange={(e) => onCargoWeightChange(e.target.value)}
              placeholder="500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distance">Planned distance (km)</Label>
            <Input
              id="distance"
              type="number"
              value={plannedDistance}
              onChange={(e) => onPlannedDistanceChange(e.target.value)}
              placeholder="148"
            />
          </div>
        </div>

        <div className="rounded-card border border-subtle bg-muted-surface/60 p-4">
          <div className="flex flex-wrap items-center gap-3 text-body-md text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-accent" />
              {origin || "Origin"}
            </span>
            <ArrowRight className="size-4 text-muted" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-accent" />
              {destination || "Destination"}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled={!canContinue} onClick={onContinue}>
            Continue to vehicle selection
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        <MetricCard label="Cargo load" value={`${cargo.toLocaleString()} kg`} hint="Used for capacity validation" />
        <MetricCard label="Planned distance" value={`${distance.toLocaleString()} km`} hint="Feeds efficiency analytics" />
        {!canContinue ? (
          <AlertCard
            tone="info"
            title="Complete route details"
            description="Origin, destination, cargo, and distance are required before resource assignment."
          />
        ) : (
          <AlertCard
            tone="success"
            title="Route draft ready"
            description="Next: match this load against available vehicle capacity."
          />
        )}
      </div>
    </div>
  );
}

export function DispatchRoutePreview({ origin, destination, cargoWeight, plannedDistance }: Omit<DispatchRouteStepProps, "onContinue" | "onOriginChange" | "onDestinationChange" | "onCargoWeightChange" | "onPlannedDistanceChange">) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2 text-body-sm text-muted">
        <Route className="size-4" />
        Active lane
      </div>
      <p className="text-heading-sm font-medium text-primary">
        {origin} → {destination}
      </p>
      <div className="flex flex-wrap gap-4 text-body-sm text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Package className="size-4" />
          {Number(cargoWeight).toLocaleString()} kg
        </span>
        <span>{Number(plannedDistance).toLocaleString()} km</span>
      </div>
    </Card>
  );
}
