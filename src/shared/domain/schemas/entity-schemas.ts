import { z } from "zod";
import { DriverStatus, ExpenseType, LicenseCategory, MaintenancePriority, MaintenanceStatus, MaintenanceType, TripStatus, UserRole, VehicleStatus, VehicleType } from "@/shared/domain/enums";

const EntityIdSchema = z.string().min(1);
const DateTimeSchema = z.string().min(1);
const MoneySchema = z.number().nonnegative();

const VehiclePlaceholdersSchema = z.object({
  region: z.string().optional(),
  gpsEnabled: z.boolean().optional(),
  registrationExpiryAt: DateTimeSchema.optional(),
  insuranceExpiryAt: DateTimeSchema.optional()
});

export const VehicleSchema = z.object({
  id: EntityIdSchema,
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(VehicleType),
  status: z.nativeEnum(VehicleStatus),
  capacity: z.number().positive(),
  odometerReading: z.number().nonnegative(),
  acquisitionCost: MoneySchema,
  isArchived: z.boolean(),
  archivedAt: DateTimeSchema.optional(),
  placeholders: VehiclePlaceholdersSchema.optional(),
  documentCount: z.number().int().nonnegative(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateVehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(VehicleType),
  capacity: z.number().positive(),
  odometerReading: z.number().nonnegative(),
  acquisitionCost: MoneySchema
});

export const UpdateVehicleSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().positive().optional(),
  odometerReading: z.number().nonnegative().optional(),
  acquisitionCost: MoneySchema.optional()
});

const DriverPlaceholdersSchema = z.object({
  drivingExperienceYears: z.number().nonnegative().optional(),
  medicalCertificateStatus: z.string().optional(),
  trainingRecords: z.string().optional(),
  accidentHistory: z.string().optional(),
  emergencyContact: z.string().optional()
});

export const DriverSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.nativeEnum(LicenseCategory),
  licenseExpiresAt: DateTimeSchema,
  safetyScore: z.number().min(0).max(100),
  status: z.nativeEnum(DriverStatus),
  isArchived: z.boolean(),
  archivedAt: DateTimeSchema.optional(),
  placeholders: DriverPlaceholdersSchema.optional(),
  documentCount: z.number().int().nonnegative(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateDriverSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.nativeEnum(LicenseCategory),
  licenseExpiresAt: DateTimeSchema,
  safetyScore: z.number().min(0).max(100).optional()
});

export const UpdateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  licenseCategory: z.nativeEnum(LicenseCategory).optional(),
  licenseExpiresAt: DateTimeSchema.optional()
});

const TripPlaceholdersSchema = z.object({
  gpsTracking: z.string().optional(),
  liveTracking: z.string().optional(),
  eta: z.string().optional(),
  routeOptimization: z.string().optional(),
  deliveryProof: z.string().optional(),
  customerSignature: z.string().optional()
});

export const TripSchema = z.object({
  id: EntityIdSchema,
  tripNumber: z.string().min(1),
  status: z.nativeEnum(TripStatus),
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargoWeight: z.number().nonnegative(),
  plannedDistance: z.number().nonnegative(),
  scheduledStartAt: DateTimeSchema,
  scheduledEndAt: DateTimeSchema,
  vehicleId: EntityIdSchema.optional(),
  driverId: EntityIdSchema.optional(),
  finalOdometer: z.number().nonnegative().optional(),
  fuelConsumed: z.number().nonnegative().optional(),
  revenue: MoneySchema.optional(),
  completionNotes: z.string().optional(),
  placeholders: TripPlaceholdersSchema.optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateTripSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargoWeight: z.number().nonnegative(),
  plannedDistance: z.number().nonnegative(),
  scheduledStartAt: DateTimeSchema.optional(),
  scheduledEndAt: DateTimeSchema.optional()
});

export const CompleteTripSchema = z.object({
  finalOdometer: z.number().nonnegative(),
  fuelConsumed: z.number().nonnegative(),
  revenue: MoneySchema,
  completionNotes: z.string().optional()
});

const MaintenancePlaceholdersSchema = z.object({
  serviceVendor: z.string().optional(),
  warranty: z.string().optional(),
  partsUsed: z.string().optional(),
  invoices: z.string().optional(),
  photos: z.string().optional(),
  checklist: z.string().optional(),
  upcomingMaintenance: z.string().optional(),
  analytics: z.string().optional()
});

