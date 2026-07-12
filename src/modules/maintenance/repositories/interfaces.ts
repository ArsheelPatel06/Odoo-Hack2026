import type { DomainEvent } from "@/core/events";
import type { MaintenanceLog } from "@/shared/domain/models";
import type { MaintenanceListQuery } from "@/modules/maintenance/schemas";
import type { CompleteMaintenanceInput, CreateMaintenanceInput, MaintenanceDetail } from "@/modules/maintenance/types";

export interface IMaintenanceRepository {
  findAll(): MaintenanceLog[];
  findById(id: string): MaintenanceLog | null;
  findByVehicleId(vehicleId: string): MaintenanceLog[];
  create(maintenance: MaintenanceLog): MaintenanceLog;
  update(id: string, patch: Partial<MaintenanceLog>): MaintenanceLog;
  query(query: MaintenanceListQuery): { items: MaintenanceLog[]; total: number };
  nextMaintenanceNumber(): string;
}

export interface IMaintenanceEventRepository {
  append(maintenanceId: string, event: DomainEvent): void;
  listByMaintenanceId(maintenanceId: string): DomainEvent[];
}

export interface IMaintenanceManagementService {
  createMaintenance(input: CreateMaintenanceInput): MaintenanceLog;
  completeMaintenance(id: string, input: CompleteMaintenanceInput): MaintenanceLog;
  getMaintenanceById(id: string): MaintenanceLog;
  getMaintenanceDetail(id: string): MaintenanceDetail;
  listMaintenance(query?: MaintenanceListQuery): { items: MaintenanceLog[]; total: number; page: number; pageSize: number };
  getActiveMaintenanceLogs(): MaintenanceLog[];
}
