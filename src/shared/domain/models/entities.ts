import type { DriverStatus, ExpenseType, MaintenanceStatus, TripStatus, UserRole, VehicleStatus, VehicleType } from "@/shared/domain/enums";
import type { EntityId } from "@/shared/domain/types";

export type Vehicle = {
  id: EntityId;
  registrationNumber: string;
  type: VehicleType;
  status: VehicleStatus;
  capacity: number;
  odometerReading: number;
  createdAt: string;
  updatedAt: string;
};

export type Driver = {
  id: EntityId;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiresAt: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
};

export type Trip = {
  id: EntityId;
  tripNumber: string;
  status: TripStatus;
  origin: string;
  destination: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  vehicleId?: EntityId;
  driverId?: EntityId;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceLog = {
  id: EntityId;
  vehicleId: EntityId;
  status: MaintenanceStatus;
  title: string;
  description?: string;
  costEstimate?: number;
  openedAt: string;
  completedAt?: string;
};

export type FuelLog = {
  id: EntityId;
  vehicleId: EntityId;
  tripId?: EntityId;
  fuelQuantity: number;
  fuelCost: number;
  odometerReading: number;
  loggedAt: string;
};

export type Expense = {
  id: EntityId;
  type: ExpenseType;
  amount: number;
  description?: string;
  tripId?: EntityId;
  vehicleId?: EntityId;
  driverId?: EntityId;
  incurredAt: string;
};

export type Role = {
  id: EntityId;
  name: UserRole;
  permissions: string[];
};

export type User = {
  id: EntityId;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DashboardKPI = {
  id: string;
  label: string;
  value: number | string;
  trend?: number;
  unit?: string;
};

export type Notification = {
  id: EntityId;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  recipientUserId?: EntityId;
};
