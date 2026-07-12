import { DriverStatus, MaintenanceStatus, TripStatus, VehicleStatus } from "@/shared/domain/enums";

export const MAX_TRIP_STATES = 4;

export const VALID_DRIVER_ASSIGNMENT_RULES = {
  requiredStatus: DriverStatus.Available,
  blockedStatuses: [DriverStatus.OnTrip, DriverStatus.OffDuty, DriverStatus.Suspended],
  requiresValidLicense: true,
  preventsOverlappingTrips: true
} as const;

export const VALID_VEHICLE_ASSIGNMENT_RULES = {
  requiredStatus: VehicleStatus.Available,
  blockedStatuses: [VehicleStatus.OnTrip, VehicleStatus.InShop, VehicleStatus.Retired],
  preventsOverlappingTrips: true,
  requiresActiveRegistration: true
} as const;

export const CAPACITY_VALIDATION = {
  requiresPositiveCapacity: true,
  preventsOverCapacityTrip: true,
  capacitySource: "vehicle.capacity"
} as const;

export const LICENSE_VALIDATION = {
  requiresLicenseNumber: true,
  requiresFutureExpiryDate: true,
  blocksExpiredLicenseAssignment: true,
  warningWindowDays: 30
} as const;

export const MAINTENANCE_RULES = {
  activeMaintenanceBlocksVehicleAssignment: true,
  inShopVehicleBlocksDispatch: true,
  completedMaintenanceCanReleaseVehicle: true,
  activeStatus: MaintenanceStatus.Active,
  completedStatus: MaintenanceStatus.Completed
} as const;

export const STATUS_TRANSITION_RULES = {
  vehicle: {
    [VehicleStatus.Available]: [VehicleStatus.OnTrip, VehicleStatus.InShop, VehicleStatus.Retired],
    [VehicleStatus.OnTrip]: [VehicleStatus.Available, VehicleStatus.InShop],
    [VehicleStatus.InShop]: [VehicleStatus.Available, VehicleStatus.Retired],
    [VehicleStatus.Retired]: []
  },
  driver: {
    [DriverStatus.Available]: [DriverStatus.OnTrip, DriverStatus.OffDuty, DriverStatus.Suspended],
    [DriverStatus.OnTrip]: [DriverStatus.Available, DriverStatus.OffDuty],
    [DriverStatus.OffDuty]: [DriverStatus.Available, DriverStatus.Suspended],
    [DriverStatus.Suspended]: [DriverStatus.Available]
  },
  trip: {
    [TripStatus.Draft]: [TripStatus.Dispatched, TripStatus.Cancelled],
    [TripStatus.Dispatched]: [TripStatus.Completed, TripStatus.Cancelled],
    [TripStatus.Completed]: [],
    [TripStatus.Cancelled]: []
  },
  maintenance: {
    [MaintenanceStatus.Active]: [MaintenanceStatus.Completed],
    [MaintenanceStatus.Completed]: []
  }
} as const;
