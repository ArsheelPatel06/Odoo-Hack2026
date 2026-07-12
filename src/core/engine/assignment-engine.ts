import type { Driver, Expense, FuelLog, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import { DriverValidator } from "@/core/validators/driver-validator";
import { ExpenseValidator } from "@/core/validators/expense-validator";
import { FuelValidator } from "@/core/validators/fuel-validator";
import { MaintenanceValidator } from "@/core/validators/maintenance-validator";
import { TripValidator } from "@/core/validators/trip-validator";
import { VehicleValidator } from "@/core/validators/vehicle-validator";
import type { ValidationResult } from "@/core/types";

export function canAssignVehicle(vehicle: Vehicle): ValidationResult {
  return VehicleValidator.validateForDispatch(vehicle);
}

export function canAssignDriver(driver: Driver, referenceDate?: string): ValidationResult {
  return DriverValidator.validateForAssignment(driver, referenceDate);
}

export function canDispatchTrip(input: {
  trip: Trip;
  vehicle: Vehicle;
  driver: Driver;
  maintenanceLogs?: MaintenanceLog[];
  cargoWeight?: number;
  referenceDate?: string;
}): ValidationResult {
  return TripValidator.validateDispatch(input);
}

export function canCompleteTrip(trip: Trip): ValidationResult {
  return TripValidator.validateCompletion(trip);
}

export function canCancelTrip(trip: Trip): ValidationResult {
  return TripValidator.validateCancellation(trip);
}

export function canStartMaintenance(input: { vehicle: Vehicle; maintenanceLogs: MaintenanceLog[] }): ValidationResult {
  return MaintenanceValidator.validateStart(input);
}

export function canCloseMaintenance(maintenance: MaintenanceLog): ValidationResult {
  return MaintenanceValidator.validateClose(maintenance);
}

export function canLogFuel(input: {
  fuelLog: Pick<FuelLog, "fuelQuantity" | "fuelCost" | "vehicleId" | "tripId">;
  vehicle: Vehicle;
  trip: Trip;
}): ValidationResult {
  return FuelValidator.validate(input);
}

export function canCreateExpense(input: {
  expense: Pick<Expense, "amount" | "type" | "vehicleId" | "tripId">;
  vehicle?: Vehicle | null;
  trip?: Trip | null;
}): ValidationResult {
  return ExpenseValidator.validate(input);
}

export function isTripReadyForDispatch(trip: Trip) {
  return trip.status === TripStatus.Draft && TripValidator.validateAssignments(trip).valid;
}
