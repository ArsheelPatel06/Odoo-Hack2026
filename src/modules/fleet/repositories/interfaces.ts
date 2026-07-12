import type { DomainEvent } from "@/core/events";
import type { Vehicle } from "@/shared/domain/models";
import type { VehicleListQuery } from "@/modules/fleet/schemas";
import type { CreateVehicleInput, UpdateVehicleInput, VehicleDetail } from "@/modules/fleet/types";

export interface IVehicleRepository {
  findAll(): Vehicle[];
  findById(id: string): Vehicle | null;
  findByRegistrationNumber(registrationNumber: string): Vehicle | null;
  create(vehicle: Vehicle): Vehicle;
  update(id: string, patch: Partial<Vehicle>): Vehicle;
  query(query: VehicleListQuery): { items: Vehicle[]; total: number };
}

export interface IVehicleEventRepository {
  append(vehicleId: string, event: DomainEvent): void;
  listByVehicleId(vehicleId: string): DomainEvent[];
}

export interface IFleetVehicleService {
  createVehicle(input: CreateVehicleInput): Vehicle;
  updateVehicle(id: string, input: UpdateVehicleInput): Vehicle;
  archiveVehicle(id: string): Vehicle;
  retireVehicle(id: string): Vehicle;
  getVehicleById(id: string): Vehicle;
  getVehicleDetail(id: string): VehicleDetail;
  listVehicles(query?: VehicleListQuery): { items: Vehicle[]; total: number; page: number; pageSize: number };
  recordWorkflowEvent(event: DomainEvent): void;
}
