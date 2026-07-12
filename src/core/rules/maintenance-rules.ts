import type { MaintenanceLog, Vehicle } from "@/shared/domain/models";
import { MaintenanceStatus, VehicleStatus } from "@/shared/domain/enums";
import { MAINTENANCE_RULES } from "@/shared/domain/business-rules";
import { MaintenanceAlreadyActiveError, VehicleInShopError } from "@/core/errors";

export function hasActiveMaintenance(logs: MaintenanceLog[], vehicleId: string) {
  return logs.some(
    (log) => log.vehicleId === vehicleId && log.status === MAINTENANCE_RULES.activeStatus
  );
}

export function assertNoActiveMaintenance(logs: MaintenanceLog[], vehicleId: string) {
  if (hasActiveMaintenance(logs, vehicleId)) {
    throw new MaintenanceAlreadyActiveError();
  }
}

export function assertVehicleNotBlockedByMaintenance(vehicle: Vehicle, logs: MaintenanceLog[]) {
  if (MAINTENANCE_RULES.inShopVehicleBlocksDispatch && vehicle.status === VehicleStatus.InShop) {
    throw new VehicleInShopError();
  }

  if (MAINTENANCE_RULES.activeMaintenanceBlocksVehicleAssignment && hasActiveMaintenance(logs, vehicle.id)) {
    throw new MaintenanceAlreadyActiveError();
  }
}

export function canReleaseVehicleAfterMaintenance(vehicle: Vehicle) {
  return vehicle.status !== VehicleStatus.Retired;
}

export function maintenanceIsActive(log: MaintenanceLog) {
  return log.status === MaintenanceStatus.Active;
}

export function maintenanceIsCompleted(log: MaintenanceLog) {
  return log.status === MaintenanceStatus.Completed;
}
