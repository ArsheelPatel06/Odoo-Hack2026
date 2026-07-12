import type { Vehicle } from "@/shared/domain/models";
import type { VehicleListQuery } from "@/modules/fleet/schemas";
import type { IVehicleRepository } from "@/modules/fleet/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryVehicleRepository implements IVehicleRepository {
  constructor(private vehicles: Vehicle[] = []) {}

  findAll() {
    return [...this.vehicles];
  }

  findById(id: string) {
    return this.vehicles.find((vehicle) => vehicle.id === id) ?? null;
  }

  findByRegistrationNumber(registrationNumber: string) {
    return (
      this.vehicles.find(
        (vehicle) => vehicle.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
      ) ?? null
    );
  }

  create(vehicle: Vehicle) {
    this.vehicles.push(vehicle);
    return vehicle;
  }

  update(id: string, patch: Partial<Vehicle>) {
    const index = this.vehicles.findIndex((vehicle) => vehicle.id === id);

    if (index < 0) {
      throw new Error(`Vehicle ${id} not found.`);
    }

    const updated = { ...this.vehicles[index], ...patch };
    this.vehicles[index] = updated;
    return updated;
  }

  query(query: VehicleListQuery) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["registrationNumber", "name"];

    let items = this.vehicles.filter((vehicle) => {
      if (!query.includeArchived && vehicle.isArchived) {
        return false;
      }

      if (query.type && vehicle.type !== query.type) {
        return false;
      }

      if (query.status && vehicle.status !== query.status) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = vehicle[field as keyof Vehicle];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof Vehicle];
        const rightValue = right[field as keyof Vehicle];

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
}
