import { Rocket, ShieldCheck } from "lucide-react";
import type { DispatchValidationSummary } from "@/modules/trips/types";
import type { Driver, Trip, Vehicle } from "@/shared/domain/models";
import { DispatchValidationPanel } from "@/modules/trips/components/dispatch/DispatchValidationPanel";
import { AlertCard, Button, Card, StatusBadge } from "@/shared/components/ui";

type DispatchConfirmStepProps = {
  trip: Trip;
  vehicle?: Vehicle;
  driver?: Driver;
  validation: DispatchValidationSummary;
  dispatching?: boolean;
  onBack: () => void;
  onDispatch: () => void;
};

export function DispatchConfirmStep({
  trip,
  vehicle,
  driver,
  validation,
  dispatching,
  onBack,
  onDispatch
}: DispatchConfirmStepProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-heading-md font-semibold text-primary">Release to fleet</h2>
              <p className="mt-1 text-body-sm text-muted">
                Dispatching moves trip, vehicle, and driver into active transit through the workflow engine.
              </p>
            </div>
            <StatusBadge label={trip.status} status={trip.status} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <SummaryTile label="Trip" value={trip.tripNumber} hint={`${trip.origin} → ${trip.destination}`} />
            <SummaryTile label="Vehicle" value={vehicle?.name ?? "Unassigned"} hint={vehicle?.registrationNumber} />
            <SummaryTile label="Driver" value={driver?.name ?? "Unassigned"} hint={driver?.licenseNumber} />
          </div>
        </Card>

        <AlertCard
          tone={validation.readyToDispatch ? "success" : "warning"}
          title={validation.readyToDispatch ? "All systems go" : "Validation required"}
          description={
            validation.readyToDispatch
              ? "Workflow engine will set vehicle and driver to On Trip automatically."
              : "Review failing checks before dispatching this trip."
          }
          action={
            validation.readyToDispatch ? (
              <Button loading={dispatching} onClick={onDispatch}>
                <Rocket className="size-4" />
                Dispatch trip
              </Button>
            ) : undefined
          }
        />

        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button loading={dispatching} disabled={!validation.readyToDispatch} onClick={onDispatch}>
            <ShieldCheck className="size-4" />
            Confirm dispatch
          </Button>
        </div>
      </div>

      <DispatchValidationPanel validation={validation} title="Final validation" />
    </div>
  );
}

function SummaryTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-input border border-subtle bg-muted-surface/50 px-3 py-3">
      <p className="text-caption text-muted">{label}</p>
      <p className="mt-1 text-body-md font-semibold text-primary">{value}</p>
      {hint ? <p className="mt-1 text-caption text-muted">{hint}</p> : null}
    </div>
  );
}
