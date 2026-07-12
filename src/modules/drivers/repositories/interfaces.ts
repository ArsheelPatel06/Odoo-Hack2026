import type { DomainEvent } from "@/core/events";
import type { Driver } from "@/shared/domain/models";
import type { DriverListQuery } from "@/modules/drivers/schemas";
import type { CreateDriverInput, DriverDetail, UpdateDriverInput } from "@/modules/drivers/types";

export interface IDriverRepository {
  findAll(): Driver[];
  findById(id: string): Driver | null;
  findByLicenseNumber(licenseNumber: string): Driver | null;
  create(driver: Driver): Driver;
  update(id: string, patch: Partial<Driver>): Driver;
  query(query: DriverListQuery, referenceDate?: string): { items: Driver[]; total: number };
}

export interface IDriverEventRepository {
  append(driverId: string, event: DomainEvent): void;
  listByDriverId(driverId: string): DomainEvent[];
}

export interface IFleetDriverService {
  createDriver(input: CreateDriverInput): Driver;
  updateDriver(id: string, input: UpdateDriverInput): Driver;
  archiveDriver(id: string): Driver;
  suspendDriver(id: string): Driver;
  reactivateDriver(id: string): Driver;
  getDriverById(id: string): Driver;
  getDriverDetail(id: string): DriverDetail;
  listDrivers(query?: DriverListQuery): { items: Driver[]; total: number; page: number; pageSize: number };
  recordWorkflowEvent(event: DomainEvent): void;
}
