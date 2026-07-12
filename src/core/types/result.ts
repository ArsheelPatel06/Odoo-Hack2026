import type { DomainError } from "@/core/errors";

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: DomainError[] };

export type WorkflowResult<T> =
  | { success: true; data: T }
  | { success: false; error: DomainError };

export function validationSuccess(): ValidationResult {
  return { valid: true };
}

export function validationFailure(errors: DomainError[]): ValidationResult {
  return { valid: false, errors };
}

export function workflowSuccess<T>(data: T): WorkflowResult<T> {
  return { success: true, data };
}

export function workflowFailure<T>(error: DomainError): WorkflowResult<T> {
  return { success: false, error };
}

export function mergeValidationResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((result) => (result.valid ? [] : result.errors));

  return errors.length > 0 ? validationFailure(errors) : validationSuccess();
}
