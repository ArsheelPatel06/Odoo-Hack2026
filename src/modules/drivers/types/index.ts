import type { CreateDriverSchema, UpdateDriverSchema } from "@/shared/domain/schemas/entity-schemas";
import type { z } from "zod";
import type { DriverListQuery } from "@/modules/drivers/schemas";
import type { Driver } from "@/shared/domain/models";
import type { TimelineEvent } from "@/shared/domain/types";

export type CreateDriverInput = z.infer<typeof CreateDriverSchema>;
export type UpdateDriverInput = z.infer<typeof UpdateDriverSchema>;

export type DriverComplianceIndicator = {
  key: "license_valid" | "expires_soon" | "expired" | "suspended" | "available" | "on_trip" | "off_duty";
  label: string;
  tone: "success" | "warning" | "danger" | "primary" | "muted";
  active: boolean;
};

export type DriverDetail = {
  driver: Driver;
  compliance: DriverComplianceIndicator[];
  overview: {
    placeholders: {
      drivingExperience: string;
      medicalCertificate: string;
      trainingRecords: string;
      accidentHistory: string;
      emergencyContact: string;
    };
  };
  tripHistory: [];
  safetyHistory: [];
  licenseInformation: {
    licenseNumber: string;
    licenseCategory: string;
    licenseExpiresAt: string;
    complianceState: "valid" | "expires_soon" | "expired";
  };
  documents: [];
  timeline: TimelineEvent[];
};

export type DriverListParams = DriverListQuery;
