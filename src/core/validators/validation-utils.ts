import type { DomainError } from "@/core/errors";
import {
  mergeValidationResults,
  validationFailure,
  validationSuccess,
  type ValidationResult
} from "@/core/types";

export function toValidationResult(fn: () => void): ValidationResult {
  try {
    fn();
    return validationSuccess();
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      return validationFailure([error as DomainError]);
    }

    throw error;
  }
}

export function runValidations(validators: Array<() => ValidationResult>): ValidationResult {
  return mergeValidationResults(...validators.map((validate) => validate()));
}
