import type { Trip } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import type { TripListQuery } from "@/modules/trips/schemas";
import type { ITripRepository } from "@/modules/trips/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryTripRepository implements ITripRepository {
  constructor(private trips: Trip[] = []) {}

  findAll() {
    return [...this.trips];
  }

  findById(id: string) {
    return this.trips.find((trip) => trip.id === id) ?? null;
  }

  create(trip: Trip) {
    this.trips.push(trip);
    return trip;
  }

  updateStatus(id: string, status: TripStatus): void {
    const trip = this.findById(id);
    if (trip) {
      trip.status = status;
      trip.updatedAt = new Date().toISOString();
    }
  }

  update(id: string, patch: Partial<Trip>) {
    const index = this.trips.findIndex((trip) => trip.id === id);

    if (index < 0) {
      throw new Error(`Trip ${id} not found.`);
    }

    const updated = { ...this.trips[index], ...patch };
    this.trips[index] = updated;
    return updated;
  }

  query(query: TripListQuery) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["tripNumber", "origin", "destination"];

    let items = this.trips.filter((trip) => {
      if (query.status && trip.status !== query.status) {
        return false;
      }

      if (query.vehicleId && trip.vehicleId !== query.vehicleId) {
        return false;
      }

      if (query.driverId && trip.driverId !== query.driverId) {
        return false;
      }

      if (query.dateFrom && new Date(trip.createdAt) < new Date(query.dateFrom)) {
        return false;
      }

      if (query.dateTo && new Date(trip.createdAt) > new Date(query.dateTo)) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = trip[field as keyof Trip];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof Trip];
        const rightValue = right[field as keyof Trip];

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

  nextTripNumber() {
    const next = this.trips.length + 1;
    return `TRP-${String(next).padStart(4, "0")}`;
  }
}
