import type { MaintenanceLog, Vehicle } from "@/shared/domain/models";
import { MaintenanceStatus } from "@/shared/domain/enums";
import { assertNoActiveMaintenance, assertVehicleNotBlockedByMaintenance } from "@/core/rules";
import { canTransitionMaintenance } from "@/core/transitions";
import { runValidations, toValidationResult } from "@/core/validators/validation-utils";
import { MaintenanceStateError } from "@/core/errors";
import type { ValidationResult } from "@/core/types";

export const MaintenanceValidator = {
  validateStart(input: { vehicle: Vehicle; maintenanceLogs: MaintenanceLog[] }): ValidationResult {
    return runValidations([
      () => toValidationResult(() => assertNoActiveMaintenance(input.maintenanceLogs, input.vehicle.id)),
      () => toValidationResult(() => assertVehicleNotBlockedByMaintenance(input.vehicle, input.maintenanceLogs))
    ]);
  },

  validateClose(maintenance: MaintenanceLog): ValidationResult {
    return canTransitionMaintenance(maintenance.status, MaintenanceStatus.Completed)
      ? { valid: true }
      : toValidationResult(() => {
          throw new MaintenanceStateError("Only active maintenance records can be closed.");
        });
  }
} as const;
