import { LICENSE_VALIDATION } from "@/shared/domain/business-rules";
import { DriverStatus } from "@/shared/domain/enums";
import type { Driver } from "@/shared/domain/models";
import type { DriverComplianceIndicator } from "@/modules/drivers/types";
import type { LicenseExpiryFilter } from "@/modules/drivers/schemas";

export type LicenseComplianceState = "valid" | "expires_soon" | "expired";

export function getLicenseComplianceState(
  licenseExpiresAt: string,
  referenceDate = new Date().toISOString()
): LicenseComplianceState {
  const expiry = new Date(licenseExpiresAt).getTime();
  const reference = new Date(referenceDate).getTime();

  if (expiry < reference) {
    return "expired";
  }

  const warningLimit = new Date(referenceDate);
  warningLimit.setDate(warningLimit.getDate() + LICENSE_VALIDATION.warningWindowDays);

  if (expiry <= warningLimit.getTime()) {
    return "expires_soon";
  }

  return "valid";
}

export function matchesLicenseExpiryFilter(driver: Driver, filter: LicenseExpiryFilter, referenceDate?: string) {
  return getLicenseComplianceState(driver.licenseExpiresAt, referenceDate) === filter;
}

export function buildDriverComplianceIndicators(driver: Driver, referenceDate?: string): DriverComplianceIndicator[] {
  const licenseState = getLicenseComplianceState(driver.licenseExpiresAt, referenceDate);

  return [
    {
      key: "license_valid",
      label: "License Valid",
      tone: "success",
      active: licenseState === "valid"
    },
    {
      key: "expires_soon",
      label: "Expires Soon",
      tone: "warning",
      active: licenseState === "expires_soon"
    },
    {
      key: "expired",
      label: "Expired",
      tone: "danger",
      active: licenseState === "expired"
    },
    {
      key: "suspended",
      label: "Suspended",
      tone: "danger",
      active: driver.status === DriverStatus.Suspended
    },
    {
      key: "available",
      label: "Available",
      tone: "success",
      active: driver.status === DriverStatus.Available
    },
    {
      key: "on_trip",
      label: "On Trip",
      tone: "primary",
      active: driver.status === DriverStatus.OnTrip
    },
    {
      key: "off_duty",
      label: "Off Duty",
      tone: "muted",
      active: driver.status === DriverStatus.OffDuty
    }
  ];
}
