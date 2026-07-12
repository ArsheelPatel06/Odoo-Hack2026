import type { Driver, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import { assertTripDispatchPreconditions, hasTripAssignments } from "@/core/rules";
import { assertVehicleNotBlockedByMaintenance } from "@/core/rules/maintenance-rules";
import { canTransitionTrip } from "@/core/transitions";
import { DriverValidator } from "@/core/validators/driver-validator";
import { runValidations, toValidationResult } from "@/core/validators/validation-utils";
import { VehicleValidator } from "@/core/validators/vehicle-validator";
import { TripAlreadyCompletedError, TripStateError } from "@/core/errors";
import type { ValidationResult } from "@/core/types";

export const TripValidator = {
  validateAssignments(trip: Trip): ValidationResult {
    return hasTripAssignments(trip)
      ? { valid: true }
      : toValidationResult(() => {
          throw new TripStateError("Trip requires both vehicle and driver before dispatch.");
        });
  },

  validateDispatch(input: {
    trip: Trip;
    vehicle: Vehicle;
    driver: Driver;
    maintenanceLogs?: MaintenanceLog[];
    cargoWeight?: number;
    referenceDate?: string;
  }): ValidationResult {
    return runValidations([
      () =>
        input.trip.status === TripStatus.Completed
          ? toValidationResult(() => {
              throw new TripAlreadyCompletedError();
            })
          : { valid: true },
      () =>
        canTransitionTrip(input.trip.status, TripStatus.Dispatched)
          ? { valid: true }
          : toValidationResult(() => {
              throw new TripStateError("Trip cannot be dispatched from its current state.");
            }),
      () => TripValidator.validateAssignments(input.trip),
      () => VehicleValidator.validateForDispatch(input.vehicle),
      () => DriverValidator.validateForAssignment(input.driver, input.referenceDate),
      () =>
        toValidationResult(() =>
          assertTripDispatchPreconditions({
            trip: input.trip,
            vehicle: input.vehicle,
            driver: input.driver,
            cargoWeight: input.cargoWeight,
            referenceDate: input.referenceDate
          })
        ),
      () =>
        toValidationResult(() =>
          assertVehicleNotBlockedByMaintenance(input.vehicle, input.maintenanceLogs ?? [])
        )
    ]);
  },

  validateCompletion(trip: Trip): ValidationResult {
    return runValidations([
      () =>
        canTransitionTrip(trip.status, TripStatus.Completed)
          ? { valid: true }
          : toValidationResult(() => {
              throw new TripStateError("Only dispatched trips can be completed.");
            })
    ]);
  },

  validateCancellation(trip: Trip): ValidationResult {
    return runValidations([
      () =>
        canTransitionTrip(trip.status, TripStatus.Cancelled)
          ? { valid: true }
          : toValidationResult(() => {
              throw new TripStateError("Trip cannot be cancelled from its current state.");
            })
    ]);
  }
} as const;
