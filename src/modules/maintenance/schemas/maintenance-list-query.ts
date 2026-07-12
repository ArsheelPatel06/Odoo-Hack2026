import { z } from "zod";
import { MaintenancePriority, MaintenanceStatus } from "@/shared/domain/enums";
import { PaginationSchema, SearchSchema, SortSchema } from "@/shared/domain/schemas";

export const MaintenanceListQuerySchema = z.object({
  search: SearchSchema.optional(),
  status: z.nativeEnum(MaintenanceStatus).optional(),
  priority: z.nativeEnum(MaintenancePriority).optional(),
  vehicleId: z.string().optional(),
  technician: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: SortSchema.optional(),
  pagination: PaginationSchema.optional()
});

export type MaintenanceListQuery = z.infer<typeof MaintenanceListQuerySchema>;

export const DEFAULT_MAINTENANCE_LIST_QUERY: MaintenanceListQuery = {
  sort: { field: "openedAt", direction: "desc" },
  pagination: { page: 1, pageSize: 10 }
};
