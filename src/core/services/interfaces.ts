import type { Driver, Expense, FuelLog, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import type { ValidationResult } from "@/core/types";
import type { WorkflowResult } from "@/core/types";

export interface IVehicleService {
  validateRegistrationUnique(registrationNumber: string, vehicles: Vehicle[], excludeId?: string): ValidationResult;
  validateAvailable(vehicle: Vehicle): ValidationResult;
  validateForDispatch(vehicle: Vehicle): ValidationResult;
}

export interface IDriverService {
  validateAvailable(driver: Driver): ValidationResult;
  validateLicense(driver: Driver, referenceDate?: string): ValidationResult;
  validateForAssignment(driver: Driver, referenceDate?: string): ValidationResult;
}

export interface ITripService {
  validateDispatch(input: {
    trip: Trip;
    vehicle: Vehicle;
    driver: Driver;
    maintenanceLogs?: MaintenanceLog[];
    cargoWeight?: number;
    referenceDate?: string;
  }): ValidationResult;
  assignVehicle(input: { trip: Trip; vehicle: Vehicle }): WorkflowResult<{ trip: Trip }>;
  assignDriver(input: { trip: Trip; driver: Driver; referenceDate?: string }): WorkflowResult<{ trip: Trip }>;
  dispatchTrip(input: {
    trip: Trip;
    vehicle: Vehicle;
    driver: Driver;
    maintenanceLogs?: MaintenanceLog[];
    cargoWeight?: number;
    referenceDate?: string;
  }): WorkflowResult<{
    trip: Trip;
    vehicle: Vehicle;
    driver: Driver;
    event: { type: "TripDispatched"; tripId: string; vehicleId: string; driverId: string; timestamp: string };
  }>;
  completeTrip(input: { trip: Trip; vehicle: Vehicle; driver: Driver }): WorkflowResult<{
    trip: Trip;
    vehicle: Vehicle;
    driver: Driver;
    event: { type: "TripCompleted"; tripId: string; vehicleId: string; driverId: string; timestamp: string };
  }>;
  cancelTrip(input: { trip: Trip; vehicle?: Vehicle | null; driver?: Driver | null }): WorkflowResult<{
    trip: Trip;
    vehicle?: Vehicle;
    driver?: Driver;
  }>;
}

export interface IMaintenanceService {
  validateStart(input: { vehicle: Vehicle; maintenanceLogs: MaintenanceLog[] }): ValidationResult;
  validateClose(maintenance: MaintenanceLog): ValidationResult;
  startMaintenance(input: {
    maintenance: MaintenanceLog;
    vehicle: Vehicle;
    maintenanceLogs: MaintenanceLog[];
  }): WorkflowResult<{
    maintenance: MaintenanceLog;
    vehicle: Vehicle;
    event: { type: "MaintenanceStarted"; maintenanceId: string; vehicleId: string; timestamp: string };
  }>;
  closeMaintenance(input: { maintenance: MaintenanceLog; vehicle: Vehicle }): WorkflowResult<{
    maintenance: MaintenanceLog;
    vehicle: Vehicle;
    event: { type: "MaintenanceCompleted"; maintenanceId: string; vehicleId: string; timestamp: string };
  }>;
}

export interface IFuelService {
  validate(input: {
    fuelLog: Pick<FuelLog, "fuelQuantity" | "fuelCost" | "vehicleId" | "tripId">;
    vehicle?: Vehicle | null;
    trip?: Trip | null;
  }): ValidationResult;
}

export interface IExpenseService {
  validate(input: {
    expense: Pick<Expense, "amount" | "type" | "vehicleId">;
    vehicle?: Vehicle | null;
  }): ValidationResult;
}

export interface IAnalyticsService {
  calculateFuelEfficiency(distance: number, fuelQuantity: number): number;
  calculateOperationalCost(fuelCost: number, maintenanceCost: number): number;
  calculateVehicleROI(input: {
    revenue: number;
    fuelCost: number;
    maintenanceCost: number;
    acquisitionCost: number;
  }): number;
  calculateFleetUtilization(input: { activeVehicleHours: number; totalAvailableHours: number }): number;
}
