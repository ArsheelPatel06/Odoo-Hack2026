import type { FuelLog, Trip, Vehicle } from "@/shared/domain/models";
import { FuelValidationError } from "@/core/errors";

export function assertPositiveFuelQuantity(quantity: number) {
  if (quantity <= 0) {
    throw new FuelValidationError("Fuel quantity must be greater than zero.");
  }
}

export function assertPositiveFuelCost(cost: number) {
  if (cost <= 0) {
    throw new FuelValidationError("Fuel cost must be greater than zero.");
  }
}

export function assertFuelVehicleExists(vehicle: Vehicle | null | undefined, vehicleId: string) {
  if (!vehicle || vehicle.id !== vehicleId) {
    throw new FuelValidationError("Referenced vehicle does not exist.");
  }
}

export function assertFuelTripExists(trip: Trip | null | undefined, tripId?: string) {
  if (tripId && (!trip || trip.id !== tripId)) {
    throw new FuelValidationError("Referenced trip does not exist.");
  }
}

export function assertFuelLogRules(input: {
  fuelLog: Pick<FuelLog, "fuelQuantity" | "fuelCost" | "vehicleId" | "tripId">;
  vehicle?: Vehicle | null;
  trip?: Trip | null;
}) {
  assertPositiveFuelQuantity(input.fuelLog.fuelQuantity);
  assertPositiveFuelCost(input.fuelLog.fuelCost);
  assertFuelVehicleExists(input.vehicle ?? null, input.fuelLog.vehicleId);
  assertFuelTripExists(input.trip ?? null, input.fuelLog.tripId);
}
