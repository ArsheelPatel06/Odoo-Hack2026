import { DriverStatus, MaintenanceStatus, TripStatus, VehicleStatus } from "@/shared/domain/enums";

export const VEHICLE_STATUS_COLORS = {
  [VehicleStatus.Available]: "success",
  [VehicleStatus.OnTrip]: "primary",
  [VehicleStatus.InShop]: "warning",
  [VehicleStatus.Retired]: "muted"
} as const;

export const DRIVER_STATUS_COLORS = {
  [DriverStatus.Available]: "success",
  [DriverStatus.OnTrip]: "primary",
  [DriverStatus.OffDuty]: "muted",
  [DriverStatus.Suspended]: "danger"
} as const;

export const TRIP_STATUS_COLORS = {
  [TripStatus.Draft]: "muted",
  [TripStatus.Dispatched]: "primary",
  [TripStatus.Completed]: "success",
  [TripStatus.Cancelled]: "danger"
} as const;

export const MAINTENANCE_STATUS_COLORS = {
  [MaintenanceStatus.Active]: "warning",
  [MaintenanceStatus.Completed]: "success"
} as const;
