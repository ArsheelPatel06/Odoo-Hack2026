import type { Driver, MaintenanceLog, Trip, Vehicle } from "@/shared/domain/models";
import { DriverStatus, LicenseCategory, MaintenancePriority, MaintenanceStatus, MaintenanceType, TripStatus, VehicleStatus, VehicleType } from "@/shared/domain/enums";

function timestamp() {
  return new Date().toISOString();
}

export function MockVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  const now = timestamp();

  return {
    id: "vehicle_1",
    registrationNumber: "MH-12-AB-1234",
    name: "Transit Truck Alpha",
    type: VehicleType.Truck,
    status: VehicleStatus.Available,
    capacity: 5000,
    odometerReading: 12000,
    acquisitionCost: 850000,
    isArchived: false,
    documentCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

export function MockDriver(overrides: Partial<Driver> = {}): Driver {
  const now = timestamp();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  return {
    id: "driver_1",
    name: "Asha Verma",
    email: "asha.verma@transitops.com",
    phone: "+91-90000-00001",
    licenseNumber: "DL-09-2026-0001",
    licenseCategory: LicenseCategory.HMV,
    licenseExpiresAt: nextYear.toISOString(),
    safetyScore: 92,
    status: DriverStatus.Available,
    isArchived: false,
    documentCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

export function MockTrip(overrides: Partial<Trip> = {}): Trip {
  const now = timestamp();
  const start = new Date();
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  return {
    id: "trip_1",
    tripNumber: "TRP-0001",
    status: TripStatus.Draft,
    origin: "Pune Depot",
    destination: "Mumbai Hub",
    cargoWeight: 1200,
    plannedDistance: 148,
    scheduledStartAt: start.toISOString(),
    scheduledEndAt: end.toISOString(),
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

export function MockMaintenance(overrides: Partial<MaintenanceLog> = {}): MaintenanceLog {
  const now = timestamp();

  return {
    id: "maintenance_1",
    maintenanceNumber: "MNT-0001",
    vehicleId: "vehicle_1",
    status: MaintenanceStatus.Active,
    title: "Brake inspection",
    description: "Scheduled brake pad replacement",
    maintenanceType: MaintenanceType.BrakeService,
    priority: MaintenancePriority.Medium,
    assignedTechnician: "Ravi Sharma",
    estimatedCost: 4500,
    expectedCompletionAt: now,
    openedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

export function MockDispatchReadyTrip(input?: {
  trip?: Partial<Trip>;
  vehicle?: Partial<Vehicle>;
  driver?: Partial<Driver>;
}) {
  const vehicle = MockVehicle(input?.vehicle);
  const driver = MockDriver(input?.driver);
  const trip = MockTrip({
    vehicleId: vehicle.id,
    driverId: driver.id,
    ...input?.trip
  });

  return { trip, vehicle, driver };
}
