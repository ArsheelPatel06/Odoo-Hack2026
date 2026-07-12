import type { CompleteMaintenanceSchema, CreateMaintenanceSchema } from "@/shared/domain/schemas/entity-schemas";
import type { z } from "zod";
import type { MaintenanceLog, Vehicle } from "@/shared/domain/models";
import type { TimelineEvent } from "@/shared/domain/types";
import type { MaintenanceListQuery } from "@/modules/maintenance/schemas";

export type CreateMaintenanceInput = z.infer<typeof CreateMaintenanceSchema>;
export type CompleteMaintenanceInput = z.infer<typeof CompleteMaintenanceSchema>;

export type MaintenanceDetail = {
  maintenance: MaintenanceLog;
  vehicle?: Vehicle;
  cost: {
    estimatedCost: number;
    actualCost?: number;
    partsCost?: number;
    laborCost?: number;
  };
  overview: {
    placeholders: {
      serviceVendor: string;
      warranty: string;
      partsUsed: string;
      invoices: string;
      photos: string;
      checklist: string;
      upcomingMaintenance: string;
      analytics: string;
    };
  };
  serviceNotes: string;
  documents: [];
  timeline: TimelineEvent[];
};

export type MaintenanceListParams = MaintenanceListQuery;
