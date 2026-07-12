import type { Driver, Expense, FuelLog, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import { DriverStatus, MaintenanceStatus, TripStatus, VehicleStatus } from "@/shared/domain/enums";
import {
  canAssignDriver,
  canAssignVehicle,
  canCancelTrip,
  canCloseMaintenance,
  canCompleteTrip,
  canCreateExpense,
  canDispatchTrip,
  canLogFuel,
  canStartMaintenance
} from "@/core/engine";
import { TripDispatched, TripCompleted, MaintenanceStarted, MaintenanceCompleted, FuelLogged, ExpenseCreated } from "@/core/events";
import {
  transitionDriverStatus,
  transitionMaintenanceStatus,
  transitionTripStatus,
  transitionVehicleStatus
} from "@/core/transitions";
import { TripValidator } from "@/core/validators";
import { workflowFailure, workflowSuccess, type ValidationResult, type WorkflowResult } from "@/core/types";
import type { DomainError } from "@/core/errors";

function nowIso() {
  return new Date().toISOString();
}

function withUpdatedAt<T extends { updatedAt: string }>(entity: T): T {
  return { ...entity, updatedAt: nowIso() };
}

function firstError(result: ValidationResult): DomainError | undefined {
  return result.valid ? undefined : result.errors[0];
}

export function assignVehicle(input: { trip: Trip; vehicle: Vehicle }): WorkflowResult<{ trip: Trip }> {
  const validation = canAssignVehicle(input.vehicle);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  return workflowSuccess({
    trip: withUpdatedAt({
      ...input.trip,
      vehicleId: input.vehicle.id
    })
  });
}

export function assignDriver(input: { trip: Trip; driver: Driver; referenceDate?: string }): WorkflowResult<{ trip: Trip }> {
  const validation = canAssignDriver(input.driver, input.referenceDate);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  return workflowSuccess({
    trip: withUpdatedAt({
      ...input.trip,
      driverId: input.driver.id
    })
  });
}

export function validateTrip(input: Parameters<typeof TripValidator.validateDispatch>[0]) {
  return TripValidator.validateDispatch(input);
}

export function dispatchTrip(input: {
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
  event: ReturnType<typeof TripDispatched.create>;
}> {
  const validation = canDispatchTrip(input);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const trip = withUpdatedAt({
    ...input.trip,
    status: transitionTripStatus(input.trip.status, TripStatus.Dispatched),
    vehicleId: input.vehicle.id,
    driverId: input.driver.id
  });
  const vehicle = withUpdatedAt({
    ...input.vehicle,
    status: transitionVehicleStatus(input.vehicle.status, VehicleStatus.OnTrip)
  });
  const driver = {
    ...input.driver,
    status: transitionDriverStatus(input.driver.status, DriverStatus.OnTrip),
    updatedAt: timestamp
  };

  return workflowSuccess({
    trip,
    vehicle,
    driver,
    event: TripDispatched.create({ tripId: trip.id, vehicleId: vehicle.id, driverId: driver.id, timestamp })
  });
}

export function completeTrip(input: {
  trip: Trip;
  vehicle: Vehicle;
  driver: Driver;
}): WorkflowResult<{
  trip: Trip;
  vehicle: Vehicle;
  driver: Driver;
  event: ReturnType<typeof TripCompleted.create>;
}> {
  const validation = canCompleteTrip(input.trip);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const trip = withUpdatedAt({
    ...input.trip,
    status: transitionTripStatus(input.trip.status, TripStatus.Completed)
  });
  const vehicle = withUpdatedAt({
    ...input.vehicle,
    status: transitionVehicleStatus(input.vehicle.status, VehicleStatus.Available)
  });
  const driver = {
    ...input.driver,
    status: transitionDriverStatus(input.driver.status, DriverStatus.Available),
    updatedAt: timestamp
  };

  return workflowSuccess({
    trip,
    vehicle,
    driver,
    event: TripCompleted.create({ tripId: trip.id, vehicleId: vehicle.id, driverId: driver.id, timestamp })
  });
}

export function cancelTrip(input: {
  trip: Trip;
  vehicle?: Vehicle | null;
  driver?: Driver | null;
}): WorkflowResult<{
  trip: Trip;
  vehicle?: Vehicle;
  driver?: Driver;
}> {
  const validation = canCancelTrip(input.trip);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const trip = withUpdatedAt({
    ...input.trip,
    status: transitionTripStatus(input.trip.status, TripStatus.Cancelled)
  });

  let vehicle: Vehicle | undefined;
  let driver: Driver | undefined;

  if (input.trip.status === TripStatus.Dispatched) {
    if (input.vehicle) {
      vehicle = withUpdatedAt({
        ...input.vehicle,
        status: transitionVehicleStatus(input.vehicle.status, VehicleStatus.Available)
      });
    }

    if (input.driver) {
      driver = {
        ...input.driver,
        status: transitionDriverStatus(input.driver.status, DriverStatus.Available),
        updatedAt: nowIso()
      };
    }
  }

  return workflowSuccess({ trip, vehicle, driver });
}

export function startMaintenance(input: {
  maintenance: MaintenanceLog;
  vehicle: Vehicle;
  maintenanceLogs: MaintenanceLog[];
}): WorkflowResult<{
  maintenance: MaintenanceLog;
  vehicle: Vehicle;
  event: ReturnType<typeof MaintenanceStarted.create>;
}> {
  const validation = canStartMaintenance({ vehicle: input.vehicle, maintenanceLogs: input.maintenanceLogs });
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const maintenance = {
    ...input.maintenance,
    status: MaintenanceStatus.Active,
    openedAt: input.maintenance.openedAt || timestamp
  };
  const vehicle = withUpdatedAt({
    ...input.vehicle,
    status: transitionVehicleStatus(input.vehicle.status, VehicleStatus.InShop)
  });

  return workflowSuccess({
    maintenance,
    vehicle,
    event: MaintenanceStarted.create({
      maintenanceId: maintenance.id,
      vehicleId: vehicle.id,
      timestamp
    })
  });
}

export function closeMaintenance(input: {
  maintenance: MaintenanceLog;
  vehicle: Vehicle;
}): WorkflowResult<{
  maintenance: MaintenanceLog;
  vehicle: Vehicle;
  event: ReturnType<typeof MaintenanceCompleted.create>;
}> {
  const validation = canCloseMaintenance(input.maintenance);
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const maintenance = {
    ...input.maintenance,
    status: transitionMaintenanceStatus(input.maintenance.status, MaintenanceStatus.Completed),
    completedAt: timestamp
  };

  const nextVehicleStatus =
    input.vehicle.status === VehicleStatus.Retired
      ? VehicleStatus.Retired
      : transitionVehicleStatus(input.vehicle.status, VehicleStatus.Available);

  const vehicle = withUpdatedAt({
    ...input.vehicle,
    status: nextVehicleStatus
  });

  return workflowSuccess({
    maintenance,
    vehicle,
    event: MaintenanceCompleted.create({
      maintenanceId: maintenance.id,
      vehicleId: vehicle.id,
      timestamp
    })
  });
}

export function logFuel(input: {
  fuelLog: FuelLog;
  vehicle: Vehicle;
  trip: Trip;
}): WorkflowResult<{
  fuelLog: FuelLog;
  event: ReturnType<typeof FuelLogged.create>;
}> {
  const validation = canLogFuel({
    fuelLog: input.fuelLog,
    vehicle: input.vehicle,
    trip: input.trip
  });
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const fuelLog = {
    ...input.fuelLog,
    loggedAt: input.fuelLog.loggedAt || timestamp,
    updatedAt: timestamp
  };

  return workflowSuccess({
    fuelLog,
    event: FuelLogged.create({
      fuelLogId: fuelLog.id,
      vehicleId: fuelLog.vehicleId,
      tripId: fuelLog.tripId,
      timestamp
    })
  });
}

export function createExpense(input: {
  expense: Expense;
  vehicle?: Vehicle | null;
  trip?: Trip | null;
}): WorkflowResult<{
  expense: Expense;
  event: ReturnType<typeof ExpenseCreated.create>;
}> {
  const validation = canCreateExpense({
    expense: input.expense,
    vehicle: input.vehicle,
    trip: input.trip
  });
  const error = firstError(validation);

  if (error) {
    return workflowFailure(error);
  }

  const timestamp = nowIso();
  const expense = {
    ...input.expense,
    incurredAt: input.expense.incurredAt || timestamp,
    updatedAt: timestamp
  };

  return workflowSuccess({
    expense,
    event: ExpenseCreated.create({
      expenseId: expense.id,
      vehicleId: expense.vehicleId,
      tripId: expense.tripId,
      timestamp
    })
  });
}

export {
  calculateFuelEfficiency,
  calculateOperationalCost,
  calculateROI,
  calculateTripMargin,
  calculateTripProfit,
  calculateVehicleROI
} from "@/core/calculations";
