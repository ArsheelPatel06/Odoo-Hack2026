import type { Vehicle } from "@/shared/domain/models";
import {
  assertRegistrationUnique,
  assertVehicleAvailable,
  isRegistrationUnique,
  isVehicleAvailable,
  isVehicleNotInShop,
  isVehicleNotOnTrip,
  isVehicleNotRetired
} from "@/core/rules";
import { toValidationResult } from "@/core/validators/validation-utils";
import type { ValidationResult } from "@/core/types";

export const VehicleValidator = {
  validateRegistrationUnique(registrationNumber: string, vehicles: Vehicle[], excludeId?: string): ValidationResult {
    return toValidationResult(() => assertRegistrationUnique(registrationNumber, vehicles, excludeId));
  },

  validateAvailable(vehicle: Vehicle): ValidationResult {
    return toValidationResult(() => assertVehicleAvailable(vehicle));
  },

  validateForDispatch(vehicle: Vehicle): ValidationResult {
    return toValidationResult(() => assertVehicleAvailable(vehicle));
  },

  isRegistrationUnique,
  isVehicleAvailable,
  isVehicleNotRetired,
  isVehicleNotInShop,
  isVehicleNotOnTrip
} as const;
