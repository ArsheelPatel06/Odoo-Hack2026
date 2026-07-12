"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tripManagementService } from "@/modules/trips";
import { buildDriverComplianceIndicators } from "@/modules/drivers/services/driver-compliance";
import { DRIVER_STATUS_COLORS, VEHICLE_STATUS_COLORS } from "@/shared/domain/constants";
import type { Driver, Vehicle } from "@/shared/domain/models";
import { Badge, Button, Card, Input, PageHeader, StatusBadge } from "@/shared/components/ui";

const toneMap = { success: "success", primary: "primary", warning: "warning", danger: "danger", muted: "muted" } as const;

export function DispatchWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tripId, setTripId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoWeight, setCargoWeight] = useState("500");
  const [plannedDistance, setPlannedDistance] = useState("100");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const vehicles = useMemo(() => {
    void refreshKey;
    return tripManagementService.getDispatchableVehicles();
  }, [refreshKey]);

  const drivers = useMemo(() => {
    void refreshKey;
    return tripManagementService.getDispatchableDrivers();
  }, [refreshKey]);

  const validation = useMemo(() => {
    if (!tripId) {
      return null;
    }

    return tripManagementService.getDispatchValidation(tripId);
  }, [tripId, refreshKey, selectedDriverId, selectedVehicleId]);

  const handleCreateTrip = () => {
    try {
      const trip = tripManagementService.createTripDraft({
        origin,
        destination,
        cargoWeight: Number(cargoWeight),
        plannedDistance: Number(plannedDistance)
      });
      setTripId(trip.id);
      setStep(2);
      toast.success("Trip draft created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create trip.");
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    if (!tripId) {
      return;
    }

    try {
      tripManagementService.assignVehicle(tripId, vehicleId);
      setSelectedVehicleId(vehicleId);
      setRefreshKey((value) => value + 1);
      toast.success("Vehicle assigned.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to assign vehicle.");
    }
  };

  const handleSelectDriver = (driverId: string) => {
    if (!tripId) {
      return;
    }

    try {
      tripManagementService.assignDriver(tripId, driverId);
      setSelectedDriverId(driverId);
      setRefreshKey((value) => value + 1);
      toast.success("Driver assigned.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to assign driver.");
    }
  };

  const handleDispatch = () => {
    if (!tripId) {
      return;
    }

    try {
      tripManagementService.dispatchTrip(tripId);
      toast.success("Trip dispatched.");
      router.push(`/trips/${tripId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Dispatch failed.");
      setRefreshKey((value) => value + 1);
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Dispatch Wizard"
        description="Plan, validate, and dispatch trips through the workflow engine."
      />

      <Card>
        <div className="flex flex-wrap gap-2 text-sm">
          {["Trip Information", "Vehicle Selection", "Driver Selection", "Validation Summary"].map((label, index) => (
            <Badge key={label} tone={step === index + 1 ? "primary" : "muted"}>
              Step {index + 1}: {label}
            </Badge>
          ))}
        </div>
      </Card>

      {step === 1 ? (
        <Card className="grid max-w-2xl gap-4">
          <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Source" />
          <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
          <Input value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} placeholder="Cargo weight (kg)" />
          <Input value={plannedDistance} onChange={(e) => setPlannedDistance(e.target.value)} placeholder="Planned distance (km)" />
          <Button onClick={handleCreateTrip}>Continue to vehicle selection</Button>
        </Card>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              selected={selectedVehicleId === vehicle.id}
              onSelect={() => handleSelectVehicle(vehicle.id)}
            />
          ))}
          <div className="md:col-span-2 flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button disabled={!selectedVehicleId} onClick={() => setStep(3)}>
              Continue to driver selection
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              selected={selectedDriverId === driver.id}
              onSelect={() => handleSelectDriver(driver.id)}
            />
          ))}
          <div className="md:col-span-2 flex gap-2">
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button disabled={!selectedDriverId} onClick={() => setStep(4)}>
              Continue to validation
            </Button>
          </div>
        </div>
      ) : null}

      {step === 4 && validation ? (
        <Card className="grid gap-4">
          {validation.checks.map((check) => (
            <div key={check.key} className="flex items-start gap-3 rounded-md border border-border px-4 py-3">
              <span className={check.passed ? "text-success" : "text-danger"}>{check.passed ? "✓" : "✗"}</span>
              <div>
                <div className="font-medium">{check.label}</div>
                <div className="text-sm text-muted">{check.message}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button disabled={!validation.readyToDispatch} onClick={handleDispatch}>
              Dispatch Trip
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function VehicleCard({ vehicle, selected, onSelect }: { vehicle: Vehicle; selected: boolean; onSelect: () => void }) {
  const tone = toneMap[VEHICLE_STATUS_COLORS[vehicle.status] as keyof typeof toneMap] ?? "muted";

  return (
    <Card className={selected ? "ring-2 ring-primary" : undefined}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold">{vehicle.name}</div>
          <div className="text-sm text-muted">{vehicle.registrationNumber}</div>
        </div>
        <StatusBadge label={vehicle.status} tone={tone} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Type</dt><dd>{vehicle.type}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Capacity</dt><dd>{vehicle.capacity} kg</dd></div>
      </dl>
      <Button className="mt-4 w-full" variant={selected ? "secondary" : "primary"} onClick={onSelect}>
        {selected ? "Selected" : "Select vehicle"}
      </Button>
    </Card>
  );
}

function DriverCard({ driver, selected, onSelect }: { driver: Driver; selected: boolean; onSelect: () => void }) {
  const tone = toneMap[DRIVER_STATUS_COLORS[driver.status] as keyof typeof toneMap] ?? "muted";
  const compliance = buildDriverComplianceIndicators(driver).filter((item) => item.active);

  return (
    <Card className={selected ? "ring-2 ring-primary" : undefined}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold">{driver.name}</div>
          <div className="text-sm text-muted">{driver.licenseNumber}</div>
        </div>
        <StatusBadge label={driver.status} tone={tone} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Safety</dt><dd>★ {driver.safetyScore}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Category</dt><dd>{driver.licenseCategory}</dd></div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-1">
        {compliance.map((item) => (
          <Badge key={item.key} tone={item.tone}>
            {item.label}
          </Badge>
        ))}
      </div>
      <Button className="mt-4 w-full" variant={selected ? "secondary" : "primary"} onClick={onSelect}>
        {selected ? "Selected" : "Select driver"}
      </Button>
    </Card>
  );
}
