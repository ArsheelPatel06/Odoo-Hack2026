import {
  DriverStateError,
  MaintenanceStateError,
  TripStateError,
  VehicleStateError
} from "@/core/errors";
import { STATUS_TRANSITION_RULES } from "@/shared/domain/business-rules";
import { DriverStatus, MaintenanceStatus, TripStatus, VehicleStatus } from "@/shared/domain/enums";

export function canTransition<T extends string>(allowed: Record<T, readonly T[]>, from: T, to: T) {
  return allowed[from]?.includes(to) ?? false;
}

export function assertTransition<T extends string>(
  allowed: Record<T, readonly T[]>,
  from: T,
  to: T,
  createError: (message: string) => Error
) {
  if (!canTransition(allowed, from, to)) {
    throw createError(`Invalid transition from ${from} to ${to}.`);
  }
}

export function canTransitionVehicle(from: VehicleStatus, to: VehicleStatus) {
  return canTransition(STATUS_TRANSITION_RULES.vehicle, from, to);
}

export function canTransitionDriver(from: DriverStatus, to: DriverStatus) {
  return canTransition(STATUS_TRANSITION_RULES.driver, from, to);
}

export function canTransitionTrip(from: TripStatus, to: TripStatus) {
  return canTransition(STATUS_TRANSITION_RULES.trip, from, to);
}

export function canTransitionMaintenance(from: MaintenanceStatus, to: MaintenanceStatus) {
  return canTransition(STATUS_TRANSITION_RULES.maintenance, from, to);
}

export function transitionVehicleStatus(from: VehicleStatus, to: VehicleStatus) {
  assertTransition(STATUS_TRANSITION_RULES.vehicle, from, to, (message) => new VehicleStateError(message));
  return to;
}

export function transitionDriverStatus(from: DriverStatus, to: DriverStatus) {
  assertTransition(STATUS_TRANSITION_RULES.driver, from, to, (message) => new DriverStateError(message));
  return to;
}

export function transitionTripStatus(from: TripStatus, to: TripStatus) {
  assertTransition(STATUS_TRANSITION_RULES.trip, from, to, (message) => new TripStateError(message));
  return to;
}

export function transitionMaintenanceStatus(from: MaintenanceStatus, to: MaintenanceStatus) {
  assertTransition(STATUS_TRANSITION_RULES.maintenance, from, to, (message) => new MaintenanceStateError(message));
  return to;
}
