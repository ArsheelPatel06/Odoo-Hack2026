import { MockExpense } from "@/core/testing";
import { ExpenseType } from "@/shared/domain/enums";
import type { Expense } from "@/shared/domain/models";

export const seedExpenses: Expense[] = [
  MockExpense({
    id: "expense_001",
    expenseNumber: "EXP-0001",
    type: ExpenseType.Toll,
    amount: 450,
    description: "Mumbai-Pune expressway toll",
    tripId: "trip_003",
    vehicleId: "vehicle_001"
  }),
  MockExpense({
    id: "expense_002",
    expenseNumber: "EXP-0002",
    type: ExpenseType.Parking,
    amount: 120,
    description: "Depot parking fee",
    vehicleId: "vehicle_002"
  })
];
