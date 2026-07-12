"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { tripManagementService } from "@/modules/trips";
import { buildDriverComplianceIndicators } from "@/modules/drivers/services/driver-compliance";
import { TRIP_STATUS_COLORS, VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { TripStatus } from "@/shared/domain/enums";
import { Badge, Button, Card, Input, PageHeader, StatusBadge } from "@/shared/components/ui";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

type TripDetailViewProps = {
  tripId: string;
};

export function TripDetailView({ tripId }: TripDetailViewProps) {
  const [detail, setDetail] = useState(() => tripManagementService.getTripDetail(tripId));
  const [showComplete, setShowComplete] = useState(false);
  const [finalOdometer, setFinalOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [revenue, setRevenue] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const refresh = () => setDetail(tripManagementService.getTripDetail(tripId));
  const tripTone = toneMap[TRIP_STATUS_COLORS[detail.trip.status] as keyof typeof toneMap] ?? "muted";

  const handleComplete = () => {
    try {
      tripManagementService.completeTrip(tripId, {
        finalOdometer: Number(finalOdometer),
        fuelConsumed: Number(fuelConsumed),
        revenue: Number(revenue),
        completionNotes
      });
      toast.success("Trip completed. Vehicle and driver released.");
      setShowComplete(false);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete trip.");
    }
  };

  const handleCancel = () => {
    try {
      tripManagementService.cancelTrip(tripId);
      toast.success("Trip cancelled.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to cancel trip.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader title={detail.trip.tripNumber} description={detail.overview.route} />
        <Button asChild variant="secondary">
          <Link href="/trips">Back to registry</Link>
        </Button>
      </div>

      <Card>
        <h2 className="text-base font-semibold">Live Status</h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <InfoRow label="Current Status" value={detail.liveStatus.currentStatus} />
          <InfoRow label="Current Stage" value={detail.liveStatus.currentStage} />
          <InfoRow label="Estimated Completion" value={new Date(detail.liveStatus.estimatedCompletion).toLocaleString()} />
          <InfoRow label="Cargo" value={`${detail.trip.cargoWeight} kg`} />
          <InfoRow label="Distance" value={`${detail.trip.plannedDistance} km`} />
          <InfoRow label="GPS" value={detail.liveStatus.placeholders.gps} />
        </dl>
        <div className="mt-4">
          <StatusBadge label={detail.trip.status} tone={tripTone} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <InfoRow label="Source" value={detail.trip.origin} />
            <InfoRow label="Destination" value={detail.trip.destination} />
            <InfoRow label="Cargo Weight" value={`${detail.trip.cargoWeight} kg`} />
            <InfoRow label="Planned Distance" value={`${detail.trip.plannedDistance} km`} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Vehicle</h2>
          {detail.vehicle ? (
            <dl className="mt-4 grid gap-3 text-sm">
              <InfoRow label="Name" value={detail.vehicle.name} />
              <InfoRow label="Registration" value={detail.vehicle.registrationNumber} />
              <InfoRow label="Capacity" value={`${detail.vehicle.capacity} kg`} />
              <div>
                <StatusBadge
                  label={detail.vehicle.status}
                  tone={toneMap[VEHICLE_STATUS_COLORS[detail.vehicle.status] as keyof typeof toneMap] ?? "muted"}
                />
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">No vehicle assigned.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Driver</h2>
          {detail.driver ? (
            <>
              <dl className="mt-4 grid gap-3 text-sm">
                <InfoRow label="Name" value={detail.driver.name} />
                <InfoRow label="Safety Score" value={`★ ${detail.driver.safetyScore}`} />
                <InfoRow label="License" value={detail.driver.licenseNumber} />
              </dl>
              <div className="mt-3 flex flex-wrap gap-1">
                {buildDriverComplianceIndicators(detail.driver)
                  .filter((item) => item.active)
                  .map((item) => (
                    <Badge key={item.key} tone={item.tone}>
                      {item.label}
                    </Badge>
                  ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">No driver assigned.</p>
          )}
        </Card>
      </div>

      {detail.trip.status === TripStatus.Dispatched ? (
        <Card className="flex flex-wrap gap-2">
          <Button onClick={() => setShowComplete(true)}>Complete Trip</Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel Trip
          </Button>
        </Card>
      ) : null}

      {showComplete ? (
        <Card className="grid max-w-2xl gap-4">
          <h2 className="text-base font-semibold">Complete Trip</h2>
          <Input value={finalOdometer} onChange={(e) => setFinalOdometer(e.target.value)} placeholder="Final odometer" />
          <Input value={fuelConsumed} onChange={(e) => setFuelConsumed(e.target.value)} placeholder="Fuel consumed" />
          <Input value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="Revenue" />
          <Input value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} placeholder="Completion notes" />
          <div className="flex gap-2">
            <Button onClick={handleComplete}>Confirm completion</Button>
            <Button variant="secondary" onClick={() => setShowComplete(false)}>
              Close
            </Button>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-base font-semibold">Timeline</h2>
        <ol className="mt-4 grid gap-3">
          {detail.timeline.map((event) => (
            <li key={event.id} className="rounded-md border border-border px-4 py-3">
              <div className="font-medium">{event.title}</div>
              {event.description ? <div className="mt-1 text-sm text-muted">{event.description}</div> : null}
              <div className="mt-2 text-xs text-muted">{new Date(event.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <PlaceholderPanel title="Fuel" description="Fuel logs will connect in Commit 9." />
        <PlaceholderPanel title="Expenses" description="Expense records will connect in Commit 9." />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </Card>
  );
}
