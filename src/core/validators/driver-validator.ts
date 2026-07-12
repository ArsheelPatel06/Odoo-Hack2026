import type { Driver } from "@/shared/domain/models";
import {
  assertDriverAvailable,
  assertLicenseValid,
  isDriverAvailable,
  isDriverNotOnTrip,
  isDriverNotSuspended,
  isLicenseValid
} from "@/core/rules";
import { runValidations, toValidationResult } from "@/core/validators/validation-utils";
import type { ValidationResult } from "@/core/types";

export const DriverValidator = {
  validateAvailable(driver: Driver): ValidationResult {
    return toValidationResult(() => assertDriverAvailable(driver));
  },

  validateLicense(driver: Driver, referenceDate?: string): ValidationResult {
    return toValidationResult(() => assertLicenseValid(driver, referenceDate));
  },

  validateForAssignment(driver: Driver, referenceDate?: string): ValidationResult {
    return runValidations([
      () => DriverValidator.validateAvailable(driver),
      () => DriverValidator.validateLicense(driver, referenceDate)
    ]);
  },

  isLicenseValid,
  isDriverAvailable,
  isDriverNotSuspended,
  isDriverNotOnTrip
} as const;
