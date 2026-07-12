"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { fleetVehicleService } from "@/modules/fleet";
import { VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import { VehicleType } from "@/shared/domain/enums";
import { Button, Card, Input, PageHeader, Select, StatusBadge } from "@/shared/components/ui";

const statusToneMap = {
  success: "success",
  primary: "primary",
  warning: "warning",
  danger: "danger",
  muted: "muted"
} as const;

type VehicleDetailViewProps = {
  vehicleId: string;
};

export function VehicleDetailView({ vehicleId }: VehicleDetailViewProps) {
  const [detail, setDetail] = useState(() => fleetVehicleService.getVehicleDetail(vehicleId));
  const [name, setName] = useState(detail.vehicle.name);
  const [capacity, setCapacity] = useState(String(detail.vehicle.capacity));
  const [odometer, setOdometer] = useState(String(detail.vehicle.odometerReading));
  const [acquisitionCost, setAcquisitionCost] = useState(String(detail.vehicle.acquisitionCost));

  const tone =
    statusToneMap[VEHICLE_STATUS_COLORS[detail.vehicle.status] as keyof typeof statusToneMap] ?? "muted";

  const refresh = () => {
    setDetail(fleetVehicleService.getVehicleDetail(vehicleId));
  };

  const handleSave = () => {
    try {
      fleetVehicleService.updateVehicle(vehicleId, {
        name,
        capacity: Number(capacity),
        odometerReading: Number(odometer),
        acquisitionCost: Number(acquisitionCost)
      });
      toast.success("Vehicle updated.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update vehicle.");
    }
  };

  const handleArchive = () => {
    try {
      fleetVehicleService.archiveVehicle(vehicleId);
      toast.success("Vehicle archived.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to archive vehicle.");
    }
  };

  const handleRetire = () => {
    try {
      fleetVehicleService.retireVehicle(vehicleId);
      toast.success("Vehicle retired through workflow engine.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to retire vehicle.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader
          title={detail.vehicle.name}
          description={`${detail.vehicle.registrationNumber} · ${detail.vehicle.type}`}
        />
        <Button asChild variant="secondary">
          <Link href="/fleet">Back to registry</Link>
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label={detail.vehicle.status} tone={tone} />
          <span className="text-sm text-muted">Status is workflow-controlled and not manually editable.</span>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold">Overview</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Registration</dt>
              <dd>{detail.vehicle.registrationNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Capacity</dt>
              <dd>{detail.vehicle.capacity.toLocaleString()} kg</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Odometer</dt>
              <dd>{detail.vehicle.odometerReading.toLocaleString()} km</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Acquisition Cost</dt>
              <dd>₹{detail.vehicle.acquisitionCost.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">GPS</dt>
              <dd>{detail.overview.placeholders.gps}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Insurance</dt>
              <dd>{detail.overview.placeholders.insurance}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Registration Expiry</dt>
              <dd>{detail.overview.placeholders.registrationExpiry}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Documents</dt>
              <dd>{detail.overview.placeholders.documents}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-base font-semibold">Edit Vehicle</h2>
          <div className="mt-4 grid gap-3">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Vehicle name" />
            <Select value={detail.vehicle.type} disabled>
              {Object.values(VehicleType).map((vehicleType) => (
                <option key={vehicleType} value={vehicleType}>
                  {vehicleType}
                </option>
              ))}
            </Select>
            <Input value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="Capacity" />
            <Input value={odometer} onChange={(event) => setOdometer(event.target.value)} placeholder="Odometer" />
            <Input
              value={acquisitionCost}
              onChange={(event) => setAcquisitionCost(event.target.value)}
              placeholder="Acquisition cost"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave}>Save changes</Button>
              <Button variant="secondary" onClick={handleRetire}>
                Retire vehicle
              </Button>
              <Button variant="danger" onClick={handleArchive}>
                Archive
              </Button>
            </div>
          </div>
        </Card>
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PlaceholderPanel title="Trip History" description="Trip records will connect in Commit 7." />
        <PlaceholderPanel title="Maintenance History" description="Maintenance records will connect in Commit 8." />
        <PlaceholderPanel title="Fuel Logs" description="Fuel records will connect in Commit 9." />
        <PlaceholderPanel title="Expense History" description="Expense records will connect in Commit 9." />
        <PlaceholderPanel title="Documents" description="Document management placeholder for future integration." />
      </div>
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
