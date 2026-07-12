import type { FuelLog, Trip, Vehicle } from "@/shared/domain/models";
import { assertFuelLogRules } from "@/core/rules";
import { toValidationResult } from "@/core/validators/validation-utils";
import type { ValidationResult } from "@/core/types";

export const FuelValidator = {
  validate(input: {
    fuelLog: Pick<FuelLog, "fuelQuantity" | "fuelCost" | "vehicleId" | "tripId">;
    vehicle?: Vehicle | null;
    trip?: Trip | null;
  }): ValidationResult {
    return toValidationResult(() => assertFuelLogRules(input));
  }
} as const;
