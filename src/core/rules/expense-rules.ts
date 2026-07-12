import type { Expense, Trip, Vehicle } from "@/shared/domain/models";
import { ExpenseType } from "@/shared/domain/enums";
import { ExpenseValidationError } from "@/core/errors";

const VALID_EXPENSE_TYPES = new Set<string>(Object.values(ExpenseType));

export function assertPositiveExpenseAmount(amount: number) {
  if (amount <= 0) {
    throw new ExpenseValidationError("Expense amount must be positive.");
  }
}

export function assertExpenseTypeExists(type: ExpenseType) {
  if (!VALID_EXPENSE_TYPES.has(type)) {
    throw new ExpenseValidationError("Expense type does not exist.");
  }
}

export function assertExpenseVehicleExists(vehicle: Vehicle | null | undefined, vehicleId?: string) {
  if (vehicleId && (!vehicle || vehicle.id !== vehicleId)) {
    throw new ExpenseValidationError("Referenced vehicle does not exist.");
  }
}

export function assertExpenseTripExists(trip: Trip | null | undefined, tripId?: string) {
  if (tripId && (!trip || trip.id !== tripId)) {
    throw new ExpenseValidationError("Referenced trip does not exist.");
  }
}

export function assertExpenseRules(input: {
  expense: Pick<Expense, "amount" | "type" | "vehicleId" | "tripId">;
  vehicle?: Vehicle | null;
  trip?: Trip | null;
}) {
  assertPositiveExpenseAmount(input.expense.amount);
  assertExpenseTypeExists(input.expense.type);
  assertExpenseVehicleExists(input.vehicle ?? null, input.expense.vehicleId);
  assertExpenseTripExists(input.trip ?? null, input.expense.tripId);
}
