import type { Driver } from "@/shared/domain/models";
import type { DriverListQuery } from "@/modules/drivers/schemas";
import { matchesLicenseExpiryFilter } from "@/modules/drivers/services/driver-compliance";
import type { IDriverRepository } from "@/modules/drivers/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryDriverRepository implements IDriverRepository {
  constructor(private drivers: Driver[] = []) {}

  findAll() {
    return [...this.drivers];
  }

  findById(id: string) {
    return this.drivers.find((driver) => driver.id === id) ?? null;
  }

  findByLicenseNumber(licenseNumber: string) {
    return (
      this.drivers.find((driver) => driver.licenseNumber.toLowerCase() === licenseNumber.toLowerCase()) ?? null
    );
  }

  create(driver: Driver) {
    this.drivers.push(driver);
    return driver;
  }

  update(id: string, patch: Partial<Driver>) {
    const index = this.drivers.findIndex((driver) => driver.id === id);

    if (index < 0) {
      throw new Error(`Driver ${id} not found.`);
    }

    const updated = { ...this.drivers[index], ...patch };
    this.drivers[index] = updated;
    return updated;
  }

  query(query: DriverListQuery, referenceDate?: string) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["name", "licenseNumber", "email", "phone"];

    let items = this.drivers.filter((driver) => {
      if (!query.includeArchived && driver.isArchived) {
        return false;
      }

      if (query.status && driver.status !== query.status) {
        return false;
      }

      if (query.licenseCategory && driver.licenseCategory !== query.licenseCategory) {
        return false;
      }

      if (query.licenseExpiry && !matchesLicenseExpiryFilter(driver, query.licenseExpiry, referenceDate)) {
        return false;
      }

      if (query.minSafetyScore !== undefined && driver.safetyScore < query.minSafetyScore) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = driver[field as keyof Driver];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof Driver];
        const rightValue = right[field as keyof Driver];

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
