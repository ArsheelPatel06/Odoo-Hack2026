import type { Vehicle } from "@/shared/domain/models";
import type { ApiResponse, Pagination, TimelineEvent } from "@/shared/domain/types";
import type { CreateVehicleSchema, UpdateVehicleSchema } from "@/shared/domain/schemas/entity-schemas";
import type { z } from "zod";
import type { VehicleListQuery } from "@/modules/fleet/schemas";

export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>;

export type VehicleDetail = {
  vehicle: Vehicle;
  overview: {
    placeholders: {
      gps: string;
      insurance: string;
      registrationExpiry: string;
      documents: string;
    };
  };
  tripHistory: [];
  maintenanceHistory: [];
  fuelLogs: [];
  expenseHistory: [];
  documents: [];
  timeline: TimelineEvent[];
};

export type VehicleRegistryResult = ApiResponse<Vehicle[]>;

export type VehicleListParams = VehicleListQuery & {
  pagination?: Pagination;
};
