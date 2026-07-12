import { DomainError } from "@/core/errors/domain-error";

export class VehicleUnavailableError extends DomainError {
  readonly code = "VEHICLE_UNAVAILABLE";

  constructor(message = "Vehicle is not available for assignment.") {
    super(message);
  }
}

export class VehicleCapacityExceededError extends DomainError {
  readonly code = "VEHICLE_CAPACITY_EXCEEDED";

  constructor(message = "Cargo weight exceeds vehicle capacity.") {
    super(message);
  }
}

export class VehicleRetiredError extends DomainError {
  readonly code = "VEHICLE_RETIRED";

  constructor(message = "Retired vehicles cannot be dispatched or assigned.") {
    super(message);
  }
}

export class VehicleInShopError extends DomainError {
  readonly code = "VEHICLE_IN_SHOP";

  constructor(message = "Vehicle is currently in shop and cannot be dispatched.") {
    super(message);
  }
}

export class DriverUnavailableError extends DomainError {
  readonly code = "DRIVER_UNAVAILABLE";

  constructor(message = "Driver is not available for assignment.") {
    super(message);
  }
}

export class DriverLicenseExpiredError extends DomainError {
  readonly code = "DRIVER_LICENSE_EXPIRED";

  constructor(message = "Driver license is expired or invalid.") {
    super(message);
  }
}

export class VehicleStateError extends DomainError {
  readonly code = "VEHICLE_STATE_ERROR";

  constructor(message = "Vehicle cannot transition to the requested state.") {
    super(message);
  }
}

export class DriverStateError extends DomainError {
  readonly code = "DRIVER_STATE_ERROR";

  constructor(message = "Driver cannot transition to the requested state.") {
    super(message);
  }
}

export class TripStateError extends DomainError {
  readonly code = "TRIP_STATE_ERROR";

  constructor(message = "Trip cannot transition to the requested state.") {
    super(message);
  }
}

export class TripAlreadyCompletedError extends DomainError {
  readonly code = "TRIP_ALREADY_COMPLETED";

  constructor(message = "Trip has already been completed.") {
    super(message);
  }
}

export class MaintenanceStateError extends DomainError {
  readonly code = "MAINTENANCE_STATE_ERROR";

  constructor(message = "Maintenance record cannot transition to the requested state.") {
    super(message);
  }
}

export class MaintenanceAlreadyActiveError extends DomainError {
  readonly code = "MAINTENANCE_ALREADY_ACTIVE";

  constructor(message = "Vehicle already has active maintenance.") {
    super(message);
  }
}

export class RegistrationNotUniqueError extends DomainError {
  readonly code = "REGISTRATION_NOT_UNIQUE";

  constructor(message = "Vehicle registration number must be unique.") {
    super(message);
  }
}

export class LicenseNotUniqueError extends DomainError {
  readonly code = "LICENSE_NOT_UNIQUE";

  constructor(message = "Driver license number must be unique.") {
    super(message);
  }
}

export class FuelValidationError extends DomainError {
  readonly code = "FUEL_VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
  }
}

export class ExpenseValidationError extends DomainError {
  readonly code = "EXPENSE_VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
  }
}

export class EntityNotFoundError extends DomainError {
  readonly code = "ENTITY_NOT_FOUND";

  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" was not found.`);
  }
}
