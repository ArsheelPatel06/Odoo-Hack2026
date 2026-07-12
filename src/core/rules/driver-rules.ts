import type { Driver } from "@/shared/domain/models";
import { DriverStatus } from "@/shared/domain/enums";
import { LICENSE_VALIDATION } from "@/shared/domain/business-rules";
import { DriverLicenseExpiredError, DriverUnavailableError } from "@/core/errors";

export function isLicenseValid(driver: Driver, referenceDate = new Date().toISOString()) {
  if (!driver.licenseNumber.trim()) {
    return false;
  }

  if (!LICENSE_VALIDATION.requiresFutureExpiryDate) {
    return true;
  }

  return new Date(driver.licenseExpiresAt).getTime() >= new Date(referenceDate).getTime();
}

export function assertLicenseValid(driver: Driver, referenceDate = new Date().toISOString()) {
  if (!isLicenseValid(driver, referenceDate)) {
    throw new DriverLicenseExpiredError();
  }
}

export function isDriverAvailable(driver: Driver) {
  return driver.status === DriverStatus.Available;
}

export function isDriverNotSuspended(driver: Driver) {
  return driver.status !== DriverStatus.Suspended;
}

export function isDriverNotOnTrip(driver: Driver) {
  return driver.status !== DriverStatus.OnTrip;
}

export function assertDriverAvailable(driver: Driver) {
  if (driver.status === DriverStatus.Suspended) {
    throw new DriverUnavailableError("Suspended drivers cannot be assigned.");
  }

  if (driver.status === DriverStatus.OnTrip) {
    throw new DriverUnavailableError("Driver is already on a trip.");
  }

  if (driver.status === DriverStatus.OffDuty) {
    throw new DriverUnavailableError("Driver is off duty.");
  }

  if (driver.status !== DriverStatus.Available) {
    throw new DriverUnavailableError();
  }
}
