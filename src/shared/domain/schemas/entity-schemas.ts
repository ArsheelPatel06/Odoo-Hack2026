import { z } from "zod";
import { DriverStatus, ExpenseType, MaintenanceStatus, TripStatus, UserRole, VehicleStatus, VehicleType } from "@/shared/domain/enums";

const EntityIdSchema = z.string().min(1);
const DateTimeSchema = z.string().min(1);
const MoneySchema = z.number().nonnegative();

export const VehicleSchema = z.object({
  id: EntityIdSchema,
  registrationNumber: z.string().min(1),
  type: z.nativeEnum(VehicleType),
  status: z.nativeEnum(VehicleStatus),
  capacity: z.number().nonnegative(),
  odometerReading: z.number().nonnegative(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const DriverSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  phone: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseExpiresAt: DateTimeSchema,
  status: z.nativeEnum(DriverStatus),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const TripSchema = z.object({
  id: EntityIdSchema,
  tripNumber: z.string().min(1),
  status: z.nativeEnum(TripStatus),
  origin: z.string().min(1),
  destination: z.string().min(1),
  scheduledStartAt: DateTimeSchema,
  scheduledEndAt: DateTimeSchema,
  vehicleId: EntityIdSchema.optional(),
  driverId: EntityIdSchema.optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const MaintenanceSchema = z.object({
  id: EntityIdSchema,
  vehicleId: EntityIdSchema,
  status: z.nativeEnum(MaintenanceStatus),
  title: z.string().min(1),
  description: z.string().optional(),
  costEstimate: MoneySchema.optional(),
  openedAt: DateTimeSchema,
  completedAt: DateTimeSchema.optional()
});

export const FuelLogSchema = z.object({
  id: EntityIdSchema,
  vehicleId: EntityIdSchema,
  tripId: EntityIdSchema.optional(),
  fuelQuantity: z.number().nonnegative(),
  fuelCost: MoneySchema,
  odometerReading: z.number().nonnegative(),
  loggedAt: DateTimeSchema
});

export const ExpenseSchema = z.object({
  id: EntityIdSchema,
  type: z.nativeEnum(ExpenseType),
  amount: MoneySchema,
  description: z.string().optional(),
  tripId: EntityIdSchema.optional(),
  vehicleId: EntityIdSchema.optional(),
  driverId: EntityIdSchema.optional(),
  incurredAt: DateTimeSchema
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
