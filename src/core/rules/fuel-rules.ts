import type { FuelLog, Trip, Vehicle } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
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

export function assertFuelTripExists(trip: Trip | null | undefined, tripId: string) {
  if (!trip || trip.id !== tripId) {
    throw new FuelValidationError("Referenced trip does not exist.");
  }
}

export function assertFuelTripCompleted(trip: Trip) {
  if (trip.status !== TripStatus.Completed) {
    throw new FuelValidationError("Fuel logs can only be created for completed trips.");
  }
}

export function assertFuelVehicleMatchesTrip(fuelLog: Pick<FuelLog, "vehicleId">, trip: Trip) {
  if (trip.vehicleId && fuelLog.vehicleId !== trip.vehicleId) {
    throw new FuelValidationError("Fuel log vehicle must match the trip vehicle.");
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
  assertFuelTripCompleted(input.trip!);
  assertFuelVehicleMatchesTrip(input.fuelLog, input.trip!);
}
