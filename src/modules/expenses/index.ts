import { expenseManagementService } from "@/shared/mock-data";

export const expensesModule = {
  key: "expenses",
  label: "Expenses"
} as const;

export * from "@/modules/financial";

export { expenseManagementService };
