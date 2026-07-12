import type { DriverStatus, ExpenseType, LicenseCategory, MaintenancePriority, MaintenanceStatus, MaintenanceType, TripStatus, UserRole, VehicleStatus, VehicleType } from "@/shared/domain/enums";
import type { EntityId } from "@/shared/domain/types";

export type VehiclePlaceholders = {
  region?: string;
  gpsEnabled?: boolean;
  registrationExpiryAt?: string;
  insuranceExpiryAt?: string;
};

export type Vehicle = {
  id: EntityId;
  registrationNumber: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  capacity: number;
  odometerReading: number;
  acquisitionCost: number;
  isArchived: boolean;
  archivedAt?: string;
  placeholders?: VehiclePlaceholders;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DriverPlaceholders = {
  drivingExperienceYears?: number;
  medicalCertificateStatus?: string;
  trainingRecords?: string;
  accidentHistory?: string;
  emergencyContact?: string;
};

export type Driver = {
  id: EntityId;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiresAt: string;
  safetyScore: number;
  status: DriverStatus;
  isArchived: boolean;
  archivedAt?: string;
  placeholders?: DriverPlaceholders;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TripPlaceholders = {
  gpsTracking?: string;
  liveTracking?: string;
  eta?: string;
  routeOptimization?: string;
  deliveryProof?: string;
  customerSignature?: string;
};

export type Trip = {
  id: EntityId;
  tripNumber: string;
  status: TripStatus;
  origin: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  scheduledStartAt: string;
  scheduledEndAt: string;
  vehicleId?: EntityId;
  driverId?: EntityId;
  finalOdometer?: number;
  fuelConsumed?: number;
  revenue?: number;
  completionNotes?: string;
  placeholders?: TripPlaceholders;
  createdAt: string;
  updatedAt: string;
};

export type MaintenancePlaceholders = {
  serviceVendor?: string;
  warranty?: string;
  partsUsed?: string;
  invoices?: string;
  photos?: string;
  checklist?: string;
  upcomingMaintenance?: string;
  analytics?: string;
};

export type MaintenanceLog = {
  id: EntityId;
  maintenanceNumber: string;
  vehicleId: EntityId;
  status: MaintenanceStatus;
  title: string;
  description?: string;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  assignedTechnician: string;
  estimatedCost: number;
  actualCost?: number;
  partsCost?: number;
  laborCost?: number;
  serviceNotes?: string;
  expectedCompletionAt: string;
  openedAt: string;
  completedAt?: string;
  placeholders?: MaintenancePlaceholders;
  createdAt: string;
  updatedAt: string;
};

export type FuelLogPlaceholders = {
  invoiceUpload?: string;
  receiptOcr?: string;
  fuelCard?: string;
  vendor?: string;
  tax?: string;
  gst?: string;
};

export type FuelLog = {
  id: EntityId;
  fuelLogNumber: string;
  vehicleId: EntityId;
  tripId: EntityId;
  fuelQuantity: number;
  fuelCost: number;
  odometerReading: number;
  fuelStation: string;
  notes?: string;
  loggedAt: string;
  placeholders?: FuelLogPlaceholders;
  createdAt: string;
  updatedAt: string;
};

export type ExpensePlaceholders = {
  receipt?: string;
  invoiceUpload?: string;
  receiptOcr?: string;
  fuelCard?: string;
  vendor?: string;
  tax?: string;
  gst?: string;
};

export type Expense = {
  id: EntityId;
  expenseNumber: string;
  type: ExpenseType;
  amount: number;
  description?: string;
  tripId?: EntityId;
  vehicleId?: EntityId;
  driverId?: EntityId;
  incurredAt: string;
  placeholders?: ExpensePlaceholders;
  createdAt: string;
  updatedAt: string;
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
