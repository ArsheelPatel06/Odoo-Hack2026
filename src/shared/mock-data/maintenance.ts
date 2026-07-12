import { MockMaintenance } from "@/core/testing";
import { MaintenancePriority, MaintenanceStatus, MaintenanceType } from "@/shared/domain/enums";
import type { MaintenanceLog } from "@/shared/domain/models";

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);

export const seedMaintenanceRecords: MaintenanceLog[] = [
  MockMaintenance({
    id: "maintenance_001",
    maintenanceNumber: "MNT-0001",
    vehicleId: "vehicle_003",
    status: MaintenanceStatus.Active,
    title: "Brake pad replacement",
    description: "Front and rear brake pads worn below threshold.",
    maintenanceType: MaintenanceType.BrakeService,
    priority: MaintenancePriority.High,
    assignedTechnician: "Ravi Sharma",
    estimatedCost: 8500,
    expectedCompletionAt: nextWeek.toISOString()
  }),
  MockMaintenance({
    id: "maintenance_002",
    maintenanceNumber: "MNT-0002",
    vehicleId: "vehicle_004",
    status: MaintenanceStatus.Completed,
    title: "Oil change service",
    description: "Routine oil and filter replacement.",
    maintenanceType: MaintenanceType.OilChange,
    priority: MaintenancePriority.Low,
    assignedTechnician: "Anita Desai",
    estimatedCost: 3200,
    actualCost: 3100,
    partsCost: 1800,
    laborCost: 1300,
    expectedCompletionAt: lastMonth.toISOString(),
    openedAt: lastMonth.toISOString(),
    completedAt: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    serviceNotes: "Completed ahead of schedule."
  })
];
