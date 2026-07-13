"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tripManagementService } from "@/modules/trips";
import {
  DispatchConfirmStep,
  DispatchDriverStep,
  DispatchRoutePreview,
  DispatchRouteStep,
  DispatchStepper,
  DispatchValidationPanel,
  DispatchVehicleStep
} from "@/modules/trips/components/dispatch";
import { Button, PageHeader } from "@/shared/components/ui";

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
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [dispatching, setDispatching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  void refreshKey;
  const vehicles = tripManagementService.getDispatchableVehicles();
  const drivers = tripManagementService.getDispatchableDrivers();
  const trip = tripId ? tripManagementService.getTripById(tripId) : null;
  const validation = tripId ? tripManagementService.getDispatchValidation(tripId) : null;

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);
  const selectedDriver = drivers.find((driver) => driver.id === selectedDriverId);

  const handleCreateTrip = () => {
    try {
      const created = tripManagementService.createTripDraft({
        origin,
        destination,
        cargoWeight: Number(cargoWeight),
        plannedDistance: Number(plannedDistance)
      });
      setTripId(created.id);
      setStep(2);
      toast.success("Trip lane created. Select a vehicle.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create trip.");
    }
  };

  const handleSelectVehicle = (vehicleId: string) => {
    if (!tripId) return;

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
    if (!tripId) return;

    try {
      tripManagementService.assignDriver(tripId, driverId);
      setSelectedDriverId(driverId);
      setRefreshKey((value) => value + 1);
      toast.success("Driver assigned.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to assign driver.");
    }
  };

  const handleDispatch = async () => {
    if (!tripId) return;

    setDispatching(true);
    try {
      tripManagementService.dispatchTrip(tripId);
      toast.success("Trip dispatched. Vehicle and driver are now On Trip.");
      router.push(`/trips/${tripId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Dispatch failed.");
      setRefreshKey((value) => value + 1);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Dispatch Control"
          description="Plan, validate, and release trips through the workflow engine — no manual status edits."
        />
        <Button asChild variant="outline">
          <Link href="/trips">Trip registry</Link>
        </Button>
      </div>

      <DispatchStepper currentStep={step} />

      {tripId ? (
        <DispatchRoutePreview
          origin={origin}
          destination={destination}
          cargoWeight={cargoWeight}
          plannedDistance={plannedDistance}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {step === 1 ? (
            <DispatchRouteStep
              origin={origin}
              destination={destination}
              cargoWeight={cargoWeight}
              plannedDistance={plannedDistance}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onCargoWeightChange={setCargoWeight}
              onPlannedDistanceChange={setPlannedDistance}
              onContinue={handleCreateTrip}
            />
          ) : null}

          {step === 2 ? (
            <DispatchVehicleStep
              vehicles={vehicles}
              cargoWeight={Number(cargoWeight)}
              search={vehicleSearch}
              selectedVehicleId={selectedVehicleId}
              onSearchChange={setVehicleSearch}
              onSelectVehicle={handleSelectVehicle}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          ) : null}

          {step === 3 ? (
            <DispatchDriverStep
              drivers={drivers}
              search={driverSearch}
              selectedDriverId={selectedDriverId}
              onSearchChange={setDriverSearch}
              onSelectDriver={handleSelectDriver}
              onBack={() => setStep(2)}
              onContinue={() => setStep(4)}
            />
          ) : null}

          {step === 4 && trip && validation ? (
            <DispatchConfirmStep
              trip={trip}
              vehicle={selectedVehicle}
              driver={selectedDriver}
              validation={validation}
              dispatching={dispatching}
              onBack={() => setStep(3)}
              onDispatch={handleDispatch}
            />
          ) : null}
        </div>

        {step < 4 ? (
          <DispatchValidationPanel validation={validation} compact />
        ) : null}
      </div>
    </div>
  );
}
