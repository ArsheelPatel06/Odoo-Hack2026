import type { FuelLog } from "@/shared/domain/models";
import type { FuelListQuery } from "@/modules/financial/schemas";
import type { IFuelRepository } from "@/modules/financial/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryFuelRepository implements IFuelRepository {
  constructor(private records: FuelLog[] = []) {}

  findAll() {
    return [...this.records];
  }

  findById(id: string) {
    return this.records.find((record) => record.id === id) ?? null;
  }

  findByVehicleId(vehicleId: string) {
    return this.records.filter((record) => record.vehicleId === vehicleId);
  }

  findByTripId(tripId: string) {
    return this.records.filter((record) => record.tripId === tripId);
  }

  create(fuelLog: FuelLog) {
    this.records.push(fuelLog);
    return fuelLog;
  }

  query(query: FuelListQuery) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["fuelLogNumber", "fuelStation", "notes"];

    let items = this.records.filter((record) => {
      if (query.vehicleId && record.vehicleId !== query.vehicleId) {
        return false;
      }

      if (query.tripId && record.tripId !== query.tripId) {
        return false;
      }

      if (query.dateFrom && new Date(record.loggedAt) < new Date(query.dateFrom)) {
        return false;
      }

      if (query.dateTo && new Date(record.loggedAt) > new Date(query.dateTo)) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = record[field as keyof FuelLog];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof FuelLog];
        const rightValue = right[field as keyof FuelLog];

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

  nextFuelLogNumber() {
    return `FUEL-${String(this.records.length + 1).padStart(4, "0")}`;
  }
}
