"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fleetVehicleService } from "@/modules/fleet";
import { fuelManagementService } from "@/modules/financial";
import { tripManagementService } from "@/modules/trips";
import { TripStatus } from "@/shared/domain/enums";
import { Button, Card, Input, Select } from "@/shared/components/ui";

export function FuelCreateForm() {
  const router = useRouter();
  const [tripId, setTripId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [fuelQuantity, setFuelQuantity] = useState("");
  const [fuelCost, setFuelCost] = useState("");
  const [odometerReading, setOdometerReading] = useState("");
  const [fuelStation, setFuelStation] = useState("");
  const [notes, setNotes] = useState("");
  const [loggedAt, setLoggedAt] = useState("");

  const completedTrips = useMemo(
    () =>
      tripManagementService.listTrips({
        status: TripStatus.Completed,
        pagination: { page: 1, pageSize: 50 }
      }).items,
    []
  );

  const handleTripChange = (nextTripId: string) => {
    setTripId(nextTripId);
    const trip = completedTrips.find((item) => item.id === nextTripId);

    if (trip?.vehicleId) {
      setVehicleId(trip.vehicleId);
    }

    if (trip?.finalOdometer) {
      setOdometerReading(String(trip.finalOdometer));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const record = fuelManagementService.createFuelLog({
        tripId,
        vehicleId,
        fuelQuantity: Number(fuelQuantity),
        fuelCost: Number(fuelCost),
        odometerReading: Number(odometerReading),
        fuelStation,
        notes,
        loggedAt: loggedAt ? new Date(loggedAt).toISOString() : undefined
      });

      toast.success("Fuel logged. Operational cost and ROI updated automatically.");
      router.push(`/fuel/${record.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log fuel.");
    }
  };

  const selectedVehicle = vehicleId ? fleetVehicleService.findVehicleRecord(vehicleId) : null;

  return (
    <Card>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <Select value={tripId} onChange={(e) => handleTripChange(e.target.value)} required>
          <option value="">Select completed trip</option>
          {completedTrips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.tripNumber} · {trip.origin} → {trip.destination}
            </option>
          ))}
        </Select>
        <Input value={selectedVehicle?.name ?? vehicleId} placeholder="Vehicle" disabled />
        <Input type="date" value={loggedAt} onChange={(e) => setLoggedAt(e.target.value)} />
        <Input value={odometerReading} onChange={(e) => setOdometerReading(e.target.value)} placeholder="Current odometer" required />
        <Input value={fuelQuantity} onChange={(e) => setFuelQuantity(e.target.value)} placeholder="Fuel quantity (L)" required />
        <Input value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} placeholder="Fuel cost" required />
        <Input value={fuelStation} onChange={(e) => setFuelStation(e.target.value)} placeholder="Fuel station" required />
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <p className="text-sm text-muted">
          Fuel logs can only be created for completed trips. Validation runs through the workflow engine.
        </p>
        <Button type="submit">Log fuel</Button>
      </form>
    </Card>
  );
}