export const MaintenanceSchema = z.object({
  id: EntityIdSchema,
  maintenanceNumber: z.string().min(1),
  vehicleId: EntityIdSchema,
  status: z.nativeEnum(MaintenanceStatus),
  title: z.string().min(1),
  description: z.string().optional(),
  maintenanceType: z.nativeEnum(MaintenanceType),
  priority: z.nativeEnum(MaintenancePriority),
  assignedTechnician: z.string().min(1),
  estimatedCost: MoneySchema,
  actualCost: MoneySchema.optional(),
  partsCost: MoneySchema.optional(),
  laborCost: MoneySchema.optional(),
  serviceNotes: z.string().optional(),
  expectedCompletionAt: DateTimeSchema,
  openedAt: DateTimeSchema,
  completedAt: DateTimeSchema.optional(),
  placeholders: MaintenancePlaceholdersSchema.optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateMaintenanceSchema = z.object({
  vehicleId: EntityIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  maintenanceType: z.nativeEnum(MaintenanceType),
  priority: z.nativeEnum(MaintenancePriority),
  assignedTechnician: z.string().min(1),
  estimatedCost: MoneySchema,
  expectedCompletionAt: DateTimeSchema
});

export const CompleteMaintenanceSchema = z.object({
  actualCost: MoneySchema,
  partsCost: MoneySchema.optional(),
  laborCost: MoneySchema.optional(),
  serviceNotes: z.string().optional()
});

export const FuelLogSchema = z.object({
  id: EntityIdSchema,
  fuelLogNumber: z.string().min(1),
  vehicleId: EntityIdSchema,
  tripId: EntityIdSchema,
  fuelQuantity: z.number().positive(),
  fuelCost: z.number().positive(),
  odometerReading: z.number().nonnegative(),
  fuelStation: z.string().min(1),
  notes: z.string().optional(),
  loggedAt: DateTimeSchema,
  placeholders: z
    .object({
      invoiceUpload: z.string().optional(),
      receiptOcr: z.string().optional(),
      fuelCard: z.string().optional(),
      vendor: z.string().optional(),
      tax: z.string().optional(),
      gst: z.string().optional()
    })
    .optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateFuelLogSchema = z.object({
  tripId: EntityIdSchema,
  vehicleId: EntityIdSchema,
  fuelQuantity: z.number().positive(),
  fuelCost: z.number().positive(),
  odometerReading: z.number().nonnegative(),
  fuelStation: z.string().min(1),
  notes: z.string().optional(),
  loggedAt: DateTimeSchema.optional()
});

export const ExpenseSchema = z.object({
  id: EntityIdSchema,
  expenseNumber: z.string().min(1),
  type: z.nativeEnum(ExpenseType),
  amount: z.number().positive(),
  description: z.string().optional(),
  tripId: EntityIdSchema.optional(),
  vehicleId: EntityIdSchema.optional(),
  driverId: EntityIdSchema.optional(),
  incurredAt: DateTimeSchema,
  placeholders: z
    .object({
      receipt: z.string().optional(),
      invoiceUpload: z.string().optional(),
      receiptOcr: z.string().optional(),
      fuelCard: z.string().optional(),
      vendor: z.string().optional(),
      tax: z.string().optional(),
      gst: z.string().optional()
    })
    .optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const CreateExpenseSchema = z.object({
  type: z.nativeEnum(ExpenseType),
  amount: z.number().positive(),
  description: z.string().optional(),
  tripId: EntityIdSchema.optional(),
  vehicleId: EntityIdSchema.optional(),
  incurredAt: DateTimeSchema.optional()
});

export const RoleSchema = z.object({
  id: EntityIdSchema,
  name: z.nativeEnum(UserRole),
  permissions: z.array(z.string())
});

export const UserSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const DashboardKPISchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  trend: z.number().optional(),
  unit: z.string().optional()
});

export const NotificationSchema = z.object({
  id: EntityIdSchema,
  title: z.string().min(1),
  message: z.string().min(1),
  read: z.boolean(),
  createdAt: DateTimeSchema,
  recipientUserId: EntityIdSchema.optional()
});
