import { MockDriver } from "@/core/testing";
import { DriverStatus, LicenseCategory } from "@/shared/domain/enums";
import type { Driver } from "@/shared/domain/models";

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);

export const seedFleetDrivers: Driver[] = [
  MockDriver({
    id: "driver_001",
    name: "Asha Verma",
    email: "asha.verma@transitops.com",
    licenseNumber: "DL-09-2026-0001",
    licenseCategory: LicenseCategory.HMV,
    licenseExpiresAt: nextYear.toISOString(),
    safetyScore: 94,
    status: DriverStatus.Available
  }),
  MockDriver({
    id: "driver_002",
    name: "Rahul Mehta",
    email: "rahul.mehta@transitops.com",
    licenseNumber: "MH-14-2026-0042",
    licenseCategory: LicenseCategory.Transport,
    licenseExpiresAt: nextMonth.toISOString(),
    safetyScore: 88,
    status: DriverStatus.OnTrip
  }),
  MockDriver({
    id: "driver_003",
    name: "Priya Nair",
    email: "priya.nair@transitops.com",
    licenseNumber: "KA-03-2025-0118",
    licenseCategory: LicenseCategory.Commercial,
    licenseExpiresAt: lastMonth.toISOString(),
    safetyScore: 76,
    status: DriverStatus.Available
  }),
  MockDriver({
    id: "driver_004",
    name: "Imran Khan",
    email: "imran.khan@transitops.com",
    licenseNumber: "GJ-07-2026-0099",
    licenseCategory: LicenseCategory.LMV,
    licenseExpiresAt: nextYear.toISOString(),
    safetyScore: 91,
    status: DriverStatus.Suspended
  }),
  MockDriver({
    id: "driver_005",
    name: "Neha Desai",
    email: "neha.desai@transitops.com",
    licenseNumber: "TN-22-2026-0077",
    licenseCategory: LicenseCategory.HMV,
    licenseExpiresAt: nextYear.toISOString(),
    safetyScore: 97,
    status: DriverStatus.OffDuty
  })
];
