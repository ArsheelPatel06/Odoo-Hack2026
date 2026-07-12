import type { Driver, Trip, Vehicle } from "@/shared/domain/models";
import { CAPACITY_VALIDATION } from "@/shared/domain/business-rules";
import { VehicleCapacityExceededError } from "@/core/errors";
import { assertDriverAvailable, assertLicenseValid } from "@/core/rules/driver-rules";
import { assertVehicleAvailable } from "@/core/rules/vehicle-rules";

export type TripDispatchContext = {
  trip: Trip;
  vehicle: Vehicle;
  driver: Driver;
  cargoWeight?: number;
  referenceDate?: string;
};

export function assertCapacityWithinLimit(vehicle: Vehicle, cargoWeight = 0) {
  if (!CAPACITY_VALIDATION.preventsOverCapacityTrip) {
    return;
  }

  if (cargoWeight > vehicle.capacity) {
    throw new VehicleCapacityExceededError();
  }
}

export function assertTripDispatchPreconditions(context: TripDispatchContext) {
  assertVehicleAvailable(context.vehicle);
  assertDriverAvailable(context.driver);
  assertLicenseValid(context.driver, context.referenceDate);
  assertCapacityWithinLimit(context.vehicle, context.cargoWeight ?? 0);
}

export function hasTripAssignments(trip: Trip) {
  return Boolean(trip.vehicleId && trip.driverId);
}
