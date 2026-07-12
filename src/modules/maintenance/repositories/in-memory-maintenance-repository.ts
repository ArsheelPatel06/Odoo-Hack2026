import type { MaintenanceLog } from "@/shared/domain/models";
import type { MaintenanceListQuery } from "@/modules/maintenance/schemas";
import type { IMaintenanceRepository } from "@/modules/maintenance/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryMaintenanceRepository implements IMaintenanceRepository {
  constructor(private records: MaintenanceLog[] = []) {}

  findAll() {
    return [...this.records];
  }

  findById(id: string) {
    return this.records.find((record) => record.id === id) ?? null;
  }

  findByVehicleId(vehicleId: string) {
    return this.records.filter((record) => record.vehicleId === vehicleId);
  }

  create(maintenance: MaintenanceLog) {
    this.records.push(maintenance);
    return maintenance;
  }

  update(id: string, patch: Partial<MaintenanceLog>) {
    const index = this.records.findIndex((record) => record.id === id);

    if (index < 0) {
      throw new Error(`Maintenance ${id} not found.`);
    }

    const updated = { ...this.records[index], ...patch };
    this.records[index] = updated;
    return updated;
  }

  query(query: MaintenanceListQuery) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["maintenanceNumber", "title", "assignedTechnician"];

    let items = this.records.filter((record) => {
      if (query.status && record.status !== query.status) {
        return false;
      }

      if (query.priority && record.priority !== query.priority) {
        return false;
      }

      if (query.vehicleId && record.vehicleId !== query.vehicleId) {
        return false;
      }

      if (query.technician && !record.assignedTechnician.toLowerCase().includes(query.technician.toLowerCase())) {
        return false;
      }

      if (query.dateFrom && new Date(record.openedAt) < new Date(query.dateFrom)) {
        return false;
      }

      if (query.dateTo && new Date(record.openedAt) > new Date(query.dateTo)) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = record[field as keyof MaintenanceLog];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof MaintenanceLog];
        const rightValue = right[field as keyof MaintenanceLog];

        if (typeof leftValue === "string" || typeof leftValue === "number") {
          if (typeof rightValue === "string" || typeof rightValue === "number") {
            const result = compareValues(leftValue, rightValue);
            return direction === "asc" ? result : -result;
          }
        }

        return 0;
      });
    }

    const total = items.length;
    const page = query.pagination?.page ?? 1;
    const pageSize = query.pagination?.pageSize ?? 10;
    const start = (page - 1) * pageSize;

    return {
      items: items.slice(start, start + pageSize),
      total
    };
  }

  nextMaintenanceNumber() {
    return `MNT-${String(this.records.length + 1).padStart(4, "0")}`;
  }
}
