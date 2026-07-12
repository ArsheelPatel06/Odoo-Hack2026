import type { Expense, Vehicle } from "@/shared/domain/models";
import { assertExpenseRules } from "@/core/rules";
import { toValidationResult } from "@/core/validators/validation-utils";
import type { ValidationResult } from "@/core/types";

export const ExpenseValidator = {
  validate(input: {
    expense: Pick<Expense, "amount" | "type" | "vehicleId">;
    vehicle?: Vehicle | null;
  }): ValidationResult {
    return toValidationResult(() => assertExpenseRules(input));
  }
} as const;
