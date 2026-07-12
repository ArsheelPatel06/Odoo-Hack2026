import type { Expense } from "@/shared/domain/models";
import type { ExpenseListQuery } from "@/modules/financial/schemas";
import type { IExpenseRepository } from "@/modules/financial/repositories/interfaces";

function compareValues(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right));
}

export class InMemoryExpenseRepository implements IExpenseRepository {
  constructor(private records: Expense[] = []) {}

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

  create(expense: Expense) {
    this.records.push(expense);
    return expense;
  }

  query(query: ExpenseListQuery) {
    const searchQuery = query.search?.query.trim().toLowerCase() ?? "";
    const searchFields = query.search?.fields ?? ["expenseNumber", "description", "type"];

    let items = this.records.filter((record) => {
      if (query.type && record.type !== query.type) {
        return false;
      }

      if (query.vehicleId && record.vehicleId !== query.vehicleId) {
        return false;
      }

      if (query.tripId && record.tripId !== query.tripId) {
        return false;
      }

      if (query.dateFrom && new Date(record.incurredAt) < new Date(query.dateFrom)) {
        return false;
      }

      if (query.dateTo && new Date(record.incurredAt) > new Date(query.dateTo)) {
        return false;
      }

      if (!searchQuery) {
        return true;
      }

      return searchFields.some((field) => {
        const value = record[field as keyof Expense];
        return typeof value === "string" && value.toLowerCase().includes(searchQuery);
      });
    });

    if (query.sort) {
      const { field, direction } = query.sort;
      items = [...items].sort((left, right) => {
        const leftValue = left[field as keyof Expense];
        const rightValue = right[field as keyof Expense];

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

  nextExpenseNumber() {
    return `EXP-${String(this.records.length + 1).padStart(4, "0")}`;
  }
}
